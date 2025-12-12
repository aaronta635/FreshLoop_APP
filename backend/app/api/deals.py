from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.utils.auth_dependencies import get_current_user
from app.schemas.deal import DealResponse, DealCreate
from app.models.deal import Deal
from app.models.user import User, UserRole
from datetime import datetime
from typing import List
import random
import os
import shutil
import uuid
from pathlib import Path

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def generate_unique_id():
    return f"deal_{random.randint(1000, 9999)}"

@router.post("/upload-image/")
async def upload_deal_image(file: UploadFile = File(...)):
    """Upload an image for a deal"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the URL path
        return {"image_url": f"/api/deals/images/{unique_filename}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.get("/images/{filename}")
async def get_deal_image(filename: str):
    """Serve uploaded deal images"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(file_path)


# ============================================
# CUSTOMER ENDPOINTS - Get all active deals
# ============================================

@router.get('/', response_model=List[DealResponse])
@router.get('', response_model=List[DealResponse])
def get_deals(db: Session = Depends(get_db)):
    """Get all active deals for customers"""
    deals = db.query(Deal).filter(Deal.is_active == True, Deal.quantity > 0).all()
    return deals


@router.get('/{deal_id}', response_model=DealResponse)
def get_deal(deal_id: str, db: Session = Depends(get_db)):
    """Get a specific deal by ID"""
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    return deal


# ============================================
# SHOP ENDPOINTS - Manage own deals
# ============================================

@router.get('/my-deals/', response_model=List[DealResponse])
@router.get('/my-deals', response_model=List[DealResponse])
def get_my_deals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all deals created by the current shop owner"""
    if current_user.role != UserRole.shop:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only shop owners can access this endpoint"
        )
    
    deals = db.query(Deal).filter(Deal.vendor_id == current_user.id).all()
    return deals


@router.post("/", response_model=DealResponse)
def create_deal(
    deal: DealCreate, 
    db: Session = Depends(get_db),
):
    """Create a new deal (without authentication - for testing)"""
    try:
        deal_id = generate_unique_id()

        # Parse datetime - handle both with and without timezone
        if deal.ready_time.endswith('Z'):
            ready_time = datetime.fromisoformat(deal.ready_time.replace('Z', '+00:00'))
        else:
            ready_time = datetime.fromisoformat(deal.ready_time)
        
        db_deal = Deal(
            id=deal_id,
            vendor_id=None,
            title=deal.title,
            restaurant_name=deal.restaurant_name,
            description=deal.description,
            price=deal.price,
            quantity=deal.quantity,
            pickup_address=deal.pickup_address,
            image_url=deal.image_url,
            ready_time=ready_time,
            is_active=True
        )

        db.add(db_deal)
        db.commit()
        db.refresh(db_deal)

        return db_deal
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create deal: {str(e)}")


@router.post("/authenticated", response_model=DealResponse)
def create_deal_authenticated(
    deal: DealCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new deal with authentication (for shop owners)"""
    if current_user.role != UserRole.shop:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only shop owners can create deals"
        )
    
    try:
        deal_id = generate_unique_id()

        # Parse datetime
        if deal.ready_time.endswith('Z'):
            ready_time = datetime.fromisoformat(deal.ready_time.replace('Z', '+00:00'))
        else:
            ready_time = datetime.fromisoformat(deal.ready_time)
        
        db_deal = Deal(
            id=deal_id,
            vendor_id=current_user.id,
            title=deal.title,
            restaurant_name=deal.restaurant_name,
            description=deal.description,
            price=deal.price,
            quantity=deal.quantity,
            pickup_address=deal.pickup_address,
            image_url=deal.image_url,
            ready_time=ready_time,
            is_active=True
        )

        db.add(db_deal)
        db.commit()
        db.refresh(db_deal)

        return db_deal
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create deal: {str(e)}")


@router.put("/{deal_id}", response_model=DealResponse)
def update_deal(
    deal_id: str,
    deal_update: DealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a deal (only by its owner)"""
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if deal.vendor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this deal")
    
    # Update fields
    deal.title = deal_update.title
    deal.restaurant_name = deal_update.restaurant_name
    deal.description = deal_update.description
    deal.price = deal_update.price
    deal.quantity = deal_update.quantity
    deal.pickup_address = deal_update.pickup_address
    if deal_update.image_url:
        deal.image_url = deal_update.image_url
    
    if deal_update.ready_time.endswith('Z'):
        deal.ready_time = datetime.fromisoformat(deal_update.ready_time.replace('Z', '+00:00'))
    else:
        deal.ready_time = datetime.fromisoformat(deal_update.ready_time)
    
    db.commit()
    db.refresh(deal)
    return deal


@router.delete("/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deal(
    deal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a deal (only by its owner)"""
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    if deal.vendor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this deal")
    
    db.delete(deal)
    db.commit()
