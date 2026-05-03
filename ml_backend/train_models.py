import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.linear_model import LinearRegression
import joblib
import os

# Ensure the models directory exists
os.makedirs('models', exist_ok=True)

print("🚀 Starting Model Training Process...")

# ==========================================
# 1. Satellite NDVI Biomass Estimator
# ==========================================
print("Training Satellite Biomass Model (Random Forest)...")
np.random.seed(42)
n_samples = 2000

# Synthetic Data Generation
# NDVI: 0.2 (low vegetation) to 0.9 (dense vegetation)
ndvi = np.random.uniform(0.2, 0.9, n_samples)
soil_quality = np.random.randint(1, 10, n_samples) # 1 to 10 scale
rainfall_mm = np.random.uniform(50, 400, n_samples) # 50mm to 400mm

# Yield formula: heavily dependent on NDVI, slight impact from soil and rain, plus noise
# Base yield is roughly 2.0 to 10.0 tonnes per hectare
yield_tonnes = (ndvi * 8) + (soil_quality * 0.3) + (rainfall_mm * 0.005) + np.random.normal(0, 0.5, n_samples)

X_yield = pd.DataFrame({'ndvi': ndvi, 'soil_quality': soil_quality, 'rainfall_mm': rainfall_mm})
y_yield = np.maximum(0.5, yield_tonnes) # Minimum yield is 0.5

yield_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
yield_model.fit(X_yield, y_yield)
joblib.dump(yield_model, 'models/biomass_yield_model.pkl')
print("✅ Biomass Yield Model saved to models/biomass_yield_model.pkl")

# ==========================================
# 2. Predictive Maintenance (Isolation Forest)
# ==========================================
print("Training Predictive Maintenance Model (Isolation Forest)...")
# Simulate normal operating conditions for a pelletizer machine
n_normal = 5000
vibration_normal = np.random.normal(50, 5, n_normal) # Normal vibration around 50 Hz
temp_normal = np.random.normal(70, 4, n_normal) # Normal temp around 70 C
current_normal = np.random.normal(120, 10, n_normal) # Normal current around 120 A

X_normal = pd.DataFrame({'vibration': vibration_normal, 'temperature': temp_normal, 'current': current_normal})

# Train Isolation Forest on normal data
# Contamination is the expected proportion of anomalies (outliers) in the data.
maintenance_model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
maintenance_model.fit(X_normal)
joblib.dump(maintenance_model, 'models/predictive_maintenance_model.pkl')
print("✅ Predictive Maintenance Model saved to models/predictive_maintenance_model.pkl")

# ==========================================
# 3. Market Price Forecasting
# ==========================================
print("Training Market Price Model (Random Forest Regressor)...")
n_months = 500
# Features: Month (seasonality), Diesel Price (transport cost), Regional Demand (1-100)
months = np.random.randint(1, 13, n_months)
diesel_price = np.random.uniform(85, 105, n_months)
demand = np.random.randint(20, 100, n_months)

# Price formula: peaks in winter (months 11, 12, 1, 2) due to high demand, scales with diesel and demand
base_price = 1000
seasonality = np.where(np.isin(months, [11, 12, 1, 2]), 300, 0)
price = base_price + seasonality + (diesel_price * 5) + (demand * 4) + np.random.normal(0, 100, n_months)

X_price = pd.DataFrame({'month': months, 'diesel_price': diesel_price, 'demand': demand})
y_price = price

price_model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
price_model.fit(X_price, y_price)
joblib.dump(price_model, 'models/market_price_model.pkl')
print("✅ Market Price Model saved to models/market_price_model.pkl")

print("🎉 All Models Trained and Exported Successfully!")
