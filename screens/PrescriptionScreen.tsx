import React from 'react';
import { Screen } from '../types';

interface PrescriptionScreenProps {
  onNavigate: (screen: Screen) => void;
}

const PrescriptionScreen: React.FC<PrescriptionScreenProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Context (3 cols) */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main mb-2">Nova Prescrição</h2>
          <p className="text-sm text-text-muted">Gestão de tratamentos tradicionais e alopáticos.</p>
        </div>

        <div className="bg-surface-light rounded-xl p-4 border border-border-light shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted">Histórico Recente</h3>
            <button className="text-primary hover:text-primary-dark">
              <span className="material-symbols-outlined text-sm">history</span>
            </button>
          </div>
          <ul className="space-y-3">
            <li className="flex flex-col gap-1 pb-3 border-b border-border-light last:border-0 last:pb-0">
              <span className="text-xs font-semibold text-primary">12 Out 2023</span>
              <span className="text-sm font-medium">Tratamento Gripe</span>
              <span className="text-xs text-text-muted">Dr. Carlos Yawalapiti</span>
            </li>
            <li className="flex flex-col gap-1 pb-3 border-b border-border-light last:border-0 last:pb-0">
              <span className="text-xs font-semibold text-primary">28 Set 2023</span>
              <span className="text-sm font-medium">Controle Pressão</span>
              <span className="text-xs text-text-muted">Enf. Sarah</span>
            </li>
          </ul>
        </div>

        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-1">lightbulb</span>
            <div>
              <h4 className="font-bold text-sm text-text-main mb-1">Dica do Sistema</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Lembre-se de registrar o modo de preparo detalhado para chás e infusões tradicionais.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form (9 cols) */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        {/* 1. Patient Selection */}
        <section className="bg-surface-light rounded-xl shadow-sm border border-border-light overflow-hidden">
          <div className="p-6 border-b border-border-light bg-background-light/50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-muted">search</span>
              </div>
              <input className="block w-full pl-10 pr-3 py-3 border-none rounded-lg bg-surface-light text-text-main placeholder-text-muted focus:ring-2 focus:ring-primary sm:text-sm shadow-sm" placeholder="Buscar paciente por nome, ID ou comunidade..." type="text" defaultValue="Iracema"/>
            </div>
          </div>
          
          <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-20 sm:size-24 border-4 border-background-light shadow-sm shrink-0"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqWK-1YjP0sJAc5qYKo6kJlTvUsDdRa7FkTOu9K6n8hMBIQspKuWpR3drtUfVc4-ALd80ZPWofvHZ6kZoQBURinO793PCeC3JlucvmrGBbYrJdpJYwQPAf5hgi0jsacEC-VVm-Sg14Fa69GWOVLhoIUtKo5DelTo8K9HnDZgaWZGqlGf6MZbdxo5iv0Gb8mv6ajw9gf-QIO-Vq5T9s24tdSUQSLA_kSiUwZa4OdPJRdBB-60PH5-xPv-GCFTTzrThleO0JEfDdURE")' }}
            ></div>
            <div className="flex-1 space-y-2 w-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-2xl font-bold text-text-main leading-tight">Iracema Tukano</h3>
                  <div className="flex items-center gap-2 text-text-muted mt-1">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span className="text-sm">Comunidade São Gabriel, Alto Rio Negro</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-dark">
                   ID: #8392-TUK
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border-light w-full">
                <div>
                  <span className="text-xs text-text-muted block">Idade</span>
                  <span className="font-medium text-text-main">45 anos</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Peso</span>
                  <span className="font-medium text-text-main">62 kg</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Tipo Sanguíneo</span>
                  <span className="font-medium text-text-main">O+</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Alergias</span>
                  <span className="font-medium text-red-500">Penicilina</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Prescription Items */}
        <section className="bg-surface-light rounded-xl shadow-sm border border-border-light flex flex-col">
          <div className="px-6 py-4 border-b border-border-light flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-main">Itens da Prescrição</h3>
            <span className="text-xs bg-background-light px-2 py-1 rounded text-text-muted">2 itens adicionados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-light text-text-muted uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tipo</th>
                  <th className="px-6 py-3 font-semibold">Medicamento / Planta</th>
                  <th className="px-6 py-3 font-semibold">Dosagem / Preparo</th>
                  <th className="px-6 py-3 font-semibold">Frequência</th>
                  <th className="px-6 py-3 font-semibold w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="material-symbols-outlined text-[14px]">pill</span> Alopático
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-text-main">Losartana Potássica</td>
                  <td className="px-6 py-4 text-text-muted">50mg (Comprimido)</td>
                  <td className="px-6 py-4 text-text-muted">1x ao dia (manhã)</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary-dark">
                      <span className="material-symbols-outlined text-[14px]">eco</span> Tradicional
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-text-main">Chá de Unha de Gato</td>
                  <td className="px-6 py-4 text-text-muted">Decocção (Casca)</td>
                  <td className="px-6 py-4 text-text-muted">2x ao dia (tarde/noite)</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-text-muted hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add New Item */}
          <div className="p-4 bg-background-light/50 border-t border-border-light">
            <p className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Adicionar Novo Item</p>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="sr-only">Tipo</label>
                <select className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm">
                  <option>Alopático</option>
                  <option selected>Tradicional</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="sr-only">Nome</label>
                <input className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted" placeholder="Nome do Medicamento/Planta" type="text"/>
              </div>
              <div className="md:col-span-3">
                <label className="sr-only">Dosagem</label>
                <input className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted" placeholder="Ex: 500mg ou 1 Punhado" type="text"/>
              </div>
              <div className="md:col-span-3">
                <label className="sr-only">Frequência</label>
                <input className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted" placeholder="Ex: A cada 8 horas" type="text"/>
              </div>
              <div className="md:col-span-1">
                <button className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark text-white rounded-lg py-2.5 shadow-md transition-colors">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Notes */}
        <section className="bg-surface-light rounded-xl shadow-sm border border-border-light flex flex-col p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">local_florist</span>
            <h3 className="text-lg font-bold text-text-main">Orientações Tradicionais (Bahsé)</h3>
          </div>
          <div className="relative">
            <textarea className="w-full rounded-lg border-none bg-background-light p-4 text-text-main focus:ring-2 focus:ring-primary resize-none placeholder-text-muted leading-relaxed" placeholder="Descreva aqui os procedimentos tradicionais, rituais de preparo, dietas alimentares específicas ou restrições culturais necessárias para o tratamento..." rows={5}></textarea>
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button className="p-1 text-text-muted hover:text-primary transition-colors" title="Inserir modelo de preparo de chá">
                <span className="material-symbols-outlined text-sm">water_drop</span>
              </button>
              <button className="p-1 text-text-muted hover:text-primary transition-colors" title="Inserir restrição alimentar">
                <span className="material-symbols-outlined text-sm">no_food</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-border-light mt-2">
          <button 
            onClick={() => onNavigate(Screen.PATIENT_RECORD)}
            className="px-6 py-3 rounded-lg text-text-muted font-medium hover:bg-background-light transition-colors"
          >
             Cancelar
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-light border border-border-light text-text-main font-semibold hover:bg-background-light transition-colors shadow-sm">
              <span className="material-symbols-outlined text-xl">print</span>
              Imprimir
            </button>
            <button className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95">
              <span className="material-symbols-outlined text-xl">save</span>
              Emitir Prescrição
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionScreen;
