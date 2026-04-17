from fastapi import APIRouter, HTTPException, Query
from bson import ObjectId
from datetime import datetime
from database import db
from schemas.mood_schema import MoodCreateSchema
from utils.role_checker import require_admin, require_valid_role

router = APIRouter()

def serialize_mood(doc):
    return {
        "_id": str(doc["_id"]),
        "userId": str(doc["userId"]),
        "mood": doc["mood"],
        "note": doc.get("note", ""),
        "createdAt": doc["createdAt"],
        "username": doc.get("username", "")
    }

@router.post("")
async def create_mood(payload: MoodCreateSchema):
    require_valid_role(payload.role)

    if payload.role != "user":
        raise HTTPException(status_code=403, detail="Only users can create mood entries")

    user = await db.users.find_one({"_id": ObjectId(payload.userId)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    mood_doc = {
        "userId": ObjectId(payload.userId),
        "mood": payload.mood,
        "note": payload.note or "",
        "createdAt": datetime.utcnow(),
        "username": user["username"]
    }

    result = await db.moods.insert_one(mood_doc)
    saved = await db.moods.find_one({"_id": result.inserted_id})

    return serialize_mood(saved)

@router.get("")
async def get_moods(userId: str = Query(...), role: str = Query(...)):
    require_valid_role(role)

    if role == "user":
        cursor = db.moods.find({"userId": ObjectId(userId)}).sort("createdAt", -1).limit(10)
    else:
        cursor = db.moods.find({}).sort("createdAt", -1)

    moods = await cursor.to_list(length=100)

    return [serialize_mood(mood) for mood in moods]

@router.delete("/{mood_id}")
async def delete_mood(mood_id: str, userId: str = Query(...), role: str = Query(...)):
    require_admin(role)

    result = await db.moods.delete_one({"_id": ObjectId(mood_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Mood entry not found")

    return {"message": "Mood entry deleted successfully"}