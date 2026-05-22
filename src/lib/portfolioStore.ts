import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDoc,
  setDoc
} from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  category?: string;
  images: string[]; // base64 encoded (compressed client-side)
  createdAt: number;
}

const COLLECTION_NAME = 'projects';

// Firestore'daki projeleri gerçek zamanlı olarak dinler
export function subscribeProjects(onUpdate: (projects: Project[]) => void): () => void {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const projects: Project[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      projects.push({
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        link: data.link || '',
        category: data.category || '',
        images: data.images || [],
        createdAt: data.createdAt || Date.now(),
      });
    });
    onUpdate(projects);
  }, (error) => {
    console.error('Error listening to projects: ', error);
  });
}

// Yeni proje ekler
export async function saveProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...project,
    createdAt: Date.now(),
  });
  return docRef.id;
}

// Proje siler
export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

// Proje günceller
export async function updateProject(id: string, data: Omit<Project, 'id' | 'createdAt'>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
}

// Telegram ayarlarını Firestore'dan çeker
export async function getTelegramSettings(): Promise<{ token: string; chatId: string } | null> {
  const docRef = doc(db, 'settings', 'telegram');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      token: data.token || '',
      chatId: data.chatId || '',
    };
  }
  return null;
}

// Telegram ayarlarını Firestore'a kaydeder
export async function saveTelegramSettings(token: string, chatId: string): Promise<void> {
  const docRef = doc(db, 'settings', 'telegram');
  await setDoc(docRef, { token, chatId });
}
