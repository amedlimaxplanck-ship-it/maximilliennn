import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function initFirebaseAdmin() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin yetkilendirme bilgileri eksik (Environment variables missing)');
  }

  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
  }
}

export const adminDb = new Proxy({}, {
  get: (target, prop) => {
    initFirebaseAdmin();
    const firestore = getFirestore();
    const value = firestore[prop as keyof typeof firestore];
    return typeof value === 'function' ? value.bind(firestore) : value;
  }
}) as ReturnType<typeof getFirestore>;

