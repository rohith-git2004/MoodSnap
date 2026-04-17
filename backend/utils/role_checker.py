from fastapi import HTTPException

def require_admin(role: str):
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

def require_valid_role(role: str):
    if role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")