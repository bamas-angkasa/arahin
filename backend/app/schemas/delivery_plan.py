from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

from app.schemas.delivery_stop import DeliveryStop


class DeliveryPlanStatus(str, Enum):
    draft = "draft"
    optimized = "optimized"
    in_delivery = "in_delivery"
    completed = "completed"


class DeliveryPlanBase(BaseModel):
    title: str
    start_address: str
    start_lat: Optional[float] = None
    start_lng: Optional[float] = None


class DeliveryPlanCreate(DeliveryPlanBase):
    pass


class DeliveryPlan(DeliveryPlanBase):
    id: int
    user_id: int
    status: DeliveryPlanStatus
    total_distance_km: Optional[float] = None
    total_duration_minutes: Optional[float] = None
    share_code: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DeliveryPlanWithStops(DeliveryPlan):
    stops: List[DeliveryStop] = []


class DeliveryPlanUpdate(BaseModel):
    title: Optional[str] = None
    start_address: Optional[str] = None
    start_lat: Optional[float] = None
    start_lng: Optional[float] = None
    status: Optional[DeliveryPlanStatus] = None
