from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

def add_middlewares(app):
    app.add_middleware(
        CORSMiddleware,
        # Allow all origins for React Native development
        # In production, you should restrict this
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
