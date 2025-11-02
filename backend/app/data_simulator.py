import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
from sqlalchemy.orm import Session
from . import models

def generate_sample_data(db: Session, days=30):
    """Generate comprehensive sample data for the canteen"""
    
    print("🍽️  Generating sample canteen data...")
    
    # Create menu items WITH IMAGES
    menu_items = [
        {
            'name': 'Classic Cheeseburger', 
            'description': 'Beef patty with cheese, lettuce, and special sauce',
            'category': 'main', 
            'prep_time': 8, 
            'price': 5.99,
            'popularity_score': 0.9,
            'image': 'https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387'
        },
        {
            'name': 'Veggie Burger', 
            'description': 'Plant-based patty with fresh vegetables',
            'category': 'main', 
            'prep_time': 6, 
            'price': 4.99,
            'popularity_score': 0.7,
            'image': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2072'
        },
        {
            'name': 'Grilled Chicken Sandwich', 
            'description': 'Tender chicken breast with mayo and lettuce',
            'category': 'main', 
            'prep_time': 7, 
            'price': 6.49,
            'popularity_score': 0.8,
            'image': 'https://unsplash.com/photos/a-close-up-of-a-plate-of-food-with-a-sandwich-fWPQDd1ZeBI'
        },
        {
            'name': 'Caesar Salad', 
            'description': 'Fresh romaine lettuce with caesar dressing and croutons',
            'category': 'salad', 
            'prep_time': 4, 
            'price': 7.99,
            'popularity_score': 0.6,
            'image': 'https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387'
        },
        {
            'name': 'French Fries', 
            'description': 'Crispy golden fries with salt',
            'category': 'side', 
            'prep_time': 3, 
            'price': 2.99,
            'popularity_score': 0.95,
            'image': 'https://unsplash.com/photos/potato-fries-and-sliced-potato-on-white-ceramic-plate-H2RzlOijhlQ'
        },
        {
            'name': 'Onion Rings', 
            'description': 'Beer-battered onion rings',
            'category': 'side', 
            'prep_time': 5, 
            'price': 3.49,
            'popularity_score': 0.5,
            'image': 'https://plus.unsplash.com/premium_photo-1683121324272-90f4b4084ac9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387'
        },
        {
            'name': 'Coca Cola', 
            'description': 'Regular Coca Cola 500ml',
            'category': 'drink', 
            'prep_time': 1, 
            'price': 1.99,
            'popularity_score': 0.85,
            'image': 'https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=416'
        },
        {
            'name': 'Coffee', 
            'description': 'Freshly brewed coffee',
            'category': 'drink', 
            'prep_time': 2, 
            'price': 2.49,
            'popularity_score': 0.75,
            'image': 'https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=449'
        },
    ]
    
    # Add menu items to database
    for item_data in menu_items:
        # Check if item already exists to avoid duplicates
        existing_item = db.query(models.MenuItem).filter(
            models.MenuItem.name == item_data['name']
        ).first()
        
        if not existing_item:
            item = models.MenuItem(**item_data)
            db.add(item)
    
    db.commit()
    print("✅ Menu items created with images")
    
    # Create sample users (only if they don't exist)
    existing_user_count = db.query(models.User).count()
    if existing_user_count == 0:
        sample_users = []
        for i in range(1, 51):
            user = models.User(
                username=f"student{i}",
                email=f"student{i}@college.edu",
                hashed_password="fake_hashed_password",  # In real app, use proper hashing
                is_active=True
            )
            sample_users.append(user)
            db.add(user)
        db.commit()
        print("✅ Sample users created")
    
    # Generate orders with realistic patterns (only if no orders exist)
    existing_order_count = db.query(models.Order).count()
    if existing_order_count == 0:
        orders = []
        start_date = datetime.now() - timedelta(days=days)
        current_date = start_date
        
        menu_items_dict = {item.name: item for item in db.query(models.MenuItem).all()}
        
        # Get the maximum existing order ID to continue from there
        max_order_id = db.query(models.Order.id).order_by(models.Order.id.desc()).first()
        order_id = max_order_id[0] + 1 if max_order_id else 1
        
        while current_date <= datetime.now():
            # Different patterns for different days
            day_of_week = current_date.weekday()
            
            # Weekend vs weekday patterns
            if day_of_week >= 5:  # Weekend
                peak_multiplier = 0.7
            else:  # Weekday
                peak_multiplier = 1.0
                
            # Generate orders for each hour of the day
            for hour in range(7, 22):  # 7 AM to 10 PM
                # Base orders per hour
                if hour in [11, 12, 13]:  # Lunch peak
                    base_orders = int(25 * peak_multiplier)
                elif hour in [17, 18, 19]:  # Dinner peak
                    base_orders = int(20 * peak_multiplier)
                else:  # Off-peak
                    base_orders = int(8 * peak_multiplier)
                    
                # Add some randomness
                orders_this_hour = max(0, np.random.poisson(base_orders))
                
                for order_num in range(orders_this_hour):
                    # Random order time within the hour
                    order_time = current_date.replace(
                        hour=hour,
                        minute=np.random.randint(0, 59),
                        second=np.random.randint(0, 59)
                    )
                    
                    # Select random items (1-3 items per order)
                    num_items = np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2])
                    selected_items = np.random.choice(list(menu_items_dict.keys()), num_items, replace=False)
                    
                    # Create order items
                    order_items = []
                    total_price = 0
                    total_prep_time = 0
                    
                    for item_name in selected_items:
                        item = menu_items_dict[item_name]
                        quantity = np.random.randint(1, 3)
                        order_items.append({
                            'item_id': item.id,
                            'item_name': item.name,
                            'quantity': quantity,
                            'price': item.price,
                            'image': item.image  # Include image in order items for frontend
                        })
                        total_price += item.price * quantity
                        total_prep_time += item.prep_time
                    
                    # Create order
                    order = models.Order(
                        id=order_id,
                        user_id=np.random.randint(1, 51),
                        items=json.dumps(order_items),
                        item_name=order_items[0]['item_name'],
                        total_price=round(total_price, 2),
                        order_time=order_time,
                        estimated_wait=total_prep_time + np.random.randint(2, 10),
                        actual_wait=total_prep_time + np.random.randint(1, 15),
                        status='completed',
                        queue_position=np.random.randint(1, 15)
                    )
                    
                    orders.append(order)
                    order_id += 1
                    
                    # Add to database in batches to avoid memory issues
                    if len(orders) >= 1000:
                        db.add_all(orders)
                        db.commit()
                        orders = []
                        print(f"📊 Added 1000 orders...")
            
            current_date += timedelta(days=1)
        
        # Add any remaining orders
        if orders:
            db.add_all(orders)
            db.commit()
        
        print(f"✅ Generated {order_id - 1} sample orders over {days} days")
        return order_id - 1
    else:
        print(f"✅ Database already contains {existing_order_count} orders, skipping order generation")
        return existing_order_count
def update_menu_images(db: Session):
    """Update menu item images if URLs have changed"""
    print("🖼️ Updating menu item images...")

    updated_images = {
        "Classic Cheeseburger": "https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
        "Veggie Burger": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2072",
        "Grilled Chicken Sandwich": "https://unsplash.com/photos/a-close-up-of-a-plate-of-food-with-a-sandwich-fWPQDd1ZeBI",
        "Caesar Salad": "https://plus.unsplash.com/premium_photo-1700089483464-4f76cc3d360b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
        "French Fries": "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387",
        "Coca Cola": "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=416",
        "Coffee": "https://plus.unsplash.com/premium_photo-1675435644687-562e8042b9db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=449"
    }

    for name, url in updated_images.items():
        item = db.query(models.MenuItem).filter(models.MenuItem.name == name).first()
        if item:
            item.image = url
            print(f"✅ Updated image for: {name}")
        else:
            print(f"⚠️  Item not found in DB: {name}")

    db.commit()
    print("🎉 All images updated successfully!")
if __name__ == "__main__":
    from .database import SessionLocal
    db = SessionLocal()
    update_menu_images(db)

