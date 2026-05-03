# ECOSHIELD: Bio-Pellet Plant Locator & Enterprise ML Hub 🌱

ECOSHIELD is an advanced, full-stack Agricultural-Technology (AgTech) platform designed to tackle stubble burning by connecting farmers with bio-pellet manufacturing plants. It leverages cutting-edge Machine Learning, Edge AI, Geospatial Analytics, and simulated Blockchain technology to optimize the biomass supply chain.

## 🚀 Features

### 1. 🚜 Farmer AI Suite (Edge Computing)
Runs instantly in the browser using TensorFlow.js:
- **AI Quality Analyzer:** Grade biomass quality.
- **Uber for Balers:** Find and share agricultural equipment with nearby farmers to reduce costs.
- **Spoilage Risk Forecast:** Time-series weather risk analysis.
- **Soil Health Optimizer:** Optimize profits vs fertilizer replacement costs.

### 2. 🏭 Enterprise ML Architecture (Python Microservice)
Powered by a dedicated Flask backend using Scikit-Learn:
- **Satellite Yield Estimator:** Predicts farm biomass yield using simulated Satellite NDVI data (Random Forest).
- **Predictive Maintenance:** Detects anomalies in pelletizer machines before breakdown (Isolation Forest).
- **Dynamic Market Price Forecasting:** Analyzes seasonality and demand to forecast fair biomass pricing (Time-Series Regression).

### 3. 🗺️ GIS Command Center
- Live, dark-mode geospatial analytics dashboard.
- Displays NASA FIRMS active fire hotspots alongside biomass density clusters across India.

### 4. 🔗 Plant Locator & Payment Gateway
- Locate verified bio-pellet manufacturing plants using GPS, Pincode, or State filters.
- **Razorpay Integration:** Secure ₹1 test payment gateway to unlock direct contact details for plants.

### 5. 📗 Carbon Smart Ledger
- An immutable simulated blockchain tracking verified CO2 offsets.
- Automatically mints "Carbon Credits" whenever plants process biomass.

## 🛠️ Technology Stack
- **Frontend:** React.js, Vite, TailwindCSS, React-Leaflet, Axios, Razorpay SDK
- **Backend:** Python, Flask, Scikit-Learn, Pandas, Numpy, Joblib
- **Maps:** Leaflet & OpenStreetMap
- **Deployment:** Vercel (Frontend ready), Render/Railway (Backend ready)

## ⚙️ How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/SrijanSingh2006/Bio_pellet.git
cd Bio_pellet
```

### 2. Start the Frontend (Vite)
```bash
npm install
npm run dev
```
The frontend will run on `http://localhost:5173/`

### 3. Start the ML Backend (Python)
Open a new terminal window:
```bash
cd ml_backend
pip install -r requirements.txt
python train_models.py
python app.py
```
The backend will run on `http://localhost:5006/`

## 👨‍💻 Author
Developed as an Advanced Mobile Communication (AMC) and Web Development project. All AI UI elements have been polished to provide an enterprise-grade, human-made aesthetic.
