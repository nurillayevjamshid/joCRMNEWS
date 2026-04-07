import { db } from "../lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

/**
 * Utility to convert matching base64 or other data to firebase friendly format
 * Images will be stored as base64 strings in Firestore records
 */

export const dataService = {
  /**
   * Save general data with a timestamp based ID
   * @param collectionName The name of the collection (e.g., 'customers', 'leads')
   * @param data The data object to save
   * @param imageBase64 Optional base64 string of an image
   */
  async saveData(collectionName: string, data: any, imageBase64?: string) {
    try {
      // Use current time in seconds as ID
      const timestampId = Math.floor(Date.now() / 1000).toString();
      
      const documentData = {
        ...data,
        id: timestampId,
        createdAt: timestampId,
        image: imageBase64 || null,
      };

      const docRef = doc(db, collectionName, timestampId);
      await setDoc(docRef, documentData);
      
      return { success: true, id: timestampId };
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      throw error;
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
