from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.moods import router as moods_router
from routes.stats import router as stats_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(moods_router, prefix="/api/moods", tags=["Moods"])
app.include_router(stats_router, prefix="/api/stats", tags=["Stats"])

@app.get("/")
async def root():
    return {"message": "MoodSnap API running"}