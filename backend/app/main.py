from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, delivery_plans, driver

app = FastAPI(
    title="Arahin API",
    description="Route optimization API for UMKM delivery businesses",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(delivery_plans.router, prefix="/delivery-plans", tags=["delivery-plans"])
app.include_router(driver.router, prefix="/driver", tags=["driver"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Arahin API"}
