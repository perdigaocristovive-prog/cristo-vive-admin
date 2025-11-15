import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function MemberForm({ member, onSave, onClose, loading }) {
  const [form, setForm] = useState(member || {
    name: '', email: '', phone: '', cpf: '', birthdate: '', address: '',
    status: 'Ativo', role: 'Membro', baptismDate: '', spouse: '', children: [], observations: ''
  });
  const [child, setChild] = useState({ name: '', birthdate: '' });
  const [errors, setErrors] = useState({});

  // Track initial state for dirty check
  const initialFormState = useRef(form);
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialFormState.current);

  useEffect(() => {
    if (member) {
      initialFormState.current = member;
    } else {
      initialFormState.current = {
        name: '', email: '', phone: '', cpf: '', birthdate: '', address: '',
        status: 'Ativo', role: 'Membro', baptismDate: '', spouse: '', children: [], observations: ''
      };
    }
    setForm(member || initialFormState.current);
  }, [member]);

  const addChild = () => {
    if (child.name) {
      setForm({ ...form, children: [...(form.children || []), child] });
      setChild({ name: '', birthdate: '' });
    }
  };

  const removeChild = (index) => {
    setForm({ ...form, children: form.children.filter((_, i) => i !== index) });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!form.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!form.birthdate) newErrors.birthdate = 'Data de nascimento é obrigatória';
    if (form.cpf && !isValidCPF(form.cpf)) newErrors.cpf = 'CPF inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidCPF = (cpf) => {
    return cpf && cpf.replace(/\D/g, '').length === 11;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form); // ← Chama a função onSave passada como prop
    }
  };

  const handleClose = () => {
    if (isDirty && !window.confirm('Tem certeza que deseja sair? As alterações não salvas serão perdidas.')) {
      return;
    }
    onClose(); // ← Fecha o formulário
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {member ? 'Editar Membro' : 'Novo Membro'}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Nome Completo *"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
              error={errors.name}
            />
            <FormInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
            <FormInput
              label="Telefone/WhatsApp *"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              required
              error={errors.phone}
            />
            <FormInput
              label="CPF"
              value={form.cpf}
              onChange={(e) => setForm({...form, cpf: e.target.value})}
              error={errors.cpf}
            />
            <FormInput
              label="Data de Nascimento *"
              type="date"
              value={form.birthdate}
              onChange={(e) => setForm({...form, birthdate: e.target.value})}
              required
              error={errors.birthdate}
            />
            <FormSelect
              label="Status *"
              value={form.status}
              onChange={(e) => setForm({...form, status: e.target.value})}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Visitante">Visitante</option>
              <option value="Congregado">Congregado</option>
            </FormSelect>
            <FormSelect
              label="Cargo *"
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
            >
              <option value="Membro">Membro</option>
              <option value="Diácono">Diácono</option>
              <option value="Pastor">Pastor</option>
              <option value="Líder">Líder</option>
              <option value="Obreiro">Obreiro</option>
            </FormSelect>
            <FormInput
              label="Data de Batismo"
              type="date"
              value={form.baptismDate}
              onChange={(e) => setForm({...form, baptismDate: e.target.value})}
            />
          </div>

          <FormInput
            label="Endereço Completo"
            value={form.address}
            onChange={(e) => setForm({...form, address: e.target.value})}
          />

          <FormInput
            label="Cônjuge (informativo)"
            value={form.spouse}
            onChange={(e) => setForm({...form, spouse: e.target.value})}
          />

          <div className="bg-blue-50 rounded-lg p-4">
            <label className="block font-semibold text-gray-800 mb-3">👨‍👩‍👧‍👦 Filhos/Dependentes</label>
            <div className="space-y-2 mb-3">
              {(form.children || []).map((c, i) => (
                <div key={i} className="flex gap-2 items-center bg-white p-3 rounded">
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className="text-sm text-gray-600">
                    {c.birthdate ? new Date(c.birthdate).toLocaleDateString('pt-BR') : ''}
                  </span>
                  <button
                    onClick={() => removeChild(i)}
                    className="text-red-600 hover:bg-red-100 p-2 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Nome do filho"
                value={child.name}
                onChange={(e) => setChild({...child, name: e.target.value})}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={child.birthdate}
                onChange={(e) => setChild({...child, birthdate: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={addChild}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">📝 Observações</label>
            <textarea
              value={form.observations}
              onChange={(e) => setForm({...form, observations: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Informações adicionais..."
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${loading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
          >
            {loading ? (member ? 'Atualizando...' : 'Salvando...') : 'Salvar'}
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

function FormInput({ label, type = 'text', value, onChange, required, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${error ? 'border-red-500' : ''}`}
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
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
      >
        {children}
      </select>
    </div>
  );
}