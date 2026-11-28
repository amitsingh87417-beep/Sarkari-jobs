# Firebase Daily Typing Setup Guide (2 Minutes)

Aapki website mein **Firebase Realtime Database** ka poora code add kar diya gaya hai (`public/firebase-config.js` aur `public/firebase-typing-sync.js`).

## Step 1: Firebase Realtime Database URL copy karein
1. [Firebase Console](https://console.firebase.google.com/) kholein aur apna project select karein (ya naya project banayein).
2. Left menu mein **Build -> Realtime Database -> Create Database** par click karein.
3. Location select karke **Start in test mode** (ya neeche diye rules lagayein) par click karein.
4. Database banne ke baad upar jo URL dikhega (jaise `https://sarkari-job-universe-default-rtdb.firebaseio.com`), use copy kar lein.

## Step 2: URL paste karein
GitHub par `public/firebase-config.js` kholein aur apna URL paste kar dein:
```js
window.SJU_FIREBASE_CONFIG = {
  databaseURL: "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com",
  dailyGoalTests: 3
};
```

## Step 3: Recommended Firebase Database Rules
Firebase Console -> Realtime Database -> **Rules** tab mein yeh rules paste karke **Publish** kar dein:
```json
{
  "rules": {
    "typing_daily": {
      ".read": true,
      "$date": {
        "scores": {
          ".write": true
        }
      }
    },
    "typing_users": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```
