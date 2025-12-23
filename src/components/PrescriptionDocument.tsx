import React from 'react';
import { createPortal } from 'react-dom';
import { Patient, Treatment, Plant, PrescriptionItem } from '../types';

interface PrescriptionDocumentProps {
    patient: Patient | null;
    items: any[];
    diagnosis: string;
    notes: string;
    history: any[];
}

const PrescriptionDocument: React.FC<PrescriptionDocumentProps> = ({ patient, items, diagnosis, notes, history }) => {
    if (!patient) return null;

    return createPortal(
        <div id="printable-section" className="hidden print:block text-black font-sans">
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="border-b-2 border-primary pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Prescrição Médica / Recomendação Tradicional</h1>
                        <p className="text-sm text-gray-500">Unidade de Saúde: <b>Sistema de Medicina Tradicional</b></p>
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

                {/* Diagnosis (Printable) */}
                {diagnosis && (
                    <div className="mb-4">
                        <h2 className="text-lg font-bold mb-2 uppercase tracking-wide border-l-4 border-red-500 pl-2">Queixa / Diagnóstico</h2>
                        <div className="bg-red-50 p-3 rounded text-sm text-gray-800 border border-red-100 italic">
                            {diagnosis}
                        </div>
                    </div>
                )}

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
                            {history.map((apt: any) => (
                                <div key={apt.id} className="text-xs text-gray-600">
                                    <p className="font-semibold">{new Date(apt.date).toLocaleDateString()} - {apt.reason}</p>
                                    {apt.notes && <p className="italic pl-2 border-l-2 border-gray-200 mt-1">"{apt.notes}"</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4">
                    <p>Documento gerado eletronicamente.</p>
                </div>
            </div>

            {/* Detailed Treatment Guide (New Page) */}
            {items.some(i => i.treatmentDetails || i.plantDetails) && (
                <div className="page-break font-sans pt-8 text-black">
                    <div className="border-b-2 border-primary pb-4 mb-6">
                        <h1 className="text-2xl font-bold text-primary">Guia de Preparo e Uso</h1>
                        <p className="text-sm text-gray-500">Instruções detalhadas para os tratamentos prescritos.</p>
                    </div>

                    {items.filter(i => i.treatmentDetails || i.plantDetails).map((item, idx) => {
                        const treatment = item.treatmentDetails;
                        const plant = item.plantDetails;

                        return (
                            <div key={idx} className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                                <h2 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h2>
                                {plant && <p className="text-sm text-primary italic mb-4">{plant.scientificName}</p>}
                                {treatment && <p className="text-sm text-primary italic mb-4">Origem: {treatment.origin}</p>}

                                <div className="space-y-4">
                                    {/* Ingredients */}
                                    {treatment && treatment.ingredients && treatment.ingredients.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Ingredientes</h3>
                                            <ul className="list-disc pl-5 text-sm text-slate-800">
                                                {treatment.ingredients.map((ing: any, i: number) => (
                                                    <li key={i}><span className="font-semibold">{ing.quantity}</span> de {ing.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Preparation */}
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Modo de Preparo</h3>
                                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                                            {treatment?.preparationMethod || plant?.preparation || 'Seguir orientações médicas.'}
                                        </p>
                                    </div>

                                    {/* Dosage */}
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">Como Usar</h3>
                                        <p className="text-sm text-slate-800">
                                            <span className="font-semibold">Posologia:</span> {item.dosage} <br />
                                            <span className="font-semibold">Frequência:</span> {item.frequency} <br />
                                            <span className="font-semibold">Duração:</span> {item.duration}
                                        </p>
                                    </div>

                                    {/* Warnings */}
                                    {(treatment?.sideEffects || plant?.contraindications) && (
                                        <div className="mt-4 bg-red-50 p-3 rounded border border-red-100">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1">Cuidados e Contraindicações</h3>
                                            <p className="text-sm text-red-800">
                                                {treatment?.sideEffects}
                                                {treatment?.sideEffects && plant?.contraindications && '. '}
                                                {plant?.contraindications}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>,
        document.body
    );
};

export default PrescriptionDocument;
