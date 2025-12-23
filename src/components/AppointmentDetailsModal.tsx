import React, { useEffect, useState } from 'react';
import { Appointment, Screen } from '../types';

interface AppointmentDetails {
    appointment: Appointment;
    prescription: {
        notes: string;
        diagnosis?: string;
    } | null;
    items: {
        id: string;
        type: 'Alopático' | 'Tradicional';
        name: string;
        dosage: string;
        frequency: string;
    }[];
}

const AppointmentDetailsModal: React.FC<{
    appointmentId: string;
    onClose: () => void;
    onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
}> = ({ appointmentId, onClose, onNavigate }) => {
    const [details, setDetails] = useState<AppointmentDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/api/appointments/${appointmentId}/details`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setDetails(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [appointmentId]);

    if (!details && !loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border-light flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-text-main">
                            {loading ? 'Carregando...' : details?.appointment.reason}
                        </h3>
                        {!loading && (
                            <p className="text-sm text-text-muted">
                                {new Date(details!.appointment.date).toLocaleString('pt-BR')} • {details!.appointment.doctorName}
                            </p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-text-muted">close</span>
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                    </div>
                ) : (
                    <div className="p-6 flex flex-col gap-6">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text-muted">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${details!.appointment.status === 'Concluida' ? 'bg-green-100 text-green-700' :
                                details!.appointment.status === 'Cancelada' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {details!.appointment.status}
                            </span>
                        </div>

                        {/* Diagnosis */}
                        {details!.prescription?.diagnosis && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <h4 className="font-bold text-sm text-red-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">person_alert</span>
                                    Queixa / Diagnóstico
                                </h4>
                                <p className="text-sm text-text-main whitespace-pre-wrap leading-relaxed">
                                    {details!.prescription.diagnosis}
                                </p>
                            </div>
                        )}

                        {/* Notes */}
                        {details!.prescription && (
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                                <h4 className="font-bold text-sm text-orange-800 mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">local_florist</span>
                                    Orientações / Bahsé
                                </h4>
                                <p className="text-sm text-text-main whitespace-pre-wrap leading-relaxed">
                                    {details!.prescription.notes || 'Nenhuma observação registrada.'}
                                </p>
                            </div>
                        )}

                        {/* Items */}
                        <div>
                            <h4 className="font-bold text-sm text-text-main mb-3 uppercase tracking-wide">Itens Prescritos</h4>
                            {details!.items.length === 0 ? (
                                <p className="text-sm text-text-muted italic">Nenhum item prescrito.</p>
                            ) : (
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-border-light">
                                            <th className="py-2 font-medium text-text-muted">Tipo</th>
                                            <th className="py-2 font-medium text-text-muted">Nome</th>
                                            <th className="py-2 font-medium text-text-muted">Detalhes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-light">
                                        {details!.items.map(item => (
                                            <tr key={item.id}>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${item.type === 'Tradicional' ? 'bg-primary/10 text-primary-dark' : 'bg-blue-50 text-blue-700'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 font-medium">{item.name}</td>
                                                <td className="py-3 text-text-muted">
                                                    {item.dosage} • {item.frequency}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                <div className="p-4 border-t border-border-light bg-gray-50 flex justify-between">
                    <div className="flex gap-2">
                        {details?.appointment.status === 'Agendada' && (
                            <>
                                {new Date().toDateString() === new Date(details!.appointment.date).toDateString() && (
                                    <button
                                        onClick={() => {
                                            onNavigate(Screen.NEW_PRESCRIPTION, details!.appointment.patientId, appointmentId);
                                            onClose();
                                        }}
                                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">medical_services</span>
                                        Atender
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (confirm('Tem certeza que deseja antecipar esta consulta para agora?')) {
                                            fetch(`http://localhost:3001/api/appointments/${appointmentId}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ date: new Date().toISOString() })
                                            })
                                                .then(res => res.json())
                                                .then(data => {
                                                    if (data.success) {
                                                        onClose();
                                                        window.location.reload(); // Simple refresh to show updates
                                                    }
                                                });
                                        }
                                    }}
                                    className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    Antecipar para agora
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
                                            fetch(`http://localhost:3001/api/appointments/${appointmentId}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ status: 'Cancelada' })
                                            })
                                                .then(res => res.json())
                                                .then(data => {
                                                    if (data.success) {
                                                        onClose();
                                                        window.location.reload(); // Simple refresh to show updates
                                                    }
                                                });
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">cancel</span>
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-border-light rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;
