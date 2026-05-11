from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.delivery_plan import DeliveryPlan
from app.models.delivery_stop import DeliveryStop, DeliveryStopStatus
from app.schemas.delivery_stop import DeliveryStop

router = APIRouter()


@router.get("/{share_code}")
def get_driver_view(share_code: str, db: Session = Depends(get_db)):
    plan = db.query(DeliveryPlan).filter(DeliveryPlan.share_code == share_code).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Delivery plan not found")
    
    stops = db.query(DeliveryStop).filter(DeliveryStop.delivery_plan_id == plan.id).order_by(DeliveryStop.sequence_order).all()
    
    return {
        "plan": {
            "id": plan.id,
            "title": plan.title,
            "start_address": plan.start_address,
            "total_distance_km": plan.total_distance_km,
            "total_duration_minutes": plan.total_duration_minutes
        },
        "stops": stops
    }


@router.patch("/stops/{stop_id}/mark-delivered")
def mark_stop_delivered(stop_id: int, db: Session = Depends(get_db)):
    stop = db.query(DeliveryStop).filter(DeliveryStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Delivery stop not found")
    
    stop.status = DeliveryStopStatus.delivered
    db.commit()
    return {"message": "Stop marked as delivered"}


@router.patch("/stops/{stop_id}/mark-failed")
def mark_stop_failed(stop_id: int, db: Session = Depends(get_db)):
    stop = db.query(DeliveryStop).filter(DeliveryStop.id == stop_id).first()
    if not stop:
        raise HTTPException(status_code=404, detail="Delivery stop not found")
    
    stop.status = DeliveryStopStatus.failed
    db.commit()
    return {"message": "Stop marked as failed"}