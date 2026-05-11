from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import secrets

from app.api.routes.auth import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.delivery_plan import DeliveryPlan as DeliveryPlanModel, DeliveryPlanStatus
from app.models.delivery_stop import DeliveryStop as DeliveryStopModel
from app.schemas.delivery_plan import DeliveryPlan as DeliveryPlanSchema, DeliveryPlanCreate, DeliveryPlanUpdate, DeliveryPlanWithStops
from app.schemas.delivery_stop import DeliveryStop as DeliveryStopSchema, DeliveryStopCreate, DeliveryStopUpdate, BulkStopCreate, OptimizedRoute
from app.services.route_optimizer import optimize_route
from app.services.distance_service import calculate_distance
from app.services.google_maps_service import generate_google_maps_link
from app.core.config import settings
from app.services.geocoding_service import GoogleGeocodingService, geocoding_result_to_dict, place_suggestion_to_dict

router = APIRouter()


@router.get("/", response_model=List[DeliveryPlanSchema])
def get_delivery_plans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plans = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.user_id == current_user.id).all()
    return plans


@router.post("/", response_model=DeliveryPlanSchema)
def create_delivery_plan(plan: DeliveryPlanCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_plan = DeliveryPlanModel(**plan.dict(), user_id=current_user.id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan


@router.get("/geocode")
async def geocode_start_address(address: str, current_user: User = Depends(get_current_user)):
    clean_address = address.strip()
    if len(clean_address) < 3:
        raise HTTPException(status_code=400, detail="Address must be at least 3 characters")

    service = GoogleGeocodingService(settings.google_maps_api_key)
    result = await service.geocode_address(clean_address)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Address not found. Please enter latitude and longitude manually.",
        )

    return geocoding_result_to_dict(result)


@router.get("/reverse-geocode")
async def reverse_geocode_start_address(lat: float, lng: float, current_user: User = Depends(get_current_user)):
    service = GoogleGeocodingService(settings.google_maps_api_key)
    result = await service.reverse_geocode(lat, lng)
    return geocoding_result_to_dict(result)


@router.get("/place-autocomplete")
async def autocomplete_start_address(input: str, current_user: User = Depends(get_current_user)):
    clean_input = input.strip()
    if len(clean_input) < 3:
        return {"suggestions": []}

    service = GoogleGeocodingService(settings.google_maps_api_key)
    suggestions = await service.autocomplete_address(clean_input)
    return {"suggestions": [place_suggestion_to_dict(suggestion) for suggestion in suggestions]}


@router.get("/place-details")
async def get_place_details(place_id: str, current_user: User = Depends(get_current_user)):
    clean_place_id = place_id.strip()
    if len(clean_place_id) < 3:
        raise HTTPException(status_code=400, detail="Place ID is required")

    service = GoogleGeocodingService(settings.google_maps_api_key)
    result = await service.geocode_place_id(clean_place_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Place details not found. Please enter latitude and longitude manually.",
        )

    return geocoding_result_to_dict(result)


@router.get("/{plan_id}", response_model=DeliveryPlanWithStops)
def get_delivery_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")

    stops = (
        db.query(DeliveryStopModel)
        .filter(DeliveryStopModel.delivery_plan_id == plan.id)
        .order_by(DeliveryStopModel.sequence_order, DeliveryStopModel.id)
        .all()
    )
    plan.stops = stops
    return plan


@router.patch("/{plan_id}", response_model=DeliveryPlanSchema)
def update_delivery_plan(plan_id: int, plan_update: DeliveryPlanUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    for key, value in plan_update.dict(exclude_unset=True).items():
        setattr(plan, key, value)
    
    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{plan_id}")
def delete_delivery_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    db.delete(plan)
    db.commit()
    return {"message": "Delivery plan deleted"}


@router.post("/{plan_id}/stops/bulk")
async def bulk_create_stops(plan_id: int, bulk_stops: BulkStopCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    geocoding_service = GoogleGeocodingService(settings.google_maps_api_key)
    stops = []
    for stop_data in bulk_stops.stops:
        data = stop_data.dict()
        if not data.get("lat") or not data.get("lng"):
            result = await geocoding_service.geocode_address(data["raw_address"])
            if result:
                data["formatted_address"] = result.formatted_address
                data["lat"] = result.lat
                data["lng"] = result.lng

        stop = DeliveryStopModel(**data, delivery_plan_id=plan_id)
        stops.append(stop)
        db.add(stop)
    
    db.commit()
    for stop in stops:
        db.refresh(stop)
    
    return {"message": f"Created {len(stops)} stops", "stops": stops}


@router.post("/{plan_id}/stops", response_model=DeliveryStopSchema)
async def create_stop(plan_id: int, stop: DeliveryStopCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    data = stop.dict()
    if not data.get("lat") or not data.get("lng"):
        geocoding_service = GoogleGeocodingService(settings.google_maps_api_key)
        result = await geocoding_service.geocode_address(data["raw_address"])
        if result:
            data["formatted_address"] = result.formatted_address
            data["lat"] = result.lat
            data["lng"] = result.lng

    db_stop = DeliveryStopModel(**data, delivery_plan_id=plan_id)
    db.add(db_stop)
    db.commit()
    db.refresh(db_stop)
    return db_stop


@router.patch("/stops/{stop_id}", response_model=DeliveryStopSchema)
def update_stop(stop_id: int, stop_update: DeliveryStopUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stop = db.query(DeliveryStopModel).join(DeliveryPlanModel).filter(
        DeliveryStopModel.id == stop_id, DeliveryPlanModel.user_id == current_user.id
    ).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Delivery stop not found")
    
    for key, value in stop_update.dict(exclude_unset=True).items():
        setattr(stop, key, value)
    
    db.commit()
    db.refresh(stop)
    return stop


@router.delete("/stops/{stop_id}")
def delete_stop(stop_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stop = db.query(DeliveryStopModel).join(DeliveryPlanModel).filter(
        DeliveryStopModel.id == stop_id, DeliveryPlanModel.user_id == current_user.id
    ).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Delivery stop not found")
    
    db.delete(stop)
    db.commit()
    return {"message": "Delivery stop deleted"}


@router.post("/{plan_id}/optimize", response_model=OptimizedRoute)
def optimize_delivery_plan(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    stops = db.query(DeliveryStopModel).filter(DeliveryStopModel.delivery_plan_id == plan_id).all()
    
    # Check if all stops have lat/lng
    if not all(stop.lat and stop.lng for stop in stops):
        raise HTTPException(status_code=400, detail="All stops must have latitude and longitude")
    
    if not plan.start_lat or not plan.start_lng:
        raise HTTPException(status_code=400, detail="Start location must have latitude and longitude")
    
    # Prepare locations: start + stops
    locations = [(plan.start_lat, plan.start_lng)] + [(stop.lat, stop.lng) for stop in stops]
    
    # Optimize route
    route_indices = optimize_route(locations)
    
    # Update sequence_order
    total_distance = 0.0
    for i, stop_index in enumerate(route_indices[1:]):  # Skip start
        stop = stops[stop_index - 1]  # Adjust for start
        stop.sequence_order = i + 1
        # Calculate distance from previous
        prev_lat, prev_lng = locations[route_indices[i]]
        curr_lat, curr_lng = locations[stop_index]
        total_distance += calculate_distance(prev_lat, prev_lng, curr_lat, curr_lng)
    
    # Update plan
    plan.status = DeliveryPlanStatus.optimized
    plan.total_distance_km = total_distance
    plan.total_duration_minutes = (total_distance / 25) * 60  # 25 km/h average speed
    
    db.commit()
    
    # Return optimized route
    ordered_stops = sorted(stops, key=lambda s: s.sequence_order or 999)
    return OptimizedRoute(
        stops=ordered_stops,
        total_distance_km=total_distance,
        total_duration_minutes=plan.total_duration_minutes
    )


@router.get("/{plan_id}/google-maps-link")
def get_google_maps_link(plan_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlanModel).filter(DeliveryPlanModel.id == plan_id, DeliveryPlanModel.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    stops = db.query(DeliveryStopModel).filter(DeliveryStopModel.delivery_plan_id == plan_id).order_by(DeliveryStopModel.sequence_order).all()
    
    if not plan.start_lat or not plan.start_lng:
        raise HTTPException(status_code=400, detail="Start location must have coordinates")
    
    stop_coords = [(stop.lat, stop.lng) for stop in stops if stop.lat and stop.lng]
    
    link = generate_google_maps_link((plan.start_lat, plan.start_lng), stop_coords)
    return {"google_maps_link": link}
