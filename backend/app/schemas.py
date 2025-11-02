from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Menu Item Schemas - ADD IMAGE FIELD HERE
class MenuItemBase(BaseModel):
    name: str
    description: str
    category: str
    prep_time: int
    price: float
    image: Optional[str] = None  # <-- ADD THIS LINE

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    popularity_score: float
    is_available: bool
    
    class Config:
        orm_mode = True

# Order Schemas
class OrderItem(BaseModel):
    item_id: int
    quantity: int
    item_name: str
    price: float

class OrderBase(BaseModel):
    user_id: int
    items: List[OrderItem]
    total_price: float

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    order_time: datetime
    estimated_wait: int
    status: str
    queue_position: int
    
    class Config:
        orm_mode = True

# Analytics Schemas
class AnalyticsResponse(BaseModel):
    peak_hours: List[Dict[str, Any]]
    popular_items: List[Dict[str, Any]]
    avg_wait_times: List[Dict[str, Any]]
    total_orders_today: int
    current_queue_length: int

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None