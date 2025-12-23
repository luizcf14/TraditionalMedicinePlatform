import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Patient, Appointment } from '../types';

interface PatientSummaryDocumentProps {
    patient: Patient;
    appointments: Appointment[];
    activeTreatments: any[]; // Using any for now to match the localized type in PatientRecordScreen
}

const PatientSummaryDocument: React.FC<PatientSummaryDocumentProps> = ({
    patient,
    appointments,
    activeTreatments
}) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Small delay to ensure styles are applied before print
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!loaded) return null;

    return createPortal(
        <div id="printable-summary" className="font-sans text-black bg-white p-8 max-w-[210mm] mx-auto print:p-0">
            <style>
                {`
                    @media print {
                        @page { margin: 1cm; size: A4; }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        #printable-summary { width: 100%; height: auto; overflow: visible; }
                        .no-break { break-inside: avoid; }
                    }
                `}
            </style>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-6">
                <div className="flex gap-4 items-center">
                    {/* Logo Placeholder */}
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xs text-center font-bold border-2 border-gray-400">
                        Perfil do Paciente
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-wide">Prontuário Médico</h1>
                        <p className="text-sm text-gray-600"> Sistema de Medicina Tradicional</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Gerado em</p>
                    <p className="font-medium">{new Date().toLocaleString('pt-BR')}</p>
                </div>
            </div>

            {/* Patient Profile Section */}
            <section className="mb-8 border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex gap-6 items-start">
                    {/* Photo */}
                    <div className="w-32 h-32 rounded-lg bg-gray-200 border border-gray-300 flex-shrink-0 overflow-hidden print:border-gray-400">
                        {patient.image ? (
                            <img
                                src={patient.image}
                                alt={patient.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                Sem foto
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                        <div className="col-span-2">
                            <span className="block text-xs font-bold text-gray-500 uppercase">Nome Completo</span>
                            <span className="text-lg font-bold">{patient.name}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase">Idade / Nascimento</span>
                            <span>{patient.age} anos ({patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'})</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase">Aldeia</span>
                            <span>{patient.village}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase">Etnia</span>
                            <span>{patient.ethnicity || '-'}</span>
                        </div>
                        <div>
                            <span className="block text-xs font-bold text-gray-500 uppercase">CNS</span>
                            <span>{patient.cns || '-'}</span>
                        </div>
                        <div className="col-span-2 border-t border-gray-200 pt-2 mt-1">
                            <span className="block text-xs font-bold text-gray-500 uppercase">Alergias</span>
                            <span className="text-red-700 font-medium">{patient.allergies || 'Nenhuma registrada'}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-xs font-bold text-gray-500 uppercase">Condições Crônicas</span>
                            <span className="text-orange-700 font-medium">{patient.conditions || 'Nenhuma registrada'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Treatments */}
            <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 flex items-center gap-2">
                    <span className="text-lg material-symbols-outlined">medication</span>
                    Tratamentos Ativos
                </h2>
                {activeTreatments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic px-2">Nenhum tratamento ativo no momento.</p>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 rounded-l">Medicamento / Tratamento</th>
                                <th className="px-3 py-2">Tipo</th>
                                <th className="px-3 py-2">Posologia</th>
                                <th className="px-3 py-2 rounded-r">Duração</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {activeTreatments.map((t, idx) => (
                                <tr key={idx}>
                                    <td className="px-3 py-2 font-medium">{t.name}</td>
                                    <td className="px-3 py-2 text-xs">{t.type}</td>
                                    <td className="px-3 py-2">{t.dosage} - {t.frequency}</td>
                                    <td className="px-3 py-2 text-gray-600">{t.duration || 'Contínuo'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Clinical History */}
            <section>
                <h2 className="text-lg font-bold border-b border-gray-300 mb-4 pb-1 flex items-center gap-2">
                    <span className="text-lg material-symbols-outlined">history</span>
                    Histórico Clínico
                </h2>
                {appointments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic px-2">Nenhum registro de atendimento anterior.</p>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((apt) => (
                            <div key={apt.id} className="break-inside-avoid border border-gray-200 rounded p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{apt.reason || 'Consulta'}</h3>
                                        <p className="text-xs text-gray-500">
                                            {new Date(apt.date).toLocaleString('pt-BR')} • {apt.doctorName || 'Profissional'}
                                        </p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded border border-gray-200 font-medium">
                                        {apt.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 whitespace-pre-wrap">{apt.notes || 'Sem observações.'}</p>

                                {/* Prescription Items in History */}
                                {apt.prescriptionItems && apt.prescriptionItems.length > 0 && (
                                    <div className="mt-3 bg-gray-50 p-3 rounded border border-gray-200 break-inside-avoid">
                                        <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">prescriptions</span>
                                            Medicamentos Prescritos
                                        </p>
                                        <ul className="space-y-1">
                                            {apt.prescriptionItems.map((item, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex justify-between border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                                    <span>
                                                        <span className="font-semibold">{item.name}</span>
                                                        <span className="text-xs text-gray-500 ml-1">({item.type})</span>
                                                    </span>
                                                    <span className="text-xs font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                                                        {item.dosage} • {item.frequency}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
                <p>Este documento contém informações confidenciais de saúde.</p>
                <p>Sistema de Saúde Indígena - Bahsé Ahposé</p>
            </div>
        </div>,
        document.body
    );
};

export default PatientSummaryDocument;
