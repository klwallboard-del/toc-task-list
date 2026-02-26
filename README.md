# 📋 Shift Task List - Real-Time Collaboration

A professional task management dashboard for shift operations with **real-time data synchronization** across all team members.

## ✨ Features

### 🎯 Core Functionality
- **TOC Core Responsibilities** - Assign primary and secondary engineers to key tasks
- **Infrastructure Checks** - Track daily infrastructure maintenance with time-based alerts
- **Phone Accountability** - Manage hourly phone coverage assignments
- **Lunch Break Management** - Schedule and track team lunch breaks

### 🔄 Real-Time Collaboration
- ✅ **Instant Sync** - All changes appear immediately for all users
- ✅ **Multi-User Support** - Multiple staff can work simultaneously
- ✅ **Cloud Storage** - Data persists across sessions and devices
- ✅ **Daily Organization** - Automatic daily data isolation

### 🎨 User Experience
- **Microsoft Teams Theme** - Clean, professional design
- **Shift Detection** - Automatically adjusts for Day Shift (8 AM - 8 PM) and Night Shift (8 PM - 8 AM)
- **Visual Alerts** - Infrastructure checks flash red when due
- **Responsive Design** - Works on desktop, tablet, and mobile
- **No Scrolling** - Dashboard view fits on one screen

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase account (free tier is sufficient)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase** (5 minutes)
   
   Follow the quick setup guide in `FIREBASE_QUICK_START.md`:
   - Create Firebase project
   - Enable Realtime Database
   - Update `src/lib/firebase.ts` with your config

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:5173
   ```

## 📚 Documentation

- **`FIREBASE_QUICK_START.md`** - 5-minute Firebase setup guide
- **`FIREBASE_SETUP_GUIDE.md`** - Detailed Firebase configuration with troubleshooting
- **`README.md`** - This file

## 🔧 Configuration

### Firebase Setup
Edit `src/lib/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Staff List
Update the staff list in `src/App.tsx`:

```typescript
const staffList = [
  "ALL",
  "Akmal",
  "Shantini",
  "Leonard",
  // Add your team members here
];
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn UI components
│   │   └── FirebaseStatus.tsx  # Connection status indicator
│   ├── hooks/
│   │   └── useFirebaseSync.ts  # Firebase real-time sync hook
│   ├── lib/
│   │   └── firebase.ts      # Firebase configuration
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/
├── FIREBASE_QUICK_START.md  # Quick setup guide
├── FIREBASE_SETUP_GUIDE.md  # Detailed setup guide
└── README.md                # This file
```

## 🎯 How It Works

### Data Structure
```
Firebase Realtime Database
└── taskLists/
    └── YYYY-MM-DD/          ← Daily data isolation
        ├── coreResponsibilities/
        ├── infraChecks/
        ├── phoneAccountability/
        └── lunchBreaks/
```

### Real-Time Sync
1. User makes a change (e.g., assigns an engineer)
2. Change is saved to local state
3. Change is synced to Firebase
4. Firebase broadcasts to all connected clients
5. All users see the update instantly

### Shift Detection
- **Day Shift (8 AM - 8 PM)**
  - Shows hours 8:00 - 19:00
  - Lunch options: 12PM, 1PM, 2PM, 3PM
  - Infrastructure checks: 9 AM, 6 PM

- **Night Shift (8 PM - 8 AM)**
  - Shows hours 20:00 - 07:00
  - Lunch options: 12AM, 1AM, 2AM, 3AM
  - Infrastructure checks: 9 PM, 12 AM

### Infrastructure Alerts
- **Daily Zerto Checks** - Flashes red at 9:00 AM or 9:00 PM for 1 minute
- **Daily AIP Backup Checks** - Flashes red at 6:00 PM or 12:00 AM for 1 minute

## 🔒 Security

### Current Setup (Development)
- Firebase test mode allows read/write access
- Suitable for internal team use
- Test mode expires after 30 days

### Production Recommendations
1. Enable Firebase Authentication
2. Update security rules to require authentication
3. Add user roles and permissions
4. Enable audit logging

See `FIREBASE_SETUP_GUIDE.md` for production security setup.

## 🐛 Troubleshooting

### Firebase Not Connected
- Yellow warning appears in bottom-right corner
- Check `src/lib/firebase.ts` configuration
- Verify Firebase project is created
- Ensure Realtime Database is enabled

### Changes Not Syncing
- Check browser console (F12) for errors
- Verify internet connection
- Check Firebase Console → Realtime Database → Data tab
- Ensure all users are using the same Firebase project

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📊 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Real-Time Database**: Firebase Realtime Database
- **Styling**: Tailwind CSS (Microsoft Teams theme)
- **Icons**: Lucide React

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` folder.

### Deploy Options
- **Vercel** (Recommended)
  ```bash
  npm install -g vercel
  vercel --prod
  ```

- **Netlify**
  - Drag and drop `dist/` folder to netlify.com

- **Firebase Hosting**
  ```bash
  npm install -g firebase-tools
  firebase init hosting
  firebase deploy
  ```

## 📈 Usage Limits (Firebase Free Tier)

- **Simultaneous connections**: 100
- **Storage**: 1 GB
- **Downloaded data**: 10 GB/month
- **Uploaded data**: Unlimited

More than sufficient for team task management!

## 🤝 Contributing

This is an internal tool. For feature requests or bug reports, contact your team lead.

## 📝 License

Internal use only - The Access Group

---

## 🎉 Getting Started Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Create Firebase project
- [ ] Enable Realtime Database
- [ ] Update `src/lib/firebase.ts` with your config
- [ ] Run dev server (`npm run dev`)
- [ ] Test in multiple browser tabs
- [ ] Share with your team!

**Need help?** Check `FIREBASE_QUICK_START.md` for a 5-minute setup guide.

---

**Built with ❤️ for efficient shift management**
