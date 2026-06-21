# Zobia Demand & Supply App 🚀

Welcome to the Zobia monorepo! This repository contains both the **Mobile Application** (built with Expo) and the **Web Balancer / Admin Portal** (built with Next.js & MongoDB).

## 📦 Tech Stack
- **Mobile App:** React Native, Expo, NativeWind (Tailwind CSS), Redux Toolkit.
- **Web App / Backend:** Next.js 14, React, Tailwind CSS, MongoDB, Mongoose.
- **Monorepo Management:** NPM Workspaces.

---

## 🛠️ How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer and the **Expo Go** app installed on your physical mobile device. Both your computer and your mobile phone must be connected to the **same Wi-Fi network**.

### Step 1: Install All Dependencies
Because this is an NPM Workspace, you only need to install dependencies once from the root folder.
```bash
# Open terminal in the root folder (Zobia client)
npm install
```

### Step 2: Start the Web App & Backend Server
The backend needs to be running so the mobile app can connect to it and fetch products/login.
```bash
# Navigate to the web folder
cd ai_demand_supply_balancer
npm run dev
```
*(The web app will now run on `http://localhost:3000`)*

### Step 3: Start the Mobile App (Expo Go)
Open a **new terminal tab/window**, keep the backend running, and start the Expo bundler:
```bash
# Navigate to the mobile app folder
cd ai_demand_supply_app
npx expo start -c
```

### Step 4: Connect Your Phone
1. A large QR Code will appear in the terminal where you ran `npx expo start -c`.
2. Open the **Expo Go** app on your phone.
3. Scan the QR Code. 
4. The Zobia app will load on your phone and will automatically connect to your local backend server!

*(Note: If the backend IP address changes, you can configure the new IP inside the Mobile App's setup screen or directly in `ai_demand_supply_app/lib/api.ts`)*.
