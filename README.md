# Fleure Beauty 🚀

Welcome to the **Fleure Beauty** project! This repository contains a complete solution featuring both a Mobile Application for end-users and a Web Admin Portal for management.

## 📦 Tech Stack

**1. Mobile Application (App)**
- Framework: React Native with Expo
- UI Styling: NativeWind (Tailwind CSS for React Native)
- State Management: Redux Toolkit
- Routing: Expo Router

**2. Web Admin Portal & Backend (Web)**
- Framework: Next.js 14
- UI Styling: Tailwind CSS & Lucide Icons
- Database: MongoDB & Mongoose
- API: Next.js API Routes

---

## 🛠️ Prerequisites (What you need to install)

Before running the project, you must have the following installed on your laptop/computer:

1. **Node.js:** This is required to run the code. 
   - Download the LTS version from: [https://nodejs.org](https://nodejs.org/)
   - Install it with the default settings.
2. **Code Editor:** Visual Studio Code (VS Code) is recommended.
3. **Expo Go (On Mobile):** Download the "Expo Go" app from the Google Play Store (Android) or Apple App Store (iOS) on your phone.

---

## 🚀 How to Run the Project Locally

Follow these simple steps to get both the Web and Mobile App running on your computer.

### Step 1: Install Web Dependencies
Open your terminal, go into the web folder, and install the required packages.
```bash
cd ai_demand_supply_balancer
npm install
```

### Step 2: Install App Dependencies
Open another terminal (or stay in the same one), go into the app folder, and install its packages.
```bash
cd ai_demand_supply_app
npm install
```

### Step 3: Start the Web Backend
The web backend must be running for the mobile app to work properly.
```bash
cd ai_demand_supply_balancer
npm run dev
```
*(The web app and API will now run on `http://localhost:3000`)*

### Step 4: Start the Mobile App (Expo Go)
Open a **new terminal tab**, keep the web backend running, and start the Expo bundler:
```bash
cd ai_demand_supply_app
npx expo start -c
```

### Step 5: Connect Your Phone
1. Make sure your laptop/computer and your mobile phone are connected to the **same Wi-Fi network**.
2. A large QR Code will appear in the terminal where you ran `npx expo start -c`.
3. Open the **Expo Go** app on your phone.
4. Scan the QR Code. 
5. The Fleure Beauty app will load on your phone and connect directly to your local web server automatically!
