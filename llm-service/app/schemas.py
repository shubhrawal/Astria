from typing import List, Optional
from pydantic import BaseModel, Field, conint


class CheckInRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    energyLevel: conint(ge=1, le=10)
    stressLevel: conint(ge=1, le=10)
    availableMinutes: conint(ge=1, le=1440)
    tasks: List[str] = Field(min_length=1)
    note: Optional[str] = Field(default=None, max_length=1000)


class TaskPlan(BaseModel):
    task: str
    steps: List[str] = Field(min_length=1)


class Reward(BaseModel):
    xp: int
    badge: str
    reason: str


class PlanResponse(BaseModel):
    focusMessage: str
    startHere: str
    priorities: List[str] = Field(min_length=1)
    taskPlans: List[TaskPlan] = Field(min_length=1)
    encouragements: List[str] = Field(min_length=1)
    reward: Reward