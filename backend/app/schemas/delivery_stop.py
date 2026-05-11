from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DeliveryStopStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    delivered = "delivered"
    failed = "failed"


class DeliveryStopBase(BaseModel):
    recipient_name: str
    phone: str
    raw_address: str
    formatted_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    note: Optional[str] = None
    priority: int = 1


class DeliveryStopCreate(DeliveryStopBase):
    pass


class DeliveryStop(DeliveryStopBase):
    id: int
    delivery_plan_id: int
    sequence_order: Optional[int] = None
    status: DeliveryStopStatus
    estimated_arrival: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DeliveryStopUpdate(BaseModel):
    recipient_name: Optional[str] = None
    phone: Optional[str] = None
    raw_address: Optional[str] = None
    formatted_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    note: Optional[str] = None
    priority: Optional[int] = None
    status: Optional[DeliveryStopStatus] = None


class BulkStopCreate(BaseModel):
    stops: List[DeliveryStopCreate]


class OptimizedRoute(BaseModel):
    stops: List[DeliveryStop]
    total_distance_km: float
    total_duration_minutes: float