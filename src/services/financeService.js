import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const financeService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, 'finances'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    return addDoc(collection(db, 'finances'), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async update(id, data) {
    return updateDoc(doc(db, 'finances', id), data);
  },

  async delete(id) {
    return deleteDoc(doc(db, 'finances', id));
  }
};