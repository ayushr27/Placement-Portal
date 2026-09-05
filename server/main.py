import uvicorn
from fastapi import FastAPI
from starlette.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from src import logger
from src.config import secrets
from src.routes.register import router as student_router
from src.routes.auth import router as auth_router
from src.routes.profile import router as profile_router
from src.routes.jobs import router as jobs_router


app = FastAPI(title="Placement Portal API")

# `allow_origins=["*"]` together with `allow_credentials=True` makes Starlette
# reflect whatever Origin the caller sends, which is strictly worse than a
# literal wildcard. Auth here is Bearer-token only, so an explicit allowlist
# from CORS_ORIGINS is both correct and sufficient.
allowed_origins = secrets.cors_origin_list
if not allowed_origins:
    logger.warning(
        "CORS_ORIGINS is empty - browser requests from the frontend will be "
        "blocked. Set it to your deployed site's origin."
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["default"])
async def index():
    return RedirectResponse(url="/docs")


@app.get("/health", include_in_schema=False)
async def health_check():
    """Reports which optional integrations are actually configured."""
    return {
        "status": "ok",
        "redis": secrets.redis_enabled,
        "mail": secrets.mail_enabled,
        "cors_origins": allowed_origins,
    }


app.include_router(auth_router)
app.include_router(student_router)
app.include_router(profile_router)
app.include_router(jobs_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, proxy_headers=True)
