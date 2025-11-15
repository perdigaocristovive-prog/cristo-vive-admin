import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { financeService } from '../services/financeService';
import FinanceForm from '../components/finance/FinanceForm';

export default function Finance() {
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loadingActions, setLoadingActions] = useState({
    add: false,
    edit: false,
    delete: false
  });
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const data = await financeService.getAll();
      setTransactions(data);
    } catch (error) {
      toast.error('Erro ao carregar transações: ' + error.message);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const addTransaction = async (transaction) => {
    setLoadingActions(prev => ({ ...prev, add: true }));
    try {
      await financeService.create(transaction);
      toast.success('Transação adicionada com sucesso!');
      setModal(null);
      loadTransactions(); // Recarrega a lista após salvar
    } catch (error) {
      toast.error('Erro ao adicionar: ' + error.message);
    } finally {
      setLoadingActions(prev => ({ ...prev, add: false }));
    }
  };

  const updateTransaction = async (transaction) => {
    setLoadingActions(prev => ({ ...prev, edit: true }));
    try {
      await financeService.update(transaction.id, transaction);
      toast.success('Transação atualizada com sucesso!');
      setModal(null);
      setSelectedTransaction(null);
      loadTransactions(); // Recarrega a lista após salvar
    } catch (error) {
      toast.error('Erro ao atualizar: ' + error.message);
    } finally {
      setLoadingActions(prev => ({ ...prev, edit: false }));
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;

    setLoadingActions(prev => ({ ...prev, delete: true }));
    try {
      await financeService.delete(id);
      toast.success('Transação excluída com sucesso!');
      setSelectedTransaction(null);
      setModal(null);
      loadTransactions(); // Recarrega a lista após deletar
    } catch (error) {
      toast.error('Erro ao excluir: ' + error.message);
    } finally {
      setLoadingActions(prev => ({ ...prev, delete: false }));
    }
  };

  // Filtros
  const filtered = transactions.filter(t => {
    const matchSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       t.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || t.type === filterType;
    const matchCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchDate = !filterDate || t.date?.startsWith(filterDate);

    return matchSearch && matchType && matchCategory && matchDate;
  });

  // Adicione esta linha para ver os dados carregados
  console.log("Transações carregadas:", transactions);

  // Função auxiliar para converter amount de string para número
  const parseAmount = (amount) => {
    if (!amount) return 0;
    // Se for string com vírgula, converte para ponto
    const numStr = amount.toString().replace(',', '.');
    return parseFloat(numStr) || 0;
  };

  // Cálculo de estatísticas
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseAmount(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Adicione esta linha para ver os valores calculados
  console.log("Total Receitas:", totalIncome);
  console.log("Total Despesas:", totalExpenses);
  console.log("Saldo:", balance);

  // Categorias padrão
  const categories = [
    'Oferta', 'Dízimo', 'Doação', 'Aluguel', 'Salário', 'Manutenção', 'Eventos', 'Outros'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Controle Financeiro</h2>
        <button
          onClick={() => setModal('add')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-gray-800">R$ {totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3 text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-gray-800">R$ {totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-red-500 rounded-lg p-3 text-white">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className={`rounded-lg p-4 border-l-4 ${balance >= 0 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                R$ {balance.toFixed(2)}
              </p>
            </div>
            <div className={`rounded-lg p-3 ${balance >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="all">Todos os tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="all">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="month"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Tabela de transações */}
      {loadingTransactions ? (
        <div className="text-center py-12 text-gray-500">Carregando transações...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">{t.date}</td>
                  <td className="py-3 px-4 font-medium">{t.description}</td>
                  <td className="py-3 px-4 text-gray-600">{t.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {t.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`py-3 px-4 font-semibold ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    R$ {parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => { setSelectedTransaction(t); setModal('edit'); }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Nenhuma transação encontrada
            </div>
          )}
        </div>
      )}

      {/* Formulário de transação */}
      {modal === 'add' && (
        <FinanceForm
          onSave={addTransaction}
          onClose={() => setModal(null)}
          loading={loadingActions.add}
        />
      )}
      {modal === 'edit' && (
        <FinanceForm
          transaction={selectedTransaction}
          onSave={updateTransaction}
          onClose={() => { setModal(null); setSelectedTransaction(null); }}
          loading={loadingActions.edit}
        />
      )}
    </div>
  );
}