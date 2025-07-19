
---

````md
# 🛍️ Fydo Assignment – React Native (Expo)

This is a frontend assignment built using React Native (via Expo) for Fydo.

It detects the user’s current location, checks proximity to nearby shops, renders conditional screens based on that, and includes a basic login/logout feature using mock data.

---

## 📱 Features

- ✅ Location Detection
  - Automatically fetches user’s location (with permission)
  - Checks if user is within 300 meters of predefined shop coordinates

- 🛒 Conditional UI
  - If within range: shows a simple shops screen (with 3–4 dummy shops)
  - If outside range: redirects to home screen with the message:
    > “We are not operational in your area”

- 🔐 Authentication
  - Basic Login / Logout using mock credentials (no backend)

---


## 📦 How to Run the Project

### 1. Clone this Repository
```bash
cd fydo-main/fydoapp2
````

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Start the App using Expo

```bash
npx expo start
```

### 4. Run the App

* A QR code will appear in your terminal/browser.
* Scan it using the Expo Go App on your Android/iOS device.
* Alternatively, you can run it on an emulator if set up.

---

## 👤 Credentials for Mock Login

```bash
Username: test@example.com
Password: 123456
```

---

## 📹 Video Walkthrough

[Click here to watch the video walkthrough](https://drive.google.com/drive/folders/1PvydQLsxRd42Yh2PG5YpkOUvepQ7QNDm)

---

## 🔗 Live Portfolio

Feel free to explore my portfolio to view more projects:
**🌐 [portfolio.adarshvault.me](https://portfolio.adarshvault.me)**

Check out the **HD Notes** project under Mini Projects to see my Google OAuth integration and more.

---

## Special Thanks

Thanks to the Fydo team for this opportunity! Looking forward to your feedback.
