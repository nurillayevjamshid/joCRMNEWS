import { db } from "../lib/firebase";
import { logFirebaseError } from "../lib/firebase-error-handler";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";

export const dataService = {
  /**
   * Save general data with a timestamp based ID
   */
  async saveData(collectionName: string, data: any, id?: string) {
    try {
      const timestampId = id || Math.floor(Date.now() / 1000).toString();
      
      const documentData = {
        ...data,
        id: timestampId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(db, collectionName, timestampId);
      await setDoc(docRef, documentData);
      
      return { success: true, id: timestampId };
    } catch (error) {
      const message = logFirebaseError(`saveData(${collectionName})`, error);
      throw new Error(message);
    }
  },

  /**
   * Fetch all documents from a collection
   */
  async getCollection(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
    } catch (error) {
      const message = logFirebaseError(`getCollection(${collectionName})`, error);
      throw new Error(message);
    }
  },

  /**
   * Subscribe to a collection for real-time updates
   */
  subscribeToCollection(collectionName: string, callback: (data: any[]) => void) {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      callback(data);
    }, (error) => {
      const message = logFirebaseError(`subscribeToCollection(${collectionName})`, error);
      console.error(message);
    });
  },

  /**
   * Get a single document
   */
  async getDocument(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id };
      }
      return null;
    } catch (error) {
      const message = logFirebaseError(`getDocument(${collectionName}, ${id})`, error);
      throw new Error(message);
    }
  },

  /**
   * Update a document
   */
  async updateData(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      const message = logFirebaseError(`updateData(${collectionName}, ${id})`, error);
      throw new Error(message);
    }
  },

  /**
   * Delete a document
   */
  async deleteData(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      const message = logFirebaseError(`deleteData(${collectionName}, ${id})`, error);
      throw new Error(message);
    }
  },

  /**
   * Helper to convert File to Base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
};
