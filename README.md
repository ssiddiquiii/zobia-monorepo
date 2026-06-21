# Zobia Demand & Supply App 🚀

Welcome to the Zobia project! This repository contains both the **Mobile Application** (built with Expo) and the **Web Admin Portal** (built with Next.js).

---

## 🛠️ How to Run the Project Locally

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
3. Open the **Expo Go** app on your phone (download from App Store/Play Store if you don't have it).
4. Scan the QR Code. 
5. The Zobia app will load on your phone and connect directly to your local web server!
