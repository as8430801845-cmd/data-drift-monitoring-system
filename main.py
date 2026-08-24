from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from monitor import get_drift_analysis
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/monitor")
async def monitor_system():
    data = get_drift_analysis()
    if "error" in data:
        return {"success": False, "message": data["error"]}

    report = data["metrics"][0]["result"]

    return {
        "success": True,
        "drift_detected": report["dataset_drift"],
        "drift_score": report["share_of_drifted_columns"],
        "column_details": report["drift_by_columns"],
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
