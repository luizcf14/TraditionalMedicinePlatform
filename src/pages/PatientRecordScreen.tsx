import React, { useEffect, useState } from 'react';
import { Screen, Patient, Appointment } from '../types';
import PrescriptionDocument from '../components/PrescriptionDocument';
import PatientSummaryDocument from '../components/PatientSummaryDocument';

interface PatientRecordScreenProps {
  onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
  patientId?: string | null;
}

interface AppointmentDetails {
  appointment: Appointment;
  prescription: {
    notes: string;
  } | null;
  items: {
    id: string;
    type: 'Alopático' | 'Tradicional';
    name: string;
    dosage: string;
    frequency: string;
  }[];
}

interface ActiveTreatment {
  id: string;
  name: string;
  type: 'Alopático' | 'Tradicional';
  dosage: string;
  frequency: string;
  duration?: string;
  endDate?: string;
  startDate: string;
  doctorName?: string;
}

interface ActiveTreatment {
  id: string;
  name: string;
  type: 'Alopático' | 'Tradicional';
  dosage: string;
  frequency: string;
  duration?: string;
  endDate?: string;
  startDate: string;
  doctorName?: string;
}

import AppointmentDetailsModal from '../components/AppointmentDetailsModal';

const PatientRecordScreen: React.FC<PatientRecordScreenProps> = ({ onNavigate, patientId }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTreatments, setActiveTreatments] = useState<ActiveTreatment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Quick Print State
  const [printingPrescription, setPrintingPrescription] = useState<any | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintingSummary, setIsPrintingSummary] = useState(false);

  const isInactive = patient?.status === 'Óbito' || (patient?.status as string) === 'Arquivo Morto';

  useEffect(() => {
    if ((printingPrescription && isPrinting) || isPrintingSummary) {
      // Give time for Portal to render
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
        setIsPrintingSummary(false); // Reset summary print state
        setPrintingPrescription(null); // Clear after print
      }, 500);
    }
  }, [printingPrescription, isPrinting, isPrintingSummary]);

  const handlePrintSummary = () => {
    setIsPrintingSummary(true);
  };

  const handleQuickPrint = async (appointmentId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}/details`);
      const data = await response.json();

      if (data.success && data.prescription) {
        setPrintingPrescription({
          patient: patient,
          items: data.items ? data.items.map((i: any) => ({
            ...i,
            treatmentDetails: i.treatmentDetails,
            plantDetails: i.plantDetails
          })) : [],
          diagnosis: data.prescription.diagnosis || '',
          notes: data.prescription.notes || '',
          history: [] // Optional: fetch history if needed, or leave empty for quick print
        });
        setIsPrinting(true);
      } else {
        alert("Erro ao carregar dados da prescrição.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com o servidor.");
    }
  };

  useEffect(() => {
    if (patientId) {
      setIsLoading(true);
      Promise.all([
        fetch(`http://localhost:3001/api/patients/${patientId}`).then(res => res.json()),
        fetch(`http://localhost:3001/api/patients/${patientId}/appointments`).then(res => res.json()),
        fetch(`http://localhost:3001/api/patients/${patientId}/active-treatments`).then(res => res.json())
      ]).then(([patientData, historyData, treatmentsData]) => {
        if (patientData.success) setPatient(patientData.patient);
        if (historyData.success) setAppointments(historyData.appointments);
        if (treatmentsData.success) setActiveTreatments(treatmentsData.treatments);
      }).catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [patientId]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Paciente não encontrado</h2>
        <button
          onClick={() => onNavigate(Screen.PATIENT_LIST)}
          className="text-primary underline"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <button onClick={() => onNavigate(Screen.DASHBOARD)} className="hover:text-primary">Início</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <button onClick={() => onNavigate(Screen.PATIENT_LIST)} className="hover:text-primary">Pacientes</button>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-text-main font-medium">Prontuário #{patient.id.substring(0, 6)}</span>
      </div>

      {/* Patient Header Card */}
      {isInactive && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined text-red-600">block</span>
          <div>
            <h3 className="font-bold text-red-800">Prontuário Inativo</h3>
            <p className="text-sm text-red-700">Este paciente está marcado como <strong>{patient.status}</strong>. Novos agendamentos e prescrições estão bloqueados.</p>
          </div>
        </div>
      )}

      <div className="bg-surface-light rounded-xl shadow-sm border border-border-light p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div
              className="h-24 w-24 rounded-full bg-cover bg-center border-4 border-background-light shadow-md"
              style={{ backgroundImage: `url("${patient.image}")` }}
            ></div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-text-main">{patient.name}</h1>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium border border-green-200">Ativo</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  {patient.age} anos ({patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'})
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                  {patient.village}
                </div>
                {patient.ethnicity && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">diversity_3</span>
                    Etnia {patient.ethnicity}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">

            <button
              onClick={() => onNavigate(Screen.REGISTRATION, patient.id)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-background-light border border-border-light rounded-lg text-text-main hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Editar
            </button>
            <button
              onClick={handlePrintSummary}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-background-light border border-border-light rounded-lg text-text-main hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              Imprimir
            </button>


          </div>
        </div>

        {/* Vital Stats / Alerts Bar */}
        <div className="mt-6 pt-6 border-t border-border-light grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <span className="material-symbols-outlined text-red-500">warning</span>
            <div>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Alergias</p>
              <p className="text-sm text-text-main font-medium">{patient.allergies || 'Nenhuma registrada'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <span className="material-symbols-outlined text-blue-500">water_drop</span>
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Tipo Sanguíneo</p>
              <p className="text-sm text-text-main font-medium">{patient.bloodType || 'Não informado'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <span className="material-symbols-outlined text-orange-500">medical_services</span>
            <div>
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Condição Crônica</p>
              <p className="text-sm text-text-main font-medium">{patient.conditions || 'Nenhuma'}</p>
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
            {/* <button className="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap bg-transparent">
              Tratamentos Atuais
            </button>
            <button className="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap bg-transparent">
              Exames & Laudos
            </button>
            <button className="px-6 py-3 text-sm font-medium text-text-muted hover:text-text-main transition-colors whitespace-nowrap bg-transparent">
              Evolução Espiritual
            </button> */}
          </div>

          {/* Filter */}
          <div className="flex gap-3 mb-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg">filter_list</span>
              <input className="w-full bg-surface-light border border-border-light rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Filtrar por data, sintoma ou especialista..." type="text" />
            </div>
            <select className="bg-surface-light border border-border-light rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary">
              <option>Todos os tipos</option>
              <option>Consultas</option>
              <option>Procedimentos</option>
            </select>
          </div>

          {/* Timeline */}
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-text-muted border border-dashed border-border-light rounded-xl">
              Nenhum histórico encontrado.
            </div>
          ) : (
            appointments.map((apt, index) => {
              const isLast = index === appointments.length - 1;
              const isPast = new Date(apt.date) < new Date();
              const statusColors: Record<string, string> = {
                'Completed': 'bg-green-100 text-green-800 border-green-200',
                'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
                'Cancelled': 'bg-red-100 text-red-800 border-red-200',
                'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200'
              };
              const statusLabel: Record<string, string> = {
                'Completed': 'Concluído',
                'Scheduled': 'Agendado',
                'Cancelled': 'Cancelado',
                'In Progress': 'Em Andamento'
              };

              return (
                <div key={apt.id} className={`relative pl-8 pb-8 ${isLast ? '' : 'border-l-2 border-border-light'}`}>
                  <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-background-light ${isPast ? 'bg-gray-400' : 'bg-primary'}`}></div>
                  <div
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className="bg-surface-light rounded-xl p-5 shadow-sm border border-border-light hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-lg material-symbols-outlined ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-primary/10 text-primary'}`}>
                          {apt.reason?.includes('Consulta') ? 'psychiatry' : 'stethoscope'}
                        </span>
                        <div>
                          <h3 className="font-bold text-lg text-text-main group-hover:text-primary transition-colors">{apt.reason || 'Consulta'}</h3>
                          <p className="text-sm text-text-muted">
                            {new Date(apt.date).toLocaleString('pt-BR')} • {apt.doctorName || 'Profissional'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${statusColors[apt.status] || 'bg-gray-100'}`}>
                        {statusLabel[apt.status] || apt.status}
                      </span>
                    </div>
                    <p className="text-text-main text-sm mb-4">{apt.notes}</p>

                    {/* Actions */}
                    {apt.prescriptionId && (
                      <div className="flex justify-end pt-3 border-t border-border-light">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickPrint(apt.id);
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full"
                          title="Re-imprimir Prescrição"
                        >
                          <span className="material-symbols-outlined text-[16px]">print</span>
                          Imprimir Prescrição
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

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
              <button
                className={`text-primary hover:bg-primary/10 p-1 rounded transition-colors ${isInactive ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isInactive}
                title={isInactive ? 'Bloqueado: Paciente Inativo' : 'Adicionar Tratamento'}
              >
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {activeTreatments.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-2">Nenhum tratamento ativo encontrado.</p>
              ) : (
                activeTreatments.map(treatment => (
                  <div key={treatment.id} className="flex gap-3 pb-3 border-b border-border-light last:border-0 last:pb-0">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${treatment.type === 'Alopático' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      <span className="material-symbols-outlined">{treatment.type === 'Alopático' ? 'pill' : 'eco'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm text-text-main">{treatment.name}</h4>
                        <span className="text-xs font-bold text-primary">{treatment.frequency}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{treatment.dosage}</p>

                      {/* Duration/Progress Indication */}
                      {treatment.endDate ? (
                        <div className="mt-2 text-[10px] text-text-muted flex justify-between items-center">
                          <span>Início: {new Date(treatment.startDate).toLocaleDateString()}</span>
                          <span>Fim: {new Date(treatment.endDate).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="mt-2 text-[10px] text-text-muted">
                          {treatment.duration || 'Duração indeterminada'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
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
              <button
                className={`w-full py-2 text-sm text-text-main border border-border-light rounded-lg hover:bg-background-light transition-colors ${isInactive ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                disabled={isInactive}
                title={isInactive ? 'Bloqueado: Paciente Inativo' : 'Agendar novo retorno'}
              >
                Agendar novo retorno
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        selectedAppointmentId && (
          <AppointmentDetailsModal
            appointmentId={selectedAppointmentId}
            onClose={() => setSelectedAppointmentId(null)}
            onNavigate={onNavigate}
          />
        )
      }

      <style>
        {`
          @media print {
            html, body {
              overflow: visible !important;
              height: auto !important;
            }
            #root { display: none !important; }
            #printable-section, #printable-summary {
              display: block !important;
              position: relative !important;
              width: 100% !important;
              height: auto !important;
              background: white;
              padding: 0;
              margin: 0;
            }
            .page-break {
                page-break-before: always;
                break-before: page;
                display: block;
                margin-top: 2rem;
            }
            #printable-section *, #printable-summary * { visibility: visible !important; }
          }
        `}
      </style>

      {/* Hidden Portal for Print */}
      {
        printingPrescription && (
          <PrescriptionDocument
            patient={printingPrescription.patient}
            items={printingPrescription.items}
            diagnosis={printingPrescription.diagnosis}
            notes={printingPrescription.notes}
            history={printingPrescription.history}
          />
        )
      }

      {
        isPrintingSummary && patient && (
          <PatientSummaryDocument
            patient={patient}
            appointments={appointments}
            activeTreatments={activeTreatments}
          />
        )
      }
    </div >
  );
};

export default PatientRecordScreen;
