import React, { useState, useEffect } from 'react';
import { Users, Cake, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { memberService } from '../services/memberService';
import { financeService } from '../services/financeService';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, ativos: 0, inativos: 0, visitantes: 0 });
  const [birthdays, setBirthdays] = useState([]);
  const [financeStats, setFinanceStats] = useState({ income: 0, expenses: 0, balance: 0 });

  useEffect(() => {
    loadStats();
    loadBirthdays();
    loadFinanceStats();
  }, []);

  const loadStats = async () => {
    try {
      const members = await memberService.getAll();
      const total = members.length;
      const ativos = members.filter(m => m.status === 'Ativo').length;
      const inativos = members.filter(m => m.status === 'Inativo').length;
      const visitantes = members.filter(m => m.status === 'Visitante').length;

      setStats({ total, ativos, inativos, visitantes });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadBirthdays = async () => {
    try {
      const members = await memberService.getAll();
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // Janeiro é 0

      const birthdays = members
        .filter(m => m.birthdate)
        .map(m => {
          const [year, month, day] = m.birthdate.split('-').map(Number);
          return {
            ...m,
            birthMonth: month,
            birthDay: day
          };
        })
        .filter(m => m.birthMonth === currentMonth)
        .sort((a, b) => a.birthDay - b.birthDay); // Ordena por dia

      setBirthdays(birthdays);
    } catch (error) {
      console.error('Erro ao carregar aniversariantes:', error);
    }
  };

  const loadFinanceStats = async () => {
    try {
      const transactions = await financeService.getAll();
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const currentMonthTransactions = transactions.filter(t => {
        if (!t.date) return false;
        const date = new Date(t.date);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      });

      const totalIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      const totalExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

      const balance = totalIncome - totalExpenses;

      setFinanceStats({ income: totalIncome, expenses: totalExpenses, balance });
    } catch (error) {
      console.error('Erro ao carregar estatísticas financeiras:', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-600 mb-6">Visão geral do sistema</p>

      {/* Estatísticas de membros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 bg-blue-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-500 rounded-lg flex items-center justify-center text-white w-10 h-10">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 bg-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500 rounded-lg flex items-center justify-center text-white w-10 h-10">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.ativos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 bg-gray-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gray-500 rounded-lg flex items-center justify-center text-white w-10 h-10">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Inativos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inativos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 bg-orange-500">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-500 rounded-lg flex items-center justify-center text-white w-10 h-10">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Visitantes</p>
              <p className="text-2xl font-bold text-gray-800">{stats.visitantes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Aniversariantes do mês */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500 rounded-lg p-2 text-white">
              <Cake className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800"> Aniversariantes do Mês</h2>
          </div>
          {birthdays.length === 0 ? (
            <p className="text-gray-600">Nenhum aniversariante este mês.</p>
          ) : (
            <div className="space-y-3">
              {birthdays.map(m => (
                <div key={m.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-sm text-gray-600">{m.role}</p>
                  </div>
                  <p className="text-sm font-semibold text-orange-600">{formatDate(m.birthdate)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas financeiras */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`rounded-lg p-2 ${financeStats.balance >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
              <DollarSign className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800"> Finanças do Mês</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(financeStats.income)}</p>
              <div className="bg-green-500 rounded-lg p-1 mt-1 inline-block">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(financeStats.expenses)}</p>
              <div className="bg-red-500 rounded-lg p-1 mt-1 inline-block">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-xl font-bold ${financeStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financeStats.balance)}
              </p>
              <div className={`rounded-lg p-1 mt-1 inline-block ${financeStats.balance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                <DollarSign className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}