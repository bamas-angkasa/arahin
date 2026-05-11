from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class DeliveryPlanStatus(enum.Enum):
    draft = "draft"
    optimized = "optimized"
    in_delivery = "in_delivery"
    completed = "completed"


class DeliveryPlan(Base):
    __tablename__ = "delivery_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    start_address = Column(String, nullable=False)
    start_lat = Column(Float, nullable=True)
    start_lng = Column(Float, nullable=True)
    status = Column(Enum(DeliveryPlanStatus), default=DeliveryPlanStatus.draft)
    total_distance_km = Column(Float, nullable=True)
    total_duration_minutes = Column(Float, nullable=True)
    share_code = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())