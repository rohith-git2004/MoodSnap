from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from database import db
from schemas.mood_schema import LoginSchema
from utils.role_checker import require_admin, require_valid_role

router = APIRouter()

def serialize_user(user):
    return {
        "userId": str(user["_id"]),
        "username": user["username"],
        "role": user["role"]
    }

@router.post("/login")
async def login(payload: LoginSchema):
    username = payload.username.strip()
    role = payload.role.strip().lower()

    if not username:
        raise HTTPException(status_code=400, detail="Username is required")

    require_valid_role(role)

    user = await db.users.find_one({"username": username, "role": role})

    if not user:
        new_user = {
            "username": username,
            "role": role
        }
        result = await db.users.insert_one(new_user)
        user = await db.users.find_one({"_id": result.inserted_id})

    return serialize_user(user)

@router.get("/users")
async def get_users(role: str = Query(...), userId: str = Query(...)):
    require_admin(role)

    users_cursor = db.users.find({}, {"username": 1, "role": 1})
    users = await users_cursor.to_list(length=100)

    return [
        {
            "_id": str(user["_id"]),
            "username": user["username"],
            "role": user["role"]
        }
        for user in users
    ]