import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'finances';

export const financeService = {
  async getAll() {
    try {
      console.log('Buscando transações da coleção:', COLLECTION_NAME);
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      
      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data 
        };
      });
      
      console.log(`Total de transações encontradas: ${transactions.length}`, transactions);
      
      // Validar se as transações têm a estrutura esperada
      transactions.forEach((transaction, index) => {
        if (!transaction.type) {
          console.warn(`Transação ${index} não tem campo 'type'`);
        }
        if (!transaction.amount) {
          console.warn(`Transação ${index} não tem campo 'amount'`);
        }
        if (!transaction.date) {
          console.warn(`Transação ${index} não tem campo 'date'`);
        }
        
        // Verificar se amount é um número válido
        const amount = parseFloat(transaction.amount);
        if (isNaN(amount)) {
          console.warn(`Transação ${index} tem 'amount' inválido:`, transaction.amount);
        }
      });
      
      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  },

  async create(data) {
    try {
      console.log('Criando nova transação:', data);
      
      // Validações básicas
      if (!data.type || !['income', 'expense'].includes(data.type)) {
        console.error('Tipo de transação inválido:', data.type);
        throw new Error('Tipo de transação deve ser "income" ou "expense"');
      }
      
      if (!data.amount || isNaN(parseFloat(data.amount))) {
        console.error('Valor inválido:', data.amount);
        throw new Error('Valor da transação deve ser um número válido');
      }
      
      if (!data.date) {
        console.warn('Data não fornecida, usando data atual');
        data.date = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
      }
      
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        amount: parseFloat(data.amount), // Garantir que é número
        createdAt: new Date().toISOString(),
      });
      
      console.log('Transação criada com ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      console.log('Atualizando transação:', id, data);
      
      const updateData = { ...data };
      
      // Se amount foi fornecido, garantir que é número
      if (updateData.amount !== undefined) {
        updateData.amount = parseFloat(updateData.amount);
      }
      
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...updateData,
        updatedAt: new Date().toISOString(),
      });
      
      console.log('Transação atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      console.log('Deletando transação:', id);
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      console.log('Transação deletada com sucesso');
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  }
};