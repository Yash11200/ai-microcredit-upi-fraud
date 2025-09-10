import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, f1_score, confusion_matrix
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from lightgbm import LGBMClassifier
import joblib


def train_fraud_model():
  # Load dataset. Using the provided file name 'Credit_Risk_Balanced_500k.csv'.
  data = pd.read_csv("ai-services\data\Fraud_Balanced_500k.csv")

  # Features & target
  X = data[['type', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']]
  y = data['isFraud']

  # Identify categorical and numeric columns
  categorical_features = ['type']
  numeric_features = ['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']

  # Preprocessing: OneHotEncode categoricals + scale numeric vars
  preprocessor = ColumnTransformer(
    transformers=[
      ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), categorical_features),
      ('num', StandardScaler(), numeric_features)
    ]
  )

  # Build pipeline with LightGBM
  model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', LGBMClassifier())
  ])

   # Train/test split
  X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
  )

  # Fit model
  model.fit(X_train, y_train)

  # Evaluate model
  y_pred = model.predict(X_test)
  acc = accuracy_score(y_test, y_pred)
  auc = roc_auc_score(y_test, y_pred)

  print(f"LightGBM Accuracy: {acc:.4f}")
  print(f"LightGBM ROC-AUC: {auc:.4f}")
  f1 = f1_score(y_test, y_pred)
  print(f"LightGBM F1 Score: {f1:.4f}")
  cm = confusion_matrix(y_test, y_pred)
  print("Confusion Matrix:")
  print(cm)

  # Save trained pipeline
  joblib.dump(model, "ai-services\Models\Fraud_model.pkl")


if __name__ == "__main__":
  train_fraud_model()