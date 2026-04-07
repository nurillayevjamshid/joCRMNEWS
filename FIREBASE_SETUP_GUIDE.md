# Firebase Sozlash Qo'llanmasi

Loyihangiz Firebase bilan to'g'ri ishlashi uchun quyidagi qadamlarni bajarishingiz kerak.

## 1. Firebase Console-ga kirish

1. [Firebase Console](https://console.firebase.google.com/)-ga kiring
2. Loyihangizni tanlang: **jocrm-e6a64**

## 2. Authentication (Autentifikatsiya) ni sozlash

### Email/Password Authentication
1. Chap menyudan **Authentication** → **Sign-in method** tanlang
2. **Email/Password** qatoriga klik qiling
3. **Enable** tugmasini bosing
4. **Save** tugmasini bosing

### Google Authentication
1. **Sign-in method** bo'limida **Google** tanlang
2. **Enable** tugmasini bosing
3. **Project support email** ni tanlang (avtomatik to'ldiriladi)
4. **Save** tugmasini bosing

## 3. Firestore Database ni sozlash

1. Chap menyudan **Firestore Database** tanlang
2. Agar database yo'q bo'lsa, **Create database** tugmasini bosing
3. **Location** tanlang (masalan: `europe-west1`)
4. **Start in production mode** tanlang
5. **Create** tugmasini bosing

## 4. Firestore Security Rules ni sozlash

1. Firestore Database bo'limida **Rules** tabini tanlang
2. Quyidagi kodni nusxalang va joylashtiring:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Foydalanuvchi autentifikatsiya qilingan bo'lsa, ma'lumotlarni o'qish va yozish
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. **Publish** tugmasini bosing

## 5. Firestore Indekslarini yaratish

Loyihada `createdAt` bo'yicha tartiblash ishlatiladi. Agar xatolik bo'lsa:

1. Firestore Database bo'limida **Indexes** tabini tanlang
2. Agar indeks taklifi bo'lsa, **Create** tugmasini bosing
3. Agar taklifi bo'lmasa, qo'lda yarating:
   - **Collection ID**: `customers` (va boshqa collectionlar: `projects`, `tasks`, `leads`, `messages`)
   - **Fields**: `createdAt` (Descending)
   - **Create index** tugmasini bosing

## 6. .env faylini tekshirish

Loyihaning asosiy papkasida `.env` fayli quyidagi ma'lumotlarni o'z ichiga olishi kerak:

```env
VITE_FIREBASE_API_KEY="AIzaSyD9M8Z3HCoFq9OA-6-EHlRtRZqdgcR_r2w"
VITE_FIREBASE_AUTH_DOMAIN="jocrm-e6a64.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="jocrm-e6a64"
VITE_FIREBASE_STORAGE_BUCKET="jocrm-e6a64.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="767624939386"
VITE_FIREBASE_APP_ID="1:767624939386:web:81df7e55daefd872adb8c3"
```

## 7. Loyihani ishga tushirish

```bash
cd joCRMNEWS
npm install
npm run dev
```

Loyiha `http://localhost:3000` da ishga tushadi.

## 8. Test qilish

1. **Google Auth** bilan kirish (eng oson usuli)
2. Agar Email/Password ishlatmoqchi bo'lsangiz:
   - Firebase Console → **Authentication** → **Users**
   - **Add user** tugmasini bosing
   - Email va parol qo'shing
   - Loyihada shu email va parol bilan kiring

## Agar xatolik bo'lsa

### Xatolik: "The query requires an index"
- Firestore Database → **Indexes** bo'limiga kiring
- Taklif qilingan indeksni yarating

### Xatolik: "Permission denied"
- Firestore Database → **Rules** bo'limiga kiring
- Security Rules to'g'ri sozlanganligini tekshiring

### Xatolik: "auth/invalid-api-key"
- `.env` faylida API Key to'g'ri ekanligini tekshiring
- Loyihani qayta ishga tushiring: `npm run dev`

### Xatolik: "auth/invalid-domain"
- Firebase Console → **Authentication** → **Settings**
- **Authorized domains** bo'limiga `localhost:3000` qo'shing

## Qo'shimcha ma'lumot

Agar hali ham muammolar bo'lsa, brauzer konsolida (F12 → Console) xatolik xabarini ko'ring va uni bizga yuboring.
