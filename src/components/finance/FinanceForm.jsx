import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function FinanceForm({ transaction, onSave, onClose, loading }) {
  const [form, setForm] = useState(transaction || {
    type: 'income',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Oferta',
    observations: ''
  });
  const [errors, setErrors] = useState({});

  // Track initial state for dirty check
  const initialFormState = useRef(form);
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialFormState.current);

  useEffect(() => {
    if (transaction) {
      initialFormState.current = transaction;
    } else {
      initialFormState.current = {
        type: 'income',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Oferta',
        observations: ''
      };
    }
    setForm(transaction || initialFormState.current);
  }, [transaction]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) newErrors.amount = 'Valor inválido';
    if (!form.date) newErrors.date = 'Data é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form);
    }
  };

  const handleClose = () => {
    if (isDirty && !window.confirm('Tem certeza que deseja sair? As alterações não salvas serão perdidas.')) {
      return;
    }
    onClose();
  };

  const categories = [
    'Oferta', 'Dízimo', 'Doação', 'Aluguel', 'Salário', 'Manutenção', 'Eventos', 'Outros'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormSelect
              label="Tipo *"
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </FormSelect>
            <FormInput
              label="Valor *"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({...form, amount: e.target.value})}
              error={errors.amount}
            />
            <FormInput
              label="Data *"
              type="date"
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
              error={errors.date}
            />
            <FormSelect
              label="Categoria *"
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </FormSelect>
          </div>

          <FormInput
            label="Descrição *"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            error={errors.description}
          />

          <div>
            <label className="block font-semibold text-gray-800 mb-2">Observações</label>
            <textarea
              value={form.observations}
              onChange={(e) => setForm({...form, observations: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Informações adicionais..."
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${loading ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {loading ? (transaction ? 'Atualizando...' : 'Salvando...') : 'Salvar'}
          </button>
          <button
            onClick={handleClose}
            className="px-8 py-3 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, type = 'text', value, onChange, error, step }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FormSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
      >
        {children}
      </select>
    </div>
  );
}