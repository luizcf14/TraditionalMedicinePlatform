import React from 'react';
import { Screen, Patient } from '../types';

interface PatientListScreenProps {
  onNavigate: (screen: Screen) => void;
}

const mockPatients: Patient[] = [
  { id: '1', name: 'Jaciara Tupi', motherName: 'Araci Tupi', cns: '789.456.123-00', age: 35, dob: '15/03/1988', village: 'Aldeia Yawanawá', status: 'Em Tratamento', image: '' },
  { id: '2', name: 'Raoni Kayapó', motherName: 'Janaína Kayapó', cns: '321.654.987-11', age: 58, dob: '02/09/1965', village: 'Aldeia Mutum', status: 'Acompanhamento', image: '' },
  { id: '3', name: 'Iracema Guarani', motherName: 'Potira Guarani', cns: '147.258.369-22', age: 31, dob: '20/11/1992', village: 'Comunidade Sol', status: 'Alta Médica', image: '' },
  { id: '4', name: 'Ubirajara Pataxó', motherName: 'Iara Pataxó', cns: '963.852.741-33', age: 48, dob: '10/06/1975', village: 'Aldeia Nova', status: 'Em Tratamento', image: '' },
  { id: '5', name: 'Potira Xavante', motherName: 'Jurema Xavante', cns: '159.357.486-44', age: 24, dob: '05/01/2000', village: 'Aldeia Azul', status: 'Triagem', image: '' },
];

const PatientListScreen: React.FC<PatientListScreenProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight text-text-main">Busca de Pacientes</h2>
          <p className="text-text-muted text-base">Localize prontuários por nome, documento ou comunidade.</p>
        </div>
        <button 
          onClick={() => onNavigate(Screen.REGISTRATION)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95 font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Novo Paciente</span>
        </button>
      </div>

      {/* Search & Filter Card */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-border-light p-1">
        {/* Search Bar */}
        <div className="p-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-muted group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              className="block w-full pl-11 pr-4 py-3 bg-background-light border-0 rounded-lg text-text-main placeholder:text-text-muted focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-base" 
              placeholder="Buscar por nome, CPF, CNS ou nome da mãe..." 
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button className="p-1.5 text-text-muted hover:text-primary hover:bg-white rounded-md transition-colors" title="Filtros Avançados">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Filters Chips */}
        <div className="px-3 pb-3 pt-1 flex gap-2 flex-wrap border-t border-dashed border-border-light mt-1">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider py-1.5 mr-1 self-center">Filtros:</span>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors">
            <span>Todas Aldeias</span>
            <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background-light text-text-muted hover:bg-gray-200 text-sm font-medium transition-colors border border-transparent">
            <span>Em Tratamento</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background-light text-text-muted hover:bg-gray-200 text-sm font-medium transition-colors border border-transparent">
            <span>Alta Médica</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background-light text-text-muted hover:bg-gray-200 text-sm font-medium transition-colors border border-transparent">
            <span>Recentes</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-border-light overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-light border-b border-border-light">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Nome Completo</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">CPF / CNS</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Aldeia / Comunidade</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Data Nascimento</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {mockPatients.map((patient, index) => {
                 // Generate distinct colors for initials based on index
                 const colorClasses = [
                   'bg-primary/20 text-primary',
                   'bg-orange-100 text-orange-600',
                   'bg-blue-100 text-blue-600',
                   'bg-purple-100 text-purple-600',
                   'bg-teal-100 text-teal-600'
                 ];
                 const badgeColors = {
                    'Em Tratamento': 'bg-green-100 text-green-800 border-green-200',
                    'Acompanhamento': 'bg-amber-100 text-amber-800 border-amber-200',
                    'Alta Médica': 'bg-gray-100 text-gray-600 border-gray-200',
                    'Triagem': 'bg-blue-100 text-blue-800 border-blue-200'
                 };
                 const statusColor = badgeColors[patient.status] || 'bg-gray-100';
                 const dotColor = patient.status === 'Em Tratamento' ? 'bg-green-500' : 
                                  patient.status === 'Acompanhamento' ? 'bg-amber-500' : 
                                  patient.status === 'Triagem' ? 'bg-blue-500' : 'bg-gray-500';

                 return (
                  <tr key={patient.id} className="hover:bg-background-light group transition-colors cursor-pointer" onClick={() => onNavigate(Screen.PATIENT_RECORD)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`size-9 rounded-full flex items-center justify-center font-bold text-sm ${colorClasses[index % colorClasses.length]}`}>
                          {patient.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-text-main">{patient.name}</span>
                          <span className="text-xs text-text-muted">Mãe: {patient.motherName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted font-mono">{patient.cns}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-text-muted">forest</span>
                        {patient.village}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{patient.dob}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
                        <span className={`size-1.5 rounded-full ${dotColor}`}></span>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-surface-light px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            Mostrando <span className="font-medium text-text-main">1</span> até <span className="font-medium text-text-main">5</span> de <span className="font-medium text-text-main">50</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-text-muted bg-white border border-border-light rounded-md hover:bg-background-light disabled:opacity-50 transition-colors" disabled>
              Anterior
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-text-muted bg-white border border-border-light rounded-md hover:bg-background-light transition-colors">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientListScreen;
