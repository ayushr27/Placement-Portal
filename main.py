import uvicorn
from fastapi import FastAPI
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from src.routes.register import router as student_router
from src.routes.auth import router as auth_router
from src.routes.profile import router as profile_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["default"], include_in_schema=False)
async def index():
    return RedirectResponse(url="/docs")


@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "ok"}

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(profile_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, proxy_headers=True)  # testing......
