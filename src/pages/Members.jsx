import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { memberService } from '../services/memberService';
import { toast } from 'react-toastify';
import MemberForm from '../components/members/MemberForm';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loadingActions, setLoadingActions] = useState({
    add: false,
    edit: false,
    delete: false
  });
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoadingMembers(true);
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } catch (error) {
      toast.error('Erro ao carregar membros: ' + error.message);
    } finally {
      setLoadingMembers(false);
    }
  };

  const addMember = async (member) => {
    setLoadingActions(prev => ({ ...prev, add: true }));
    try {
      await memberService.create(member);
      toast.success('Membro adicionado com sucesso!');
      setModal(null);
      loadMembers(); // Recarrega a lista após salvar
    } catch (error) {
      toast.error('Erro ao adicionar: ' + error.message);
    } finally {
      setLoadingActions(prev => ({ ...prev, add: false }));
    }
  };

  const updateMember = async (member) => {
    setLoadingActions(prev => ({ ...prev, edit: true }));
    try {
      await memberService.update(member.id, member);
      toast.success('Membro atualizado com sucesso!');
      setModal(null);
      setSelectedMember(null);
      loadMembers(); // Recarrega a lista após salvar
    } catch (error) {
      toast.error('Erro ao atualizar: ' + error.message);
    } finally {
      setLoadingActions(prev => ({ ...prev, edit: false }));
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este membro?')) return;

    setLoadingActions(prev => ({ ...prev, delete: true }));
    try {
      await memberService.delete(id);
      toast.success('Membro excluído com sucesso!');
      setSelectedMember(null);
      setModal(null);
      loadMembers(); // Recarrega a lista após deletar
    } catch (error) {
      toast.error('Erro ao excluir: ' + error.message);
    } finally {
      setLoadingActions(prev => ({ ...prev, delete: false }));
    }
  };

  const filtered = members.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       m.phone?.includes(searchTerm);
    const matchFilter = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Inativo': return 'bg-gray-100 text-gray-800';
      case 'Visitante': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Lista de Membros ({filtered.length})</h2>
        <button
          onClick={() => setModal('add')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          + Novo Membro
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="all">Todos</option>
          <option value="Ativo">Ativos</option>
          <option value="Inativo">Inativos</option>
          <option value="Visitante">Visitantes</option>
          <option value="Congregado">Congregados</option>
        </select>
      </div>

      {/* Tabela de membros */}
      {loadingMembers ? (
        <div className="text-center py-12 text-gray-500">Carregando membros...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Telefone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cargo</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{m.name}</td>
                  <td className="py-3 px-4 text-gray-600">{m.email}</td>
                  <td className="py-3 px-4 text-gray-600">{m.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(m.status)}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{m.role}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => { setSelectedMember(m); setModal('edit'); }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMember(m.id)}
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
              Nenhum membro encontrado
            </div>
          )}
        </div>
      )}

      {/* Formulário de cadastro/editar */}
      {modal === 'add' && (
        <MemberForm
          onSave={addMember}
          onClose={() => setModal(null)}
          loading={loadingActions.add}
        />
      )}
      {modal === 'edit' && (
        <MemberForm
          member={selectedMember}
          onSave={updateMember}
          onClose={() => { setModal(null); setSelectedMember(null); }}
          loading={loadingActions.edit}
        />
      )}
    </div>
  );
}