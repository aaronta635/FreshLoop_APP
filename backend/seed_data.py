"""
Seed script to add mock deals to the database for testing.
Run with: python seed_data.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from app.models.deal import Deal
from app.database import SessionLocal
import random

# Sample data
RESTAURANTS = [
    {"name": "Harbor Kitchen", "address": "123 Harbor St, Wollongong NSW"},
    {"name": "Sunset Bakery", "address": "45 Beach Rd, Wollongong NSW"},
    {"name": "Green Bowl Cafe", "address": "78 Crown St, Wollongong NSW"},
    {"name": "Tokyo Bites", "address": "22 Keira St, Wollongong NSW"},
    {"name": "Pizza Paradise", "address": "156 Market St, Wollongong NSW"},
    {"name": "The Hungry Chef", "address": "89 Corrimal St, Wollongong NSW"},
    {"name": "Spice Route", "address": "33 Burelli St, Wollongong NSW"},
    {"name": "Ocean Fresh", "address": "12 Marine Dr, Wollongong NSW"},
    {"name": "Cafe Bloom", "address": "67 Smith St, Wollongong NSW"},
    {"name": "Dragon Palace", "address": "44 Church St, Wollongong NSW"},
]

DEAL_TEMPLATES = [
    {"title": "Mystery Bag", "description": "A surprise selection of our best items from today. Perfect for adventurous foodies!", "price": 999},
    {"title": "Bakery Box", "description": "Fresh bread, pastries, and baked goods. Rescued from today's batch.", "price": 799},
    {"title": "Lunch Special", "description": "Hearty lunch items including sandwiches, salads, and sides.", "price": 899},
    {"title": "Dinner Rescue", "description": "Complete dinner portions. Just heat and eat!", "price": 1299},
    {"title": "Breakfast Bundle", "description": "Start your day right with croissants, muffins, and coffee goods.", "price": 699},
    {"title": "Sushi Surprise", "description": "Fresh sushi rolls and nigiri from today's preparation.", "price": 1199},
    {"title": "Pizza Pack", "description": "Whole pizzas with assorted toppings. Great for sharing!", "price": 1099},
    {"title": "Salad Bowl", "description": "Fresh, healthy salads with premium ingredients.", "price": 749},
    {"title": "Curry Combo", "description": "Aromatic curries with rice and sides.", "price": 999},
    {"title": "Dessert Delight", "description": "Sweet treats including cakes, tarts, and pastries.", "price": 599},
    {"title": "Smoothie Pack", "description": "Pre-made smoothies and fresh juices.", "price": 549},
    {"title": "BBQ Box", "description": "Grilled meats and veggies, ready to enjoy.", "price": 1399},
    {"title": "Veggie Feast", "description": "100% vegetarian selection of delicious dishes.", "price": 849},
    {"title": "Seafood Special", "description": "Fresh catches of the day, prepared to perfection.", "price": 1499},
    {"title": "Noodle Bowl", "description": "Asian noodles with your choice of protein.", "price": 899},
]

# Sample image URLs (Unsplash food images)
FOOD_IMAGES = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",  # Salad
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",  # Pizza
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",  # Pancakes
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",  # Veggies
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",  # Pasta
    "https://images.unsplash.com/photo-1482049016gy8d7ceee3a?w=400",  # Sushi
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",  # Steak
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",  # Healthy bowl
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400",  # Pasta 2
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=400",  # Burger
    "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400",  # Ramen
    "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",  # Breakfast
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400",  # French toast
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400",  # Bread
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",  # Curry
]

def generate_deal_id():
    return f"DEAL_{random.randint(10000, 99999)}"

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if we already have deals
        existing_deals = db.query(Deal).count()
        if existing_deals > 5:
            print(f"Database already has {existing_deals} deals. Skipping seed.")
            return
        
        print("🌱 Seeding database with mock deals...")
        
        deals_created = 0
        
        for i, restaurant in enumerate(RESTAURANTS):
            # Create 2-4 deals per restaurant
            num_deals = random.randint(2, 4)
            
            for j in range(num_deals):
                template = random.choice(DEAL_TEMPLATES)
                
                # Random ready time between 30 mins and 6 hours from now
                ready_time = datetime.now() + timedelta(
                    minutes=random.randint(30, 360)
                )
                
                deal = Deal(
                    id=generate_deal_id(),
                    vendor_id=None,  # No vendor association for mock data
                    title=template["title"],
                    restaurant_name=restaurant["name"],
                    description=template["description"],
                    price=template["price"],
                    quantity=random.randint(1, 10),
                    pickup_address=restaurant["address"],
                    image_url=random.choice(FOOD_IMAGES),
                    is_active=True,
                    ready_time=ready_time,
                )
                
                db.add(deal)
                deals_created += 1
        
        db.commit()
        print(f"✅ Created {deals_created} mock deals!")
        
        # Show summary
        print("\n📊 Database Summary:")
        print(f"   Total Deals: {db.query(Deal).count()}")
        print(f"   Active Deals: {db.query(Deal).filter(Deal.is_active == True).count()}")
        print(f"   Restaurants: {len(RESTAURANTS)}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

