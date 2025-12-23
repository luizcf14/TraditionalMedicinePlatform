import React, { useState, useEffect } from 'react';
import { Screen, Patient } from '../types';

interface PrescriptionScreenProps {
  onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
  patientId?: string | null;
  appointmentId?: string | null;
}

interface PrescriptionItemState {
  id: string; // Temporary ID for UI
  type: 'Alopático' | 'Tradicional';
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  endDate?: string;
}

const PrescriptionScreen: React.FC<PrescriptionScreenProps> = ({ onNavigate, patientId, appointmentId }) => {
  console.log('PrescriptionScreen mounted. patientId:', patientId, 'appointmentId:', appointmentId);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [items, setItems] = useState<PrescriptionItemState[]>([]);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Chronic Conditions Edit State
  const [conditions, setConditions] = useState('');
  const [isEditingConditions, setIsEditingConditions] = useState(false);
  const [isSavingConditions, setIsSavingConditions] = useState(false);

  // New Item Form State
  const [newItemType, setNewItemType] = useState<'Alopático' | 'Tradicional'>('Tradicional');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDosage, setNewItemDosage] = useState('');

  const [newItemFrequency, setNewItemFrequency] = useState('');
  const [newItemDuration, setNewItemDuration] = useState('');
  const [newItemEndDate, setNewItemEndDate] = useState('');

  // History State
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = () => {
    if (!patientId) return;

    console.log('Fetching history for patient:', patientId);
    fetch(`http://localhost:3001/api/patients/${patientId}/appointments`)
      .then(res => res.json())
      .then(data => {
        console.log('History data:', data);
        if (data.success && Array.isArray(data.appointments)) {
          setHistory(data.appointments.slice(0, 3));
        } else {
          setHistory([]);
        }
      })
      .catch(err => console.error('Error fetching history:', err));
  };

  useEffect(() => {
    if (patientId) {
      // Fetch Patient Details
      fetch(`http://localhost:3001/api/patients/${patientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPatient(data.patient);
            setConditions(data.patient.conditions || '');
          }
        })
        .catch(err => console.error(err));

      // Fetch History
      fetchHistory();
    }
  }, [patientId]);

  const handleAddItem = () => {
    if (!newItemName || !newItemDosage || !newItemFrequency) return;

    const newItem: PrescriptionItemState = {
      id: Date.now().toString(),
      type: newItemType,
      name: newItemName,
      dosage: newItemDosage,
      frequency: newItemFrequency,
      duration: newItemDuration,
      endDate: newItemEndDate
    };

    setItems([...items, newItem]);

    // Reset form
    setNewItemName('');
    setNewItemDosage('');
    setNewItemFrequency('');
    setNewItemDuration('');
    setNewItemEndDate('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Return Appointment State
  const [scheduleReturn, setScheduleReturn] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnTime, setReturnTime] = useState('09:00');

  const handleSavePrescription = async () => {
    if (!appointmentId) {
      alert('Erro: Nenhum atendimento vinculado. Inicie pelo "Novo Atendimento".');
      return;
    }
    if (items.length === 0 && !notes) {
      alert('Adicione itens ou orientações para salvar.');
      return;
    }

    if (scheduleReturn && !returnDate) {
      alert('Por favor, selecione uma data para o retorno.');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Save Prescription
      const response = await fetch('http://localhost:3001/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          doctorId: null, // Backend handles login check later, MVP uses seed
          items,
          notes
        })
      });
      const data = await response.json();

      if (data.success) {
        // 2. If Schedule Return is checked, create new appointment
        if (scheduleReturn && returnDate) {
          try {
            await fetch('http://localhost:3001/api/appointments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                patientId,
                doctorId: null, // Default
                date: `${returnDate}T${returnTime}:00`,
                reason: 'Retorno',
                status: 'Agendada',
                notes: 'Agendado via Prescrição'
              })
            });
            alert('Prescrição emitida e retorno agendado com sucesso!');
          } catch (optErr) {
            console.error(optErr);
            alert('Prescrição salva, mas houve erro ao agendar retorno.');
          }
        } else {
          alert('Prescrição emitida com sucesso!');
        }
      } else {
        alert('Erro ao salvar prescrição.');
      }
      onNavigate(Screen.PATIENT_RECORD, patientId || undefined);

    } catch (error) {
      console.error(error);
      alert('Erro de conexão ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };



  const handleSaveConditions = async () => {
    if (!patientId) return;
    setIsSavingConditions(true);
    try {
      // Need to send all required fields or update backend to accept partial.
      // Based on current backend implementation for PUT /api/patients/:id, it expects all fields.
      // We will re-fetch or use existing patient data to fill the gaps.
      if (!patient) return;

      const body = {
        name: patient.name,
        dob: patient.dob,
        village: patient.village,
        ethnicity: patient.ethnicity,
        cns: patient.cns,
        cpf: patient.cpf,
        motherName: patient.motherName,
        indigenousName: patient.indigenousName,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        conditions: conditions
      };

      const response = await fetch(`http://localhost:3001/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setIsEditingConditions(false);
        // Update local patient state
        setPatient({ ...patient, conditions });
        alert('Condições atualizadas com sucesso!');
      } else {
        alert('Erro ao atualizar condições.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setIsSavingConditions(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            /* Hide everything by default */
            body * {
              visibility: hidden;
            }
            /* Show only the printable area */
            #printable-section, #printable-section * {
              visibility: visible;
            }
            #printable-section {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 2cm;
              background: white;
            }
            /* Hide the main layout elements explicitly */
            nav, header, aside, .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      {/* Printable Section (Hidden on Screen) */}
      <div id="printable-section" className="hidden print:block">
        {patient && (
          <div className="flex flex-col gap-6 font-sans">
            {/* Header */}
            <div className="border-b-2 border-primary pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-primary">Prescrição Médica / Recomendação Tradicional</h1>
                <p className="text-sm text-gray-500">Unidade de Saúde: <b>Posto de Saúde Indígena Xingu</b></p>
              </div>
              <div className="text-right text-sm">
                <p>Data: {new Date().toLocaleDateString()}</p>
                <p>Emitido por: Dr(a). Luiz (Clínico Geral)</p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-bold mb-2">Dados do Paciente</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="font-semibold">Nome:</span> {patient.name}</p>
                <p><span className="font-semibold">Aldeia:</span> {patient.village}</p>
                <p><span className="font-semibold">Idade:</span> {patient.age} anos</p>
                <p><span className="font-semibold">ID:</span> #{patient.id.substring(0, 6)}</p>
              </div>
            </div>

            {/* Current Prescription */}
            <div>
              <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-l-4 border-primary pl-2">Medicamentos & Tratamentos</h2>
              {items.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="py-2 font-semibold">Tipo</th>
                      <th className="py-2 font-semibold">Nome</th>
                      <th className="py-2 font-semibold">Dosagem</th>
                      <th className="py-2 font-semibold">Frequência</th>
                      <th className="py-2 font-semibold">Duração</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3">{item.type}</td>
                        <td className="py-3 font-medium">{item.name}</td>
                        <td className="py-3">{item.dosage}</td>
                        <td className="py-3">{item.frequency}</td>
                        <td className="py-3">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm italic text-gray-500">Nenhum item prescrito.</p>
              )}
            </div>

            {/* Current Notes */}
            {notes && (
              <div>
                <h2 className="text-lg font-bold mb-3 uppercase tracking-wide border-l-4 border-orange-500 pl-2">Orientações (Bahsé / Dietas)</h2>
                <div className="bg-orange-50 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap border border-orange-100 leading-relaxed">
                  {notes}
                </div>
              </div>
            )}

            {/* Recent History (For Context) */}
            {history.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase">Histórico Recente (Últimos atendimentos)</h3>
                <div className="space-y-4">
                  {history.map(apt => (
                    <div key={apt.id} className="text-xs text-gray-600">
                      <p className="font-semibold">{new Date(apt.date).toLocaleDateString()} - {apt.reason}</p>
                      {apt.notes && <p className="italic pl-2 border-l-2 border-gray-200 mt-1">"{apt.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
              <p>Documento gerado eletronicamente pelo Sistema de Saúde Tradicional do Xingu.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {/* Left Column: Context (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-main mb-2">Nova Prescrição</h2>
            <p className="text-sm text-text-muted">Gestão de tratamentos tradicionais e alopáticos.</p>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-border-light shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-text-muted">Histórico Recente</h3>
              <button
                onClick={fetchHistory}
                className="text-primary hover:text-primary-dark transition-colors"
                title="Atualizar Histórico"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
            </div>
            <ul className="space-y-3">
              {history.length > 0 ? (
                history.map(apt => (
                  <li key={apt.id} className="flex flex-col gap-1 pb-3 border-b border-border-light last:border-0 last:pb-0">
                    <span className="text-xs font-semibold text-primary">{new Date(apt.date).toLocaleDateString()}</span>
                    <span className="text-sm font-medium">{apt.reason}</span>
                    <span className="text-xs text-text-muted">{apt.doctorName}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-text-muted italic">Nenhum histórico recente.</li>
              )}
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
              <div className="flex items-center gap-2 text-text-muted">
                <span className="material-symbols-outlined">person</span>
                <span className="font-semibold text-sm">Paciente Selecionado</span>
              </div>
            </div>

            {patient ? (
              <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-20 sm:size-24 border-4 border-background-light shadow-sm shrink-0"
                  style={{ backgroundImage: `url("${patient.image}")` }}
                ></div>
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-text-main leading-tight">{patient.name}</h3>
                      <div className="flex items-center gap-2 text-text-muted mt-1">
                        <span className="material-symbols-outlined text-lg">location_on</span>
                        <span className="text-sm">{patient.village}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-dark">
                      ID: #{patient.id.substring(0, 6)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border-light w-full">
                    <div className="bg-background-light/50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Idade</span>
                      <span className="font-bold text-lg text-text-main">{patient.age} <span className="text-xs font-normal text-text-muted">anos</span></span>
                    </div>
                    <div className="bg-background-light/50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Nascimento</span>
                      <span className="font-medium text-text-main">{patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="bg-background-light/50 p-3 rounded-lg">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Tipo Sanguíneo</span>
                      <span className={`font-bold text-lg ${patient.bloodType ? 'text-primary' : 'text-text-muted'}`}>{patient.bloodType || '-'}</span>
                    </div>
                    <div className={`p-3 rounded-lg border ${patient.allergies ? 'bg-red-50 border-red-100' : 'bg-background-light/50 border-transparent'}`}>
                      <span className={`text-xs font-semibold uppercase tracking-wider block mb-1 ${patient.allergies ? 'text-red-700' : 'text-text-muted'}`}>Alergias</span>
                      <span className={`font-medium ${patient.allergies ? 'text-red-600' : 'text-text-muted italic'}`}>{patient.allergies || 'Nenhuma'}</span>
                    </div>
                  </div>

                  {/* Editable Conditions Section */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">medical_services</span>
                        <span className="text-sm font-bold text-text-main uppercase tracking-wider">Condições Crônicas</span>
                      </div>
                      {!isEditingConditions ? (
                        <button
                          onClick={() => setIsEditingConditions(true)}
                          className="text-primary hover:text-primary-dark text-xs font-bold uppercase tracking-wide flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full hover:bg-primary/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Editar
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setIsEditingConditions(false);
                              setConditions(patient.conditions || '');
                            }}
                            className="text-text-muted hover:text-text-main text-xs font-semibold px-3 py-1.5"
                            disabled={isSavingConditions}
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveConditions}
                            className="text-white bg-primary hover:bg-primary-dark text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-sm disabled:opacity-50 transition-all"
                            disabled={isSavingConditions}
                          >
                            {isSavingConditions ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditingConditions ? (
                      <div className="relative">
                        <textarea
                          value={conditions}
                          onChange={(e) => setConditions(e.target.value)}
                          className="w-full rounded-xl border-2 border-primary/20 bg-white p-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                          rows={3}
                          placeholder="Descreva as condições crônicas do paciente..."
                          autoFocus
                        />
                        <span className="absolute bottom-3 right-3 text-xs text-text-muted">Pressione Salvar para registrar</span>
                      </div>
                    ) : (
                      <div className={`rounded-xl p-4 border ${patient.conditions ? 'bg-orange-50/50 border-orange-100' : 'bg-background-light border-transparent'}`}>
                        <p className={`text-sm leading-relaxed ${patient.conditions ? 'text-text-main font-medium' : 'text-text-muted italic'}`}>
                          {patient.conditions || "Nenhuma condição crônica registrada."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            ) : (
              <div className="p-6 text-center text-text-muted">
                Carregando dados do paciente...
              </div>
            )}
          </section>

          {/* 2. Prescription Items */}
          <section className="bg-surface-light rounded-xl shadow-sm border border-border-light flex flex-col">
            <div className="px-6 py-4 border-b border-border-light flex justify-between items-center">
              <h3 className="text-lg font-bold text-text-main">Itens da Prescrição</h3>
              <span className="text-xs bg-background-light px-2 py-1 rounded text-text-muted">{items.length} itens adicionados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light text-text-muted uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Tipo</th>
                    <th className="px-6 py-3 font-semibold">Medicamento / Planta</th>
                    <th className="px-6 py-3 font-semibold">Dosagem / Preparo</th>
                    <th className="px-6 py-3 font-semibold">Frequência</th>
                    <th className="px-6 py-3 font-semibold">Duração</th>
                    <th className="px-6 py-3 font-semibold w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-text-muted italic">
                        Nenhum item adicionado à prescrição. Utilize o formulário abaixo.
                      </td>
                    </tr>
                  ) : (
                    items.map(item => (
                      <tr key={item.id} className="hover:bg-background-light transition-colors">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${item.type === 'Alopático' ? 'bg-blue-100 text-blue-800' : 'bg-primary/20 text-primary-dark'
                            }`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {item.type === 'Alopático' ? 'pill' : 'eco'}
                            </span>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-text-main">{item.name}</td>
                        <td className="px-6 py-4 text-text-muted">{item.dosage}</td>
                        <td className="px-6 py-4 text-text-muted">{item.frequency}</td>
                        <td className="px-6 py-4 text-text-muted">
                          {item.duration || '-'}
                          {item.endDate && <span className="block text-xs text-text-muted/70">Até: {new Date(item.endDate).toLocaleDateString()}</span>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleRemoveItem(item.id)} className="text-text-muted hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add New Item */}
            <div className="p-4 bg-background-light/50 border-t border-border-light">
              <p className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Adicionar Novo Item</p>
              <div className="grid grid-cols-1 md:grid-cols-15 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-text-muted mb-1">Tipo</label>
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value as any)}
                    className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm"
                  >
                    <option value="Alopático">Alopático</option>
                    <option value="Tradicional">Tradicional</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-text-muted mb-1">Nome</label>
                  <input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted"
                    placeholder="Nome do Medicamento/Planta"
                    type="text"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-text-muted mb-1">Dosagem</label>
                  <input
                    value={newItemDosage}
                    onChange={(e) => setNewItemDosage(e.target.value)}
                    className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted"
                    placeholder="Ex: 500mg ou 1 Punhado"
                    type="text"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-text-muted mb-1">Frequência</label>
                  <input
                    value={newItemFrequency}
                    onChange={(e) => setNewItemFrequency(e.target.value)}
                    className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted"
                    placeholder="Ex: A cada 8 horas"
                    type="text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-text-muted mb-1">Duração</label>
                  <input
                    value={newItemDuration}
                    onChange={(e) => setNewItemDuration(e.target.value)}
                    className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm placeholder-text-muted"
                    placeholder="Ex: 7 dias"
                    type="text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-text-muted mb-1">Data Final</label>
                  <input
                    value={newItemEndDate}
                    onChange={(e) => setNewItemEndDate(e.target.value)}
                    className="w-full rounded-lg border-none bg-white py-2.5 px-3 text-sm text-text-main focus:ring-1 focus:ring-primary shadow-sm"
                    title="Data de Término (Opcional)"
                    type="date"
                  />
                </div>
                <div className="md:col-span-1">
                  <button
                    onClick={handleAddItem}
                    disabled={!newItemName || !newItemDosage || !newItemFrequency || !newItemDuration}
                    className="w-full flex items-center justify-center bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 shadow-md transition-colors"
                  >
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
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border-none bg-background-light p-4 text-text-main focus:ring-2 focus:ring-primary resize-none placeholder-text-muted leading-relaxed"
                placeholder="Descreva aqui os procedimentos tradicionais, rituais de preparo, dietas alimentares específicas ou restrições culturais necessárias para o tratamento..."
                rows={5}
              ></textarea>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={() => setNotes(prev => prev + 'Preparo: Fazer infusão com água fervente e deixar abafado por 10 minutos.\n')}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  title="Inserir modelo de preparo de chá"
                >
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                </button>
                <button
                  onClick={() => setNotes(prev => prev + 'Dieta: Evitar alimentos gordurosos e pimenta (pimenta jiquitaia permitida com moderação).\n')}
                  className="p-1 text-text-muted hover:text-primary transition-colors"
                  title="Inserir restrição alimentar"
                >
                  <span className="material-symbols-outlined text-sm">no_food</span>
                </button>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col gap-4 mt-2 border-t border-border-light pt-4">

            {/* Follow-up Scheduling */}
            <div className="flex items-center justify-end gap-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="scheduleReturn"
                  checked={scheduleReturn}
                  onChange={(e) => setScheduleReturn(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300"
                />
                <label htmlFor="scheduleReturn" className="text-sm font-medium text-text-main cursor-pointer select-none">Agendar Retorno</label>
              </div>

              {scheduleReturn && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-sm text-text-muted">Para:</span>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="rounded-lg border-border-light text-sm p-2 focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="rounded-lg border-border-light text-sm p-2 focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => onNavigate(Screen.PATIENT_RECORD, patientId || undefined)}
                className="px-6 py-3 rounded-lg text-text-muted font-medium hover:bg-background-light transition-colors"
              >
                Cancelar
              </button>
              <div className="flex gap-3">
                <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-light border border-border-light text-text-main font-semibold hover:bg-background-light transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-xl">print</span>
                  Imprimir
                </button>
                <button
                  onClick={handleSavePrescription}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  <span className="material-symbols-outlined text-xl">save</span>
                  {isSaving ? 'Salvando...' : 'Emitir Prescrição'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionScreen;
