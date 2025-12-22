import React from 'react';
import { Screen } from '../types';

interface PatientRecordScreenProps {
  onNavigate: (screen: Screen) => void;
}

const PatientRecordScreen: React.FC<PatientRecordScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <button onClick={() => onNavigate(Screen.DASHBOARD)} className="hover:text-primary">Início</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button onClick={() => onNavigate(Screen.PATIENT_LIST)} className="hover:text-primary">Pacientes</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-main font-medium">Prontuário #83921</span>
      </div>

      {/* Patient Header Card */}
      <div className="bg-surface-light rounded-xl shadow-sm border border-border-light p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div 
              className="h-24 w-24 rounded-full bg-cover bg-center border-4 border-background-light shadow-md"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdZ6jl0oUoWCheHJVpfWjHboO3f6toylhX1jESCL4hoMP_kWCfDK7zfKvHGoxkRaezlKJ_cmIaUW5xZ9OGtvHPb89o-OjSWcqa9KyvOMOtHPh8nHxDsOI0GaUKSzzsbZJAVR7pF3q3gdCBMOXoJzw1GTAHO7TICE-po06L3pUhpmC64orc41qifsV2KMBF75RRh407V6IwjniRmqmmW9s3XCRDxo_t8rWgXutIId7kBlngyh_FutVwCQM5oh9rQgcj661wVGUOfNc")' }}
            ></div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-text-main">Yara Tukano</h1>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium border border-green-200">Ativo</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  34 anos (02/05/1990)
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  Aldeia Yuhupdeh
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">diversity_3</span>
                  Etnia Tukano
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-background-light border border-border-light rounded-lg text-text-main hover:bg-gray-100 transition-colors font-medium text-sm">
              <span className="material-symbols-outlined text-lg">print</span>
              Imprimir
            </button>
            <button 
              onClick={() => onNavigate(Screen.NEW_PRESCRIPTION)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nova Consulta
            </button>
          </div>
        </div>

        {/* Vital Stats / Alerts Bar */}
        <div className="mt-6 pt-6 border-t border-border-light grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Alergias</p>
              <p className="text-sm text-text-main font-medium">Penicilina, Picada de Abelha</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <span className="material-symbols-outlined text-blue-500">water_drop</span>
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Tipo Sanguíneo</p>
              <p className="text-sm text-text-main font-medium">O Positivo</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <span className="material-symbols-outlined text-orange-500">medical_services</span>
            <div>
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Condição Crônica</p>
              <p className="text-sm text-text-main font-medium">Asma Leve</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-background-light rounded-lg border border-border-light">
            <span className="material-symbols-outlined text-text-muted">history</span>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Última Visita</p>
              <p className="text-sm text-text-main font-medium">10 Out 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Timeline) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex overflow-x-auto pb-2 scrollbar-hide border-b border-border-light">
            <button className="px-6 py-3 text-sm font-medium text-primary border-b-2 border-primary whitespace-nowrap bg-transparent">
              Histórico Clínico
            </button>
            <button className="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap bg-transparent">
              Tratamentos Atuais
            </button>
            <button className="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap bg-transparent">
              Exames & Laudos
            </button>
            <button className="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap bg-transparent">
              Evolução Espiritual
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-3 mb-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg">filter_list</span>
              <input className="w-full bg-surface-light border border-border-light rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Filtrar por data, sintoma ou especialista..." type="text"/>
            </div>
            <select className="bg-surface-light border border-border-light rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary">
              <option>Todos os tipos</option>
              <option>Consultas</option>
              <option>Procedimentos</option>
            </select>
          </div>

          {/* Timeline Item 1 */}
          <div className="relative pl-8 pb-8 border-l-2 border-primary/30 last:border-0 last:pb-0">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background-light"></div>
            <div className="bg-surface-light rounded-xl p-5 shadow-sm border border-border-light hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary p-2 rounded-lg material-symbols-outlined">psychiatry</span>
                  <div>
                    <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">Consulta Tradicional</h3>
                    <p className="text-sm text-text-muted">Hoje, 10:30 • Pajé Kumu</p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-yellow-200">Em Andamento</span>
              </div>
              <p className="text-text-main text-sm mb-4">Paciente relata cansaço excessivo e sonhos agitados. Diagnóstico preliminar aponta para desequilíbrio energético causado por tensão na comunidade.</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-background-light text-text-muted border border-border-light">
                  <span className="material-symbols-outlined text-sm">spa</span> Banho de Ervas
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-background-light text-text-muted border border-border-light">
                  <span className="material-symbols-outlined text-sm">self_improvement</span> Rezo de Proteção
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative pl-8 pb-8 border-l-2 border-border-light">
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 border-4 border-background-light"></div>
            <div className="bg-surface-light rounded-xl p-5 shadow-sm border border-border-light opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-600 p-2 rounded-lg material-symbols-outlined">stethoscope</span>
                  <div>
                    <h3 className="font-bold text-lg text-text-main">Avaliação Física</h3>
                    <p className="text-sm text-text-muted">15 Set 2023 • Dra. Ana Silva</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">Concluído</span>
              </div>
              <p className="text-sm text-text-main mb-3">
                Exame de rotina. Pressão arterial 12/8. Queixa de dor leve nas articulações. Prescrito repouso e pomada de copaíba.
              </p>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-light">
                <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">description</span> Ver Receita
                </button>
              </div>
            </div>
          </div>

          <button className="w-full py-3 text-sm font-medium text-text-muted hover:text-primary border border-dashed border-border-light rounded-xl hover:bg-surface-light transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">history</span>
            Carregar histórico anterior
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Treatments */}
          <div className="bg-surface-light rounded-xl shadow-sm border border-border-light overflow-hidden">
            <div className="p-4 border-b border-border-light flex justify-between items-center bg-background-light">
              <h3 className="font-bold text-text-main">Tratamentos Ativos</h3>
              <button className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm text-text-main">Chá de Unha de Gato</h4>
                    <span className="text-xs font-bold text-primary">2x/dia</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Para inflamação e imunidade</p>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/4 rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 text-right">15 dias restantes</p>
                </div>
              </div>
              <div className="border-t border-border-light"></div>
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                  <span className="material-symbols-outlined">light_mode</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm text-text-main">Defumação Matinal</h4>
                    <span className="text-xs font-bold text-primary">1x/sem</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">Limpeza espiritual da casa</p>
                  <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-1/4 rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 text-right">Próxima: Amanhã</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-primary/5 border-t border-primary/10 text-center">
              <button className="text-xs font-medium text-primary hover:underline">Ver plano completo de cuidados</button>
            </div>
          </div>

          {/* Next Visit */}
          <div className="bg-surface-light rounded-xl shadow-sm border border-border-light">
            <div className="p-4 border-b border-border-light flex justify-between items-center bg-background-light">
              <h3 className="font-bold text-text-main">Próximas Visitas</h3>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex flex-col items-center bg-background-light rounded-lg p-2 border border-border-light min-w-[60px]">
                  <span className="text-xs font-bold text-red-500 uppercase">OUT</span>
                  <span className="text-xl font-bold text-text-main">24</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-text-main">Retorno de Acompanhamento</h4>
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span> 14:00 - 15:00
                  </p>
                  <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person</span> Pajé Kumu
                  </p>
                </div>
              </div>
              <button className="w-full py-2 text-sm text-text-main border border-border-light rounded-lg hover:bg-background-light transition-colors">
                Agendar novo retorno
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecordScreen;
