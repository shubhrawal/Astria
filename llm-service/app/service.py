import json
import os

from google import genai
from pydantic import ValidationError

from .prompts import build_plan_prompt
from .schemas import CheckInRequest, PlanResponse


class GeminiPlanService:
    def __init__(self) -> None:
        self.model_name = os.getenv("model_name", "gemini-2.5-flash")
        self.client = genai.Client(api_key=os.getenv("gemini_api_key"))

    def generate_plan(self, request: CheckInRequest) -> PlanResponse:
        cleaned_tasks = [task.strip() for task in request.tasks if task and task.strip()]
        if not cleaned_tasks:
            raise ValueError("At least one non-empty task is required.")

        payload = request.model_copy(update={"tasks": cleaned_tasks})

        prompt = build_plan_prompt(
            json.dumps(payload.model_dump(), ensure_ascii=False, indent=2)
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": PlanResponse.model_json_schema(),
            },
        )

        if not response.text:
            raise RuntimeError("Gemini returned an empty response.")

        try:
            return PlanResponse.model_validate_json(response.text)
        except ValidationError as exc:
            raise RuntimeError(f"Gemini returned invalid JSON: {exc}") from exc
