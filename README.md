# 🛰️ Satellite Tracker

A web-based **Satellite Tracking Application** built using **React** and **CesiumJS**, which visualizes real-time satellite positions on a 3D globe using **TLE (Two-Line Element) data**.

This project allows users to input TLE data and track satellites dynamically, similar to platforms like **N2YO**, with orbit visualization and live movement.

---

## 🚀 Features

- 🌍 3D Earth visualization using **CesiumJS**
- 🛰️ Real-time satellite tracking using **TLE data**
- 📍 Live satellite position updates
- 🔴 Past and future orbit path visualization
- 🖼️ Custom satellite icon (billboard)
- 🎯 Auto camera tracking of satellite
- ⚡ Smooth movement using Cesium Clock
- 🧭 Accurate orbital calculations via **satellite.js**

---

## 🛠️ Tech Stack

### Frontend

- **React.js**
- **CesiumJS**
- **satellite.js**
- **CSS**

### APIs & Services

- **Cesium Ion** (for globe imagery and terrain)

---

## 📥 Input Data

The application requires **TLE (Two-Line Element)** data:
1 25544U 98067A 24019.59097222 .00013453 00000+0 24450-3 0 9994
2 25544 51.6416 343.2702 0004986 80.6706 27.2348 15.50044134429174

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Shubha274/satelliteTrack.git
cd cesiumtracker

2️⃣ Install dependencies
npm install

3️⃣ Configure Cesium Ion Token

Create a .env file in the root directory:

REACT_APP_CESIUM_TOKEN=YOUR_CESIUM_ION_ACCESS_TOKEN
```

You can get your token from:
https://ion.cesium.com/

▶️ Run the Application
npm start

The app will run at:

http://localhost:3000

🧠 How It Works

User enters TLE Line 1 & Line 2

TLE is converted into a satellite record using satellite.js

Satellite position is propagated in real-time

Cesium renders:

Past orbit path

Future orbit path

Live satellite position

Camera automatically follows the satellite

📁 Project Structure
satellite-tracker/
├── public/
│ └── satellite.png
├── src/
│ ├── App.js
│ ├── index.js
│ └── styles.css
├── .env
├── package.json
└── README.md
