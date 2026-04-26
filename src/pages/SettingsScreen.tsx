import React, { useState, useEffect } from 'react';
import { Screen } from '../types';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const [isMinimalist, setIsMinimalist] = useState(false);

  const defaultTemplate = "Sintomas:\n\nPrescrição:\n\nObservações:";
  const [template, setTemplate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('minimalistConsultation');
    if (saved === 'true') {
      setIsMinimalist(true);
    }
    const savedTemplate = localStorage.getItem('minimalistTemplate');
    if (savedTemplate) {
      setTemplate(savedTemplate);
    } else {
      setTemplate(defaultTemplate);
      // Don't necessarily save to local storage immediately, but we can
    }
  }, []);

  const handleToggleMinimalist = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsMinimalist(checked);
    localStorage.setItem('minimalistConsultation', checked.toString());
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(e.target.value);
    localStorage.setItem('minimalistTemplate', e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <button
          onClick={() => onNavigate(Screen.DASHBOARD)}
          className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-4 text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Voltar ao Painel
        </button>
        <h2 className="text-text-main text-3xl font-bold leading-tight">Configurações</h2>
        <p className="text-text-muted text-base mt-1">Gerencie as preferências e opções do sistema.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden">
        <div className="p-6 border-b border-border-light bg-background-light/50">
          <div className="flex items-center gap-2 text-text-muted">
            <span className="material-symbols-outlined">tune</span>
            <span className="font-semibold text-sm uppercase tracking-wider">Preferências de Interface</span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-main">Atendimento Minimalista</h3>
              <p className="text-sm text-text-muted mt-1 max-w-xl">
                Oculta as opções de prescrição de medicamentos, gráficos de crescimento e agendamento na tela de atendimento, mantendo apenas as Anotações e dados básicos do paciente num layout mais compacto.
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                value="" 
                className="sr-only peer" 
                checked={isMinimalist}
                onChange={handleToggleMinimalist}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {isMinimalist && (
            <div className="mt-4 pt-6 border-t border-border-light animate-in fade-in slide-in-from-top-2">
              <h3 className="text-lg font-bold text-text-main mb-2">Template de Anotações</h3>
              <p className="text-sm text-text-muted mb-4 max-w-xl">
                Defina o texto padrão que será carregado automaticamente no campo de "Anotações" quando iniciar uma consulta no modo minimalista.
              </p>
              <textarea
                value={template}
                onChange={handleTemplateChange}
                className="w-full h-32 p-3 bg-surface-light border border-border-light rounded-lg text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                placeholder="Ex: Sintomas: ... Prescrição: ..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
