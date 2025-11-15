import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const memberService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, 'members'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    return addDoc(collection(db, 'members'), {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async update(id, data) {
    return updateDoc(doc(db, 'members', id), data);
  },

  async delete(id) {
    return deleteDoc(doc(db, 'members', id));
  }
};