from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

credit_risk_model = joblib.load("ai-services\Models\Credit_Risk_model.pkl")
fraud_model = joblib.load("ai-services\Models\Fraud_model.pkl")

app = FastAPI()

class CreditRiskModelInput(BaseModel):
  person_age: int
  person_income: float
  loan_amnt: float
  loan_grade: str
  person_emp_length: str

class FraudModelInput(BaseModel):
  type: str
  amount: float
  oldbalanceOrg: float
  newbalanceOrig: float
  oldbalanceDest: float
  newbalanceDest: float

@app.post("/predict_credit_risk")
def predict_credit_risk(input_data: CreditRiskModelInput):
  input_df = pd.DataFrame([input_data.dict()])
  prediction = credit_risk_model.predict(input_df)
  return {"loan_status": int(prediction[0])}

@app.post("/predict_fraud")
def predict_fraud(input_data: FraudModelInput):
  input_df = pd.DataFrame([input_data.dict()])
  prediction = fraud_model.predict(input_df)
  return {"isFraud": int(prediction[0])}
