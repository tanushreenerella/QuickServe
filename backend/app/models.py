# models.py
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    category = Column(String)  # main, side, drink, dessert
    prep_time = Column(Integer)  # preparation time in minutes
    price = Column(Float)
    popularity_score = Column(Float, default=0.0)
    is_available = Column(Boolean, default=True)
    image = Column(String, nullable=True)  # Add this line for image URL

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    items = Column(Text)  # JSON string of ordered items
    item_name = Column(String, nullable=True)
    total_price = Column(Float)
    order_time = Column(DateTime, default=datetime.utcnow)
    estimated_wait = Column(Integer)  # in minutes
    actual_wait = Column(Integer)  # in minutes
    status = Column(String, default="pending")  # pending, preparing, ready, completed
    queue_position = Column(Integer)

class QueueAnalytics(Base):
    __tablename__ = "queue_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    queue_length = Column(Integer)
    avg_wait_time = Column(Float)
    orders_processed = Column(Integer)
    peak_hour = Column(Boolean)