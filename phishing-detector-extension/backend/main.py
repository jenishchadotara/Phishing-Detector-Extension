import re
import os
import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

# Load Scikit-learn Model
MODEL_PATH = "phishing_model.pkl"
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None

def extract_features(url: str):
    return [
        len(url),
        1 if re.search(r'\d+\.\d+\.\d+\.\d+', url) else 0,
        url.count('@'),
        url.count('-'),
        url.count('.'),
        1 if url.startswith('https://') else 0
    ]

@app.post("/predict")
def predict_url(data: URLRequest):
    features = extract_features(data.url)
    
    if model:
        # Predict using actual ML model
        prediction = model.predict([features])[0]
        probabilities = model.predict_proba([features])[0]
        confidence = float(np.max(probabilities)) * 100
        is_phishing = bool(prediction == 1)
    else:
        # Fallback if model pkl file missing
        is_phishing = len(data.url) > 70 or "@" in data.url
        confidence = 85.0

    return {
        "url": data.url,
        "is_phishing": is_phishing,
        "confidence": round(confidence, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)