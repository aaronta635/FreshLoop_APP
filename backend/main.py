from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from core.middleware import start_up_db
from core.db import Base, engine
import models  # ensure models are imported so metadata is populated
from api.endpoints import router
from pathlib import Path

app = FastAPI()


@app.on_event("startup")
def start_up():
    start_up_db()
    # Create all tables once at startup (no Alembic usage).
    Base.metadata.create_all(bind=engine)


app.include_router(router)

Path("static/uploads").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")