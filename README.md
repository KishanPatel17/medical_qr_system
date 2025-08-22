# 🩺 MedQR – Medical QR + AI Emergency Assistant

> When you can’t speak for yourself, your data can.

**MedQR** is an AI-powered medical safety platform designed for real-world emergencies. It empowers users to store critical health data securely and lets bystanders access life-saving information instantly via a wearable QR code — no app or login required.

---
 
## 🚨 Why It Matters

In emergencies, seconds matter — but most bystanders don’t know what to do.

People with conditions like severe allergies, epilepsy, diabetes, or asthma often can’t speak for themselves in a crisis. We built MedQR so anyone nearby can simply scan a code and get the answers they need to help.

---

## 🧠 What It Does

- ✅ Users create a secure medical profile (Flutter Web)
- ✅ QR code is generated, linking to their public emergency page
- ✅ QR code can be worn (ring, sticker, tattoo)
- ✅ Anyone scanning the code sees:
  - Medical conditions
  - Allergies
  - Medications
  - Emergency contacts
  - Gemini AI-powered chatbot for emergency guidance

---

## 🌐 Live Demo

🔗 [User Web App – Create Profile + Get QR](https://medicalqrsystem.web.app)  

---

## 🧱 Built With

- **Flutter Web** – For the main medical profile and QR code app
- **Firebase** – Authentication, Firestore database, Storage, Hosting
- **React** – For the public profile view after scanning the QR
- **Gemini AI** – Real-time medical guidance chatbot
- `qr_flutter` – Flutter package to generate user QR codes
- **Git + GitHub** – Version control and team collaboration

---

## 🛠️ How to Run Locally

### For the Flutter Web App

```bash
git clone https://github.com/KishanPatel17/medical_qr_system.git
cd medical_qr_system
flutter pub get
flutter run -d chrome
