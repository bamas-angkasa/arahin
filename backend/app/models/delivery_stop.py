from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class DeliveryStopStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    delivered = "delivered"
    failed = "failed"


class DeliveryStop(Base):
    __tablename__ = "delivery_stops"

    id = Column(Integer, primary_key=True, index=True)
    delivery_plan_id = Column(Integer, ForeignKey("delivery_plans.id"), nullable=False)
    recipient_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    raw_address = Column(String, nullable=False)
    formatted_address = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    note = Column(Text, nullable=True)
    priority = Column(Integer, default=1)
    sequence_order = Column(Integer, nullable=True)
    status = Column(Enum(DeliveryStopStatus), default=DeliveryStopStatus.pending)
    estimated_arrival = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())