from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
import uuid
import base64
from enum import Enum

# Environment variables
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-here')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
client = AsyncIOMotorClient(MONGO_URL)
db = client.pet_adoption_db

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class OrderStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved" 
    REJECTED = "rejected"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"

# Pydantic Models
class UserBase(BaseModel):
    email: str
    name: str
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str
    address: Optional[str] = ""
    phone: Optional[str] = ""

class UserResponse(UserBase):
    id: str
    address: Optional[str] = ""
    phone: Optional[str] = ""

class UserLogin(BaseModel):
    email: str
    password: str

class PetBase(BaseModel):
    name: str
    category: str
    weight: float
    height: float
    breed: str
    gender: Gender
    description: Optional[str] = ""
    available: bool = True

class PetResponse(PetBase):
    id: str
    created_at: datetime

class OrderBase(BaseModel):
    pet_id: str
    shipping_name: str
    shipping_address: str
    shipping_phone: str

class OrderResponse(BaseModel):
    id: str
    user_id: str
    pet_id: str
    pet_name: str
    shipping_name: str
    shipping_address: str
    shipping_phone: str
    status: OrderStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_jwt_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Startup event to seed admin user
@app.on_event("startup")
async def startup_event():
    # Check if admin exists
    admin_exists = await db.users.find_one({"role": "admin"})
    if not admin_exists:
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@petadoption.com",
            "password": hash_password("admin123"),
            "name": "Admin User",
            "role": "admin",
            "address": "Admin Address",
            "phone": "+1234567890"
        }
        await db.users.insert_one(admin_user)
        print("Admin user created: admin@petadoption.com / admin123")

# Auth endpoints
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "role": user_data.role,
        "address": user_data.address,
        "phone": user_data.phone
    }
    
    await db.users.insert_one(user)
    return UserResponse(**user)

@app.post("/api/auth/login")
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token({"sub": user["id"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": UserResponse(**user)}

# Pet endpoints
@app.get("/api/pets", response_model=List[PetResponse])
async def get_pets():
    pets = await db.pets.find({"available": True}).to_list(length=None)
    return [PetResponse(**pet) for pet in pets]

@app.get("/api/pets/{pet_id}/image")
async def get_pet_image(pet_id: str):
    pet = await db.pets.find_one({"id": pet_id})
    if not pet or "image_data" not in pet:
        raise HTTPException(status_code=404, detail="Pet image not found")
    
    image_data = base64.b64decode(pet["image_data"])
    content_type = pet.get("image_type", "image/jpeg")
    
    return Response(content=image_data, media_type=content_type)

@app.post("/api/pets", response_model=PetResponse)
async def add_pet(
    name: str = Form(...),
    category: str = Form(...),
    weight: float = Form(...),
    height: float = Form(...),
    breed: str = Form(...),
    gender: str = Form(...),
    description: str = Form(""),
    image: UploadFile = File(...),
    current_user: dict = Depends(get_admin_user)
):
    # Read and encode image
    image_content = await image.read()
    image_data = base64.b64encode(image_content).decode('utf-8')
    
    pet = {
        "id": str(uuid.uuid4()),
        "name": name,
        "category": category,
        "weight": weight,
        "height": height,
        "breed": breed,
        "gender": gender,
        "description": description,
        "available": True,
        "image_data": image_data,
        "image_type": image.content_type,
        "created_at": datetime.utcnow()
    }
    
    await db.pets.insert_one(pet)
    return PetResponse(**pet)

@app.get("/api/admin/pets", response_model=List[PetResponse])
async def get_all_pets_admin(current_user: dict = Depends(get_admin_user)):
    pets = await db.pets.find().to_list(length=None)
    return [PetResponse(**pet) for pet in pets]

# Order endpoints
@app.post("/api/orders", response_model=OrderResponse)
async def create_order(order_data: OrderBase, current_user: dict = Depends(get_current_user)):
    # Check if pet exists and is available
    pet = await db.pets.find_one({"id": order_data.pet_id, "available": True})
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found or not available")
    
    # Create order
    order = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "pet_id": order_data.pet_id,
        "pet_name": pet["name"],
        "shipping_name": order_data.shipping_name,
        "shipping_address": order_data.shipping_address,
        "shipping_phone": order_data.shipping_phone,
        "status": OrderStatus.PENDING,
        "created_at": datetime.utcnow()
    }
    
    await db.orders.insert_one(order)
    
    # Mark pet as unavailable
    await db.pets.update_one({"id": order_data.pet_id}, {"$set": {"available": False}})
    
    return OrderResponse(**order)

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_orders(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "admin":
        orders = await db.orders.find().to_list(length=None)
    else:
        orders = await db.orders.find({"user_id": current_user["id"]}).to_list(length=None)
    
    return [OrderResponse(**order) for order in orders]

@app.put("/api/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str, 
    status_update: OrderStatusUpdate, 
    current_user: dict = Depends(get_admin_user)
):
    # Update order status
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status_update.status, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # If rejected, make pet available again
    if status_update.status == OrderStatus.REJECTED:
        order = await db.orders.find_one({"id": order_id})
        await db.pets.update_one({"id": order["pet_id"]}, {"$set": {"available": True}})
    
    updated_order = await db.orders.find_one({"id": order_id})
    return OrderResponse(**updated_order)

@app.get("/api/user/profile", response_model=UserResponse)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)