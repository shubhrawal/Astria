import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import CheckInRequest, PlanResponse
from .service import GeminiPlanService

load_dotenv()

app = FastAPI(title="Astria LLM Service", version="0.1.0")

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = GeminiPlanService()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate-plan", response_model=PlanResponse)
def generate_plan(request: CheckInRequest):
    try:
        return service.generate_plan(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc