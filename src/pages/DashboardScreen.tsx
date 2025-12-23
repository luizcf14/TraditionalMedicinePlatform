import React, { useState, useEffect } from 'react';
import { Screen, Appointment } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        const startDate = new Date(year, month, day, 0, 0, 0).toISOString();
        const endDate = new Date(year, month, day, 23, 59, 59, 999).toISOString();

        const res = await fetch(`http://localhost:3001/api/appointments?startDate=${startDate}&endDate=${endDate}`);
        const data = await res.json();

        if (data.success) {
          // Filter for scheduled appointments only, and sort by date
          const scheduled = data.appointments
            .filter((apt: any) => apt.status === 'Agendada')
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setAppointments(scheduled);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  const nextAppointment = appointments.length > 0 ? appointments[0] : null;
  const queue = appointments.length > 1 ? appointments.slice(1) : [];

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-main text-3xl font-bold leading-tight tracking-tight">Bom dia, Curador</h2>
          <p className="text-text-muted text-base font-normal">Resumo das atividades do centro de saúde hoje, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}.</p>
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
          <button onClick={() => onNavigate(Screen.AGENDA)} className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1">
            Ver agenda completa
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-text-muted animate-pulse">Carregando fila de atendimento...</div>
        ) : (
          <>
            {/* Next Patient Card */}
            {nextAppointment ? (
              <div className="bg-white rounded-xl border border-border-light shadow-md p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-70"></div>
                <span className="hidden sm:block material-symbols-outlined text-primary text-5xl opacity-40 group-hover:opacity-70 transition-opacity">medical_services</span>
                <div className="relative flex flex-col gap-1 flex-1">
                  <p className="text-primary-dark text-xs font-semibold uppercase tracking-wider">Próximo Paciente</p>
                  <div className="flex items-center gap-3">
                    {nextAppointment.patientImage && nextAppointment.patientImage !== 'PLACEHOLDER_INITIALS' ? (
                      <div
                        className="size-10 rounded-full bg-gray-200 bg-center bg-cover"
                        style={{ backgroundImage: `url("${nextAppointment.patientImage}")` }}
                      ></div>
                    ) : (
                      <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {nextAppointment.patientName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h4 className="text-text-main text-lg font-bold">{nextAppointment.patientName}</h4>
                  </div>
                  <p className="text-text-muted text-sm mt-1">Motivo: {nextAppointment.reason} · Horário: {new Date(nextAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button
                  onClick={() => onNavigate(Screen.NEW_PRESCRIPTION, nextAppointment.patientId, nextAppointment.id)}
                  className="w-full sm:w-auto ml-auto flex-shrink-0 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary-dark transition-colors relative z-10"
                >
                  Iniciar Atendimento
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border-light p-8 text-center text-text-muted">
                Não há atendimentos agendados para hoje.
              </div>
            )}

            {/* Table */}
            {queue.length > 0 && (
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
                      {queue.map(apt => (
                        <tr key={apt.id} className="hover:bg-background-light transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{apt.patientName.substring(0, 2).toUpperCase()}</div>
                              <span className="font-medium text-text-main">{apt.patientName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-text-main">{apt.reason}</td>
                          <td className="px-6 py-4 text-text-muted">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => onNavigate(Screen.PATIENT_RECORD, apt.patientId)}
                              className="text-primary hover:text-primary-dark font-medium text-sm"
                            >
                              Ver Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: 'medical_services', title: 'Atendimentos Hoje', value: appointments.length.toString(), trend: null, color: 'text-primary' },
          { icon: 'hourglass_empty', title: 'Fila de Espera', value: appointments.length.toString(), sub: 'pacientes', color: 'text-[#8B5E3C]' },
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
