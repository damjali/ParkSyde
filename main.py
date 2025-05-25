from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.route import router
from api.routes.auth import app as auth_app

app = FastAPI()

# Include the route and auth apps
app.include_router(router, tags=["cars"])
app.include_router(auth_app, tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)