from sqlalchemy.orm import Session
from app.models import Order
from app.database import SessionLocal
import json

def backfill_item_names():
    db: Session = SessionLocal()
    
    # Get orders with empty or null item_name
    orders = db.query(Order).filter((Order.item_name == None) | (Order.item_name == "")).all()
    print(f"⚡ Backfilling item_name for {len(orders)} orders...")
    
    for order in orders:
        try:
            items = json.loads(order.items)
            if items and "item_name" in items[0]:
                order.item_name = items[0]["item_name"]
        except Exception as e:
            print(f"❌ Error for order {order.id}: {e}")
    
    db.commit()
    db.close()
    print("✅ Backfill completed!")

if __name__ == "__main__":
    backfill_item_names()
