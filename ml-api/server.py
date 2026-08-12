from fastapi import FastAPI

from app.routes import router

app = FastAPI(title="ML API Gateway")
app.include_router(router)
