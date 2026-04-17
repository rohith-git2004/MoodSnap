from fastapi import APIRouter, Query
from bson import ObjectId
from database import db
from utils.role_checker import require_valid_role

router = APIRouter()

@router.get("")
async def get_stats(userId: str = Query(...), role: str = Query(...)):
    require_valid_role(role)

    match_stage = {}
    if role == "user":
        match_stage = {"userId": ObjectId(userId)}

    pipeline = [
        {"$match": match_stage},
        {
            "$group": {
                "_id": "$mood",
                "count": {"$sum": 1}
            }
        }
    ]

    results = await db.moods.aggregate(pipeline).to_list(length=20)

    stats = {
        "happy": 0,
        "neutral": 0,
        "angry": 0,
        "sad": 0
    }

    for item in results:
        mood = item["_id"]
        count = item["count"]
        if mood in stats:
            stats[mood] = count

    return stats