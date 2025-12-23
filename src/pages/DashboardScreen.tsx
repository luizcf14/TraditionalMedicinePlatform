import React from 'react';
import { Screen } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-main text-3xl font-bold leading-tight tracking-tight">Bom dia, Curador</h2>
          <p className="text-text-muted text-base font-normal">Resumo das atividades do centro de saúde hoje, 24 de Outubro.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-border-light text-text-main px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">print</span>
            Relatório Diário
          </button>
          <button
            onClick={() => onNavigate(Screen.NEW_APPOINTMENT)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dark transition-colors">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Atendimento
          </button>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h3 className="text-text-main text-xl font-bold leading-tight mb-4">Acesso Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate(Screen.REGISTRATION)}
            className="flex items-center gap-4 p-6 rounded-xl bg-white border border-border-light hover:border-primary/50 hover:shadow-md transition-all text-left group flex-1"
          >
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">person_add</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-text-main font-semibold text-lg">Novo Paciente</h4>
              <p className="text-text-muted text-sm">Cadastrar primeira consulta</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate(Screen.PATIENT_LIST)}
            className="flex items-center gap-4 p-6 rounded-xl bg-white border border-border-light hover:border-primary/50 hover:shadow-md transition-all text-left group flex-1"
          >
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">prescriptions</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-text-main font-semibold text-lg">Receitar Tratamento</h4>
              <p className="text-text-muted text-sm">Prescrever fitoterápicos</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate(Screen.PATIENT_LIST)}
            className="flex items-center gap-4 p-6 rounded-xl bg-white border border-border-light hover:border-primary/50 hover:shadow-md transition-all text-left group flex-1"
          >
            <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-3xl">history_edu</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-text-main font-semibold text-lg">Consultar Histórico</h4>
              <p className="text-text-muted text-sm">Ver prontuários passados</p>
            </div>
          </button>
        </div>
      </div>

      {/* Queue */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-text-main text-xl font-bold leading-tight">Fila de Atendimento do Dia</h3>
          <a className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1" href="#">
            Ver todos
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>

        {/* Next Patient Card */}
        <div className="bg-white rounded-xl border border-border-light shadow-md p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-70"></div>
          <span className="hidden sm:block material-symbols-outlined text-primary text-5xl opacity-40 group-hover:opacity-70 transition-opacity">medical_services</span>
          <div className="relative flex flex-col gap-1 flex-1">
            <p className="text-primary-dark text-xs font-semibold uppercase tracking-wider">Próximo Paciente</p>
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-full bg-gray-200 bg-center bg-cover"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4RhLLdMvP9af8lqdepQvH2ZT2JnTPBSR0YL9olWGuXg7evXxQYq6__6-1Tpch5UfGflTgIvL2vyv22Q9hE1mfgsE8qSqJQh2Af4hV3_HuAkBeJwDwCNkX2SNmwiPbQ8Q_VaktpRsLCZ2-MfqoqI-I4KyHRbaki0msMyFOBZZB8CMpqQc5Gm0PC9U0BJyZf-NOT7LNAUM-G8zlPjl9Jdy7xEEajXwvhgcrb_O1Db7pL3t-yJ2jBEWrHErcgc4R7gmfXA-QMQiJAjU")' }}
              ></div>
              <h4 className="text-text-main text-lg font-bold">Ana Terra</h4>
            </div>
            <p className="text-text-muted text-sm mt-1">Motivo: Dor muscular · Horário: 10:30</p>
          </div>
          <button
            onClick={() => onNavigate(Screen.PATIENT_RECORD)}
            className="w-full sm:w-auto ml-auto flex-shrink-0 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dark transition-colors relative z-10"
          >
            Iniciar Atendimento
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background-light border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 font-semibold text-text-muted">Paciente</th>
                  <th className="px-6 py-4 font-semibold text-text-muted">Motivo</th>
                  <th className="px-6 py-4 font-semibold text-text-muted">Horário</th>
                  <th className="px-6 py-4 font-semibold text-text-muted">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JP</div>
                      <span className="font-medium text-text-main">João Pataxó</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-main">Retorno / Chá</td>
                  <td className="px-6 py-4 text-text-muted">09:15</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">Ver Detalhes</button>
                  </td>
                </tr>
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full bg-gray-200 bg-center bg-cover"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfzomiUCPd39Snktnyr86sMaQ2nNRXGMg6TgHtl9p77-vowxGIYtIJR_H34u9_uGAOQ6BrcsrH6Gnqmr6vt3cI3hS8dmxfCzrslMvr5N9Gt74Sg4HODCy1JUGZjIS99aZMnZTy6NEyU5gs6fciD4_MlXjnkfpBRGz59VqyIUEp9nmEkmrbIJcZZESSycNTmkh2CAQrHbxd3jH0GLqmm9oY1-y_r_sDTGjsSmmy7JqoeyxHElptTBVQIazK1pE_YwWthshY48mcSSw")' }}
                      ></div>
                      <span className="font-medium text-text-main">Maria do Céu</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-main">Ansiedade</td>
                  <td className="px-6 py-4 text-text-muted">14:00</td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">Iniciar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'medical_services', title: 'Atendimentos Hoje', value: '12', trend: '2%', color: 'text-primary' },
          { icon: 'hourglass_empty', title: 'Fila de Espera', value: '4', sub: 'pacientes', color: 'text-[#8B5E3C]' },
          { icon: 'spa', title: 'Tratamentos Ativos', value: '28', trend: '5%', color: 'text-primary' },
          { icon: 'inventory_2', title: 'Estoque Ervas', value: '95%', sub: 'Saudável', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-2 rounded-xl p-4 bg-white border border-border-light shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className={`material-symbols-outlined text-5xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              <span className="text-sm font-medium">{stat.title}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-text-main text-2xl font-bold leading-tight">{stat.value}</p>
              {stat.trend && (
                <span className="text-primary text-xs font-medium bg-primary/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">arrow_upward</span> {stat.trend}
                </span>
              )}
              {stat.sub && (
                <span className={`text-xs font-medium ${stat.sub === 'Saudável' ? 'text-green-600' : 'text-text-muted'}`}>{stat.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardScreen;
