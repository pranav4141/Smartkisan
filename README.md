# 🌾 SmartKisan

SmartKisan is a **smart agriculture mobile application** designed to help farmers manage their farms using **AI, IoT irrigation systems, weather insights, and real-time market data**.

The application enables farmers to **monitor crops, detect plant diseases, control irrigation pumps remotely, and connect with other farmers through a community platform.**

SmartKisan aims to bring **modern digital farming tools** into the hands of farmers.

---

# 📱 Project Overview

SmartKisan integrates multiple technologies:

- 📡 IoT irrigation control
- 🤖 AI crop disease detection
- 🌦 Weather monitoring
- 📊 Market price tracking
- 👨‍🌾 Farmer community platform

The goal is to **increase farm productivity while reducing manual effort and water waste.**

---

# 🚀 Features

## 🌱 Crop Advisory System

Provides farming guidance based on:

- Crop type  
- Soil type  
- Season  
- Location  

Farmers receive:

- Fertilizer suggestions
- Pest control recommendations
- Irrigation advice

---

## 🌦 Weather Forecast

Shows real-time weather insights:

- 7-day forecast
- Rain alerts
- Temperature
- Humidity

Helps farmers plan irrigation and harvesting.

---

## 🤖 AI Plant Disease Detection

Farmers can scan crop leaves using the phone camera.

The AI model:

1. Analyzes the image  
2. Detects plant disease  
3. Suggests treatment  

Technology used:

- TensorFlow Lite
- Image processing

---

## 📊 Market Price Tracker

Displays crop prices from nearby **mandis**.

| Crop | Market | Price |
|-----|------|------|
| Wheat | Shimla Mandi | ₹2200/q |
| Corn | Solan Market | ₹1850/q |

---

## 👨‍🌾 Farmer Community

A discussion platform where farmers can:

- Ask farming questions
- Upload crop photos
- Comment and reply
- Receive expert advice

Powered by **Firebase Firestore**.

---

## 💧 Smart Irrigation Control

Farmers can control their **field water pumps remotely**.

Features:

- Turn pump ON/OFF
- Check device status
- Schedule watering
- Receive alerts

Communication happens using **SIM-based irrigation devices**.

---

# 🧠 System Architecture

```
Android App
     │
Internet / SMS
     │
Cloud / GSM Network
     │
SIM Irrigation Device
     │
Water Pump
```

---

# 🛠 Tech Stack

## Frontend

- Android  
- Kotlin  
- XML Layouts  

## Backend

- Firebase Authentication  
- Firebase Firestore  
- Firebase Cloud Messaging  

## APIs

- Weather API  
- Agricultural Market Data API  
- Google Gemini API  

## AI

- TensorFlow Lite

---

# ⚙ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/smartkisan.git
cd smartkisan
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

# ▶ Running the Project

Run the development server using:

```bash
npm run dev
```

### What this command does

`npm run dev`:

- Starts the development server
- Compiles the project
- Enables **hot reload**
- Runs the app locally

Example output:

```
> next dev --turbopack -p 9002
Ready on http://localhost:9002
```

Open in browser:

```
http://localhost:9002
```

Whenever you edit the code, the app **automatically reloads**.

---

# 🔑 Using Your Own Gemini API Key

SmartKisan uses **Google Gemini AI** for features like:

- Crop advisory
- AI farming assistant
- Smart recommendations

---

## Step 1 — Get API Key

Go to:

```
https://ai.google.dev
```

Create your **Gemini API key**.

---

## Step 2 — Create Environment File

Create a file in the project root:

```
.env.local
```

---

## Step 3 — Add Your API Key

```
GEMINI_API_KEY=your_api_key_here
```

Example:

```
GEMINI_API_KEY=AIzaSyXXXXXX
```

---

## Step 4 — Access the API Key in Code

Example:

```javascript
const apiKey = process.env.GEMINI_API_KEY;
```

Example Gemini usage:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

const result = await model.generateContent(
  "Suggest fertilizer for wheat crop"
);

console.log(result.response.text());
```

---

# 📂 Project Structure

```
SmartKisan
│
├── app
│   ├── components
│   ├── pages
│   ├── api
│
├── public
│
├── firebase
│
├── ai
│
├── .env.local
├── package.json
├── README.md
```

---

# 🔐 Security

SmartKisan ensures secure usage through:

- Firebase Authentication
- Secure API communication
- Device ownership verification

---

# 🔮 Future Improvements

Possible upgrades:

- Soil moisture sensor integration
- Drone crop monitoring
- AI crop yield prediction
- Government scheme notifications
- Voice Assistance to farmers in local languages

---

# 🌍 Expected Impact

SmartKisan helps farmers:

- Reduce water waste
- Detect crop diseases early
- Track crop prices easily
- Improve farming decisions
- Collaborate with other farmers

