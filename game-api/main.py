from fastapi import FastAPI
from config import config

app = FastAPI(title="2D AI Game API")

@app.get("/")
async def root():
    return {"message": "Welcome to the Game API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=config.PORT, reload=config.DEBUG)
