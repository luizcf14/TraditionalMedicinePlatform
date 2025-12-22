import React from 'react';
import { Screen } from '../types';

interface RegistrationScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm text-text-muted">
            <button onClick={() => onNavigate(Screen.PATIENT_LIST)} className="hover:underline">Pacientes</button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>Novo Cadastro</span>
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Cadastro de Paciente</h1>
          <p className="text-text-muted mt-1">Preencha os dados abaixo para iniciar um novo prontuário no sistema.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(Screen.PATIENT_LIST)}
            className="px-4 py-2 rounded-lg border border-border-light text-text-main bg-white font-medium text-sm hover:bg-background-light transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Cancelar
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm shadow-sm transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Salvar Prontuário
          </button>
        </div>
      </div>

      {/* Progress Tabs */}
      <div className="border-b border-border-light">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          <button className="group flex items-center gap-2 border-b-2 border-primary pb-3 text-primary">
            <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
            <span className="text-sm font-bold whitespace-nowrap">Dados Pessoais</span>
          </button>
          <button className="group flex items-center gap-2 border-b-2 border-transparent pb-3 text-text-muted hover:text-text-main transition-colors">
            <span className="flex items-center justify-center size-6 rounded-full bg-background-light text-text-muted text-xs font-bold group-hover:bg-gray-200">2</span>
            <span className="text-sm font-medium whitespace-nowrap">Identidade Indígena</span>
          </button>
          <button className="group flex items-center gap-2 border-b-2 border-transparent pb-3 text-text-muted hover:text-text-main transition-colors">
            <span className="flex items-center justify-center size-6 rounded-full bg-background-light text-text-muted text-xs font-bold group-hover:bg-gray-200">3</span>
            <span className="text-sm font-medium whitespace-nowrap">Saúde & Histórico</span>
          </button>
          <button className="group flex items-center gap-2 border-b-2 border-transparent pb-3 text-text-muted hover:text-text-main transition-colors">
            <span className="flex items-center justify-center size-6 rounded-full bg-background-light text-text-muted text-xs font-bold group-hover:bg-gray-200">4</span>
            <span className="text-sm font-medium whitespace-nowrap">Documentos</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Personal Info */}
          <section className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border-light pb-4">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="text-lg font-bold text-text-main">Identificação Civil</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-2">Nome Civil Completo</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="Como consta no documento oficial" type="text"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Nome Social (Opcional)</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="Nome pelo qual prefere ser chamado" type="text"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Data de Nascimento</label>
                  <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" type="date"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Idade</label>
                  <input className="w-full rounded-lg border-border-light bg-gray-100 text-gray-500 cursor-not-allowed p-3" disabled type="text" value="--"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Sexo Biológico</label>
                <select className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                  <option>Selecione</option>
                  <option>Masculino</option>
                  <option>Feminino</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Identidade de Gênero</label>
                <select className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                  <option>Selecione</option>
                  <option>Cisgênero</option>
                  <option>Transgênero</option>
                  <option>Não-binário</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section: Cultural Context */}
          <section className="bg-white rounded-xl border border-border-light p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-6 border-b border-border-light pb-4 relative z-10">
              <span className="material-symbols-outlined text-primary">groups</span>
              <h3 className="text-lg font-bold text-text-main">Identidade & Contexto Cultural</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-2">Nome Indígena (Língua Materna)</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="Nome original na língua do povo" type="text"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Povo / Etnia</label>
                <select className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                  <option>Selecione o povo</option>
                  <option>Tukano</option>
                  <option>Baniwa</option>
                  <option>Desana</option>
                  <option>Hupda</option>
                  <option>Yanomami</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Língua Falada Principalmente</label>
                <select className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                  <option>Selecione</option>
                  <option>Português</option>
                  <option>Língua Indígena</option>
                  <option>Bilingue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Aldeia / Comunidade de Origem</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="Ex: São Gabriel da Cachoeira" type="text"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Distrito Sanitário Especial (DSEI)</label>
                <select className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                  <option>Alto Rio Negro</option>
                  <option>Yanomami</option>
                  <option>Médio Rio Purus</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section: Address */}
          <section className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-border-light pb-4">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h3 className="text-lg font-bold text-text-main">Localização Atual</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-2">Endereço / Localidade</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="Rua, Comunidade ou Ponto de Referência" type="text"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Telefone / Contato</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="(00) 00000-0000" type="tel"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Radiofonia (Se aplicável)</label>
                <input className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3" placeholder="Frequência ou Código" type="text"/>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Photo Upload Card */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer">
              <div className="size-32 rounded-full bg-background-light border-2 border-dashed border-primary/40 flex items-center justify-center mb-4 overflow-hidden">
                <span className="material-symbols-outlined text-4xl text-text-muted group-hover:text-primary transition-colors">add_a_photo</span>
              </div>
              <div className="absolute bottom-4 right-0 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary-dark transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </div>
            </div>
            <h4 className="font-bold text-text-main">Foto do Paciente</h4>
            <p className="text-xs text-text-muted mt-1">Formatos: JPG, PNG. Max 5MB.</p>
          </div>

          {/* Documents Quick Entry */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-text-main">Documentos Essenciais</h4>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Obrigatório</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Cartão Nacional de Saúde (CNS)</label>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-border-light bg-background-light text-text-muted">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </span>
                  <input className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary" placeholder="000 0000 0000 0000" type="text"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">CPF</label>
                <input className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary" placeholder="000.000.000-00" type="text"/>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">RANI (Opcional)</label>
                <p className="text-[10px] text-text-muted mb-1">Registro Administrativo de Nascimento Indígena</p>
                <input className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary" placeholder="Número de registro" type="text"/>
              </div>
            </div>
          </div>

          {/* Family Leadership */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">diversity_3</span>
              <div>
                <h4 className="font-bold text-text-main text-sm">Vínculo Familiar / Liderança</h4>
                <p className="text-xs text-text-muted mt-1 mb-3">Vincular a uma liderança ou chefe de família já cadastrado.</p>
                <button className="w-full py-2 px-3 bg-white border border-primary/30 rounded-lg text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Buscar Responsável
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationScreen;
