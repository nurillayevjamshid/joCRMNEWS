/**
 * Firebase xatoliklarini o'zbek tiliga tarjima qilish va foydalanuvchiga tushunarli xabarlar berish
 */

export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error?.code || error?.message || '';
  
  const errorMessages: { [key: string]: string } = {
    // Authentication xatoliklari
    'auth/invalid-api-key': 'Firebase API kaliti noto\'g\'ri. .env faylini tekshiring.',
    'auth/invalid-domain': 'Domen Firebase-ga qo\'shilmagan. Firebase Console-da localhost:3000 ni qo\'shing.',
    'auth/user-not-found': 'Bunday email bilan foydalanuvchi topilmadi.',
    'auth/wrong-password': 'Parol noto\'g\'ri.',
    'auth/email-already-in-use': 'Bu email allaqachon ro\'yxatdan o\'tgan.',
    'auth/weak-password': 'Parol juda oson. Kamida 6 ta belgidan iborat bo\'lishi kerak.',
    'auth/invalid-email': 'Email manzili noto\'g\'ri.',
    'auth/operation-not-allowed': 'Email/Password autentifikatsiya faol emas. Firebase Console-da yoqing.',
    'auth/popup-closed-by-user': 'Google login oynasi yopildi.',
    'auth/popup-blocked': 'Google login oynasi bloklangan. Brauzer sozlamalarini tekshiring.',
    
    // Firestore xatoliklari
    'permission-denied': 'Ruxsatnoma yo\'q. Firebase Security Rules-ni tekshiring.',
    'failed-precondition': 'Firestore indeksi yo\'q. Firebase Console-da indeks yarating.',
    'not-found': 'Ma\'lumot topilmadi.',
    'already-exists': 'Bu ma\'lumot allaqachon mavjud.',
    'unavailable': 'Firebase xizmati vaqtincha ishlamayapti. Biroz kuting.',
    'unauthenticated': 'Siz autentifikatsiya qilinmagansiz. Iltimos, kiring.',
    'deadline-exceeded': 'So\'rov vaqti tugadi. Internet ulanishini tekshiring.',
    'internal': 'Firebase ichki xatosi. Biroz kuting va qayta urinib ko\'ring.',
    
    // Umumiy xatoliklar
    'network-request-failed': 'Internet ulanishida muammo. Ulanishni tekshiring.',
    'service-unavailable': 'Firebase xizmati vaqtincha ishlamayapti.',
  };
  
  // Xatolik kodini qidirish
  for (const [code, message] of Object.entries(errorMessages)) {
    if (errorCode.includes(code)) {
      return message;
    }
  }
  
  // Agar xatolik kodi topilmasa, asl xabarni qaytarish
  return error?.message || 'Noma\'lum xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
};

/**
 * Firebase xatoliklarini konsolga va foydalanuvchiga log qilish
 */
export const logFirebaseError = (context: string, error: any) => {
  const userMessage = getFirebaseErrorMessage(error);
  const errorCode = error?.code || 'UNKNOWN';
  
  console.error(`[Firebase Error - ${context}]`, {
    code: errorCode,
    message: error?.message,
    userMessage,
    fullError: error,
  });
  
  return userMessage;
};
