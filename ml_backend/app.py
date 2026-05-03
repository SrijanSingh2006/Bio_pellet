from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the trained models
try:
    yield_model = joblib.load('models/biomass_yield_model.pkl')
    maintenance_model = joblib.load('models/predictive_maintenance_model.pkl')
    price_model = joblib.load('models/market_price_model.pkl')
    print("✅ All ML Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}. Please run train_models.py first.")

@app.route('/api/ml/predict-yield', methods=['POST'])
def predict_yield():
    data = request.json
    # Expected inputs: ndvi, soil_quality, rainfall_mm
    try:
        input_data = pd.DataFrame([{
            'ndvi': data.get('ndvi', 0.5),
            'soil_quality': data.get('soil_quality', 5),
            'rainfall_mm': data.get('rainfall_mm', 150)
        }])
        
        prediction = yield_model.predict(input_data)[0]
        
        return jsonify({
            'success': True,
            'yield_tonnes': round(float(prediction), 2)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/ml/predict-maintenance', methods=['POST'])
def predict_maintenance():
    data = request.json
    # Expected inputs: vibration, temperature, current
    try:
        input_data = pd.DataFrame([{
            'vibration': data.get('vibration', 50),
            'temperature': data.get('temperature', 70),
            'current': data.get('current', 120)
        }])
        
        # Isolation Forest: 1 is normal, -1 is anomaly
        prediction = maintenance_model.predict(input_data)[0]
        is_anomaly = True if prediction == -1 else False
        
        # Calculate an arbitrary risk score based on deviation from normal
        vibration_risk = abs(data.get('vibration', 50) - 50) * 2
        temp_risk = abs(data.get('temperature', 70) - 70) * 2
        risk_score = min(100, vibration_risk + temp_risk)
        
        return jsonify({
            'success': True,
            'anomaly_detected': is_anomaly,
            'risk_score': round(risk_score, 1)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/ml/predict-price', methods=['POST'])
def predict_price():
    data = request.json
    # Expected inputs: month, diesel_price, demand
    try:
        input_data = pd.DataFrame([{
            'month': data.get('month', 1),
            'diesel_price': data.get('diesel_price', 90),
            'demand': data.get('demand', 50)
        }])
        
        prediction = price_model.predict(input_data)[0]
        
        return jsonify({
            'success': True,
            'predicted_price_inr': round(float(prediction), 2)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/ml/nlp-intent', methods=['POST'])
def nlp_intent():
    data = request.json
    text = data.get('text', '').lower()
    
    # Simulate NLP Intent Classification
    intent = "unknown"
    confidence = 0.85
    response = "I'm sorry, I didn't catch that. Could you ask about prices, weather, or biomass quality?"
    
    if any(word in text for word in ['price', 'cost', 'sell', 'money', 'rupees']):
        intent = "market_price"
        response = "The current estimated price for biomass is around 1,200 Rupees per tonne. However, our forecast predicts this will rise by 10% next month. I suggest holding your stock if it is dry."
    elif any(word in text for word in ['wet', 'rain', 'spoil', 'rot', 'moisture']):
        intent = "spoilage_risk"
        response = "High moisture detected. Our time-series model shows heavy rain risk in your region for the next 3 days. Please cover your biomass immediately to avoid a 40% price penalty."
    elif any(word in text for word in ['quality', 'good', 'grade', 'dry']):
        intent = "biomass_quality"
        response = "Premium dry biomass currently fetches top market rates. You can use the AI Quality Analyzer tab to take a photo of your straw and get a precise grade."
    elif any(word in text for word in ['machine', 'tractor', 'baler', 'equipment']):
        intent = "equipment_rental"
        response = "Baler machines are expensive. Try our 'Uber for Balers' tool to group with nearby farmers and split the rental costs."

    return jsonify({
        'success': True,
        'intent': intent,
        'confidence': confidence,
        'response_text': response
    })

if __name__ == '__main__':
    print("🚀 Starting Advanced ML Backend Server on Port 5006...")
    app.run(port=5006, debug=True)
