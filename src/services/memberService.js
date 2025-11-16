import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'members';

export const memberService = {
  async getAll() {
    try {
      console.log('Buscando membros da coleção:', COLLECTION_NAME);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      const members = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data 
        };
      });
      
      console.log(`Total de membros encontrados: ${members.length}`, members);
      
      // Validar se os membros têm a estrutura esperada
      members.forEach((member, index) => {
        if (!member.status) {
          console.warn(`Membro ${index} (${member.name || 'sem nome'}) não tem campo 'status'`);
        }
      });
      
      return members;
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      console.log('Criando novo membro:', data);
      
      // Garantir que o status existe
      if (!data.status) {
        console.warn('Membro criado sem status, definindo como "Ativo"');
        data.status = 'Ativo';
      }
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      
      console.log('Membro criado com ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Erro ao criar membro:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      console.log('Atualizando membro:', id, data);
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      console.log('Membro atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      console.log('Deletando membro:', id);
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      console.log('Membro deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar membro:', error);
      throw error;
    }
  }
};