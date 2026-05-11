"""initial schema

Revision ID: 20260511_000000
Revises:
Create Date: 2026-05-11 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "20260511_000000"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


delivery_plan_status = postgresql.ENUM(
    "draft",
    "optimized",
    "in_delivery",
    "completed",
    name="deliveryplanstatus",
    create_type=False,
)
delivery_stop_status = postgresql.ENUM(
    "pending",
    "in_progress",
    "delivered",
    "failed",
    name="deliverystopstatus",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    delivery_plan_status.create(bind, checkfirst=True)
    delivery_stop_status.create(bind, checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "delivery_plans",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("start_address", sa.String(), nullable=False),
        sa.Column("start_lat", sa.Float(), nullable=True),
        sa.Column("start_lng", sa.Float(), nullable=True),
        sa.Column("status", delivery_plan_status, nullable=True),
        sa.Column("total_distance_km", sa.Float(), nullable=True),
        sa.Column("total_duration_minutes", sa.Float(), nullable=True),
        sa.Column("share_code", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_delivery_plans_id"), "delivery_plans", ["id"], unique=False)
    op.create_index(op.f("ix_delivery_plans_share_code"), "delivery_plans", ["share_code"], unique=True)

    op.create_table(
        "delivery_stops",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("delivery_plan_id", sa.Integer(), nullable=False),
        sa.Column("recipient_name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("raw_address", sa.String(), nullable=False),
        sa.Column("formatted_address", sa.String(), nullable=True),
        sa.Column("lat", sa.Float(), nullable=True),
        sa.Column("lng", sa.Float(), nullable=True),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("priority", sa.Integer(), nullable=True),
        sa.Column("sequence_order", sa.Integer(), nullable=True),
        sa.Column("status", delivery_stop_status, nullable=True),
        sa.Column("estimated_arrival", sa.DateTime(timezone=True), nullable=True),
        sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["delivery_plan_id"], ["delivery_plans.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_delivery_stops_id"), "delivery_stops", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_delivery_stops_id"), table_name="delivery_stops")
    op.drop_table("delivery_stops")

    op.drop_index(op.f("ix_delivery_plans_share_code"), table_name="delivery_plans")
    op.drop_index(op.f("ix_delivery_plans_id"), table_name="delivery_plans")
    op.drop_table("delivery_plans")

    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")

    bind = op.get_bind()
    delivery_stop_status.drop(bind, checkfirst=True)
    delivery_plan_status.drop(bind, checkfirst=True)
