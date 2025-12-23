
import React from 'react';

interface DailyReportDocumentProps {
    appointments: any[];
    date: Date;
    doctorName?: string;
}

const DailyReportDocument: React.FC<DailyReportDocumentProps> = ({ appointments, date, doctorName = 'Dr(a). Luiz' }) => {
    return (
        <div id="daily-report-section" className="hidden print:block font-sans text-black p-8">
            {/* Header */}
            <div className="border-b-2 border-primary pb-4 mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Relatório Diário de Atendimentos</h1>
                    <p className="text-sm text-gray-500">Unidade de Saúde: <b>Posto de Saúde Indígena Xingu</b></p>
                </div>
                <div className="text-right text-sm">
                    <p><b>Data:</b> {date.toLocaleDateString('pt-BR')}</p>
                    <p><b>Emitido por:</b> {doctorName}</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="flex gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded border border-gray-200 flex-1">
                    <p className="text-xs uppercase text-gray-500 font-bold">Total Agendados</p>
                    <p className="text-xl font-bold text-gray-800">{appointments.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-200 flex-1">
                    <p className="text-xs uppercase text-green-700 font-bold">Concluídos</p>
                    <p className="text-xl font-bold text-green-800">{appointments.filter(a => a.status === 'Concluida').length}</p>
                </div>
                <div className="bg-red-50 p-3 rounded border border-red-200 flex-1">
                    <p className="text-xs uppercase text-red-700 font-bold">Cancelados</p>
                    <p className="text-xl font-bold text-red-800">{appointments.filter(a => a.status === 'Cancelada').length}</p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="py-2 px-2 font-bold text-gray-700 w-20">Horário</th>
                        <th className="py-2 px-2 font-bold text-gray-700 w-1/4">Paciente</th>
                        <th className="py-2 px-2 font-bold text-gray-700 w-24">Status</th>
                        <th className="py-2 px-2 font-bold text-gray-700">Resumo / Diagnóstico</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {appointments.map(apt => (
                        <tr key={apt.id}>
                            <td className="py-3 px-2 align-top">
                                {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3 px-2 align-top">
                                <span className="font-semibold block">{apt.patientName}</span>
                                <span className="text-xs text-gray-500">{apt.reason}</span>
                            </td>
                            <td className="py-3 px-2 align-top">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${apt.status === 'Concluida' ? 'bg-green-100 text-green-800 border-green-200' :
                                        apt.status === 'Cancelada' ? 'bg-red-100 text-red-800 border-red-200' :
                                            'bg-blue-100 text-blue-800 border-blue-200'
                                    }`}>
                                    {apt.status}
                                </span>
                            </td>
                            <td className="py-3 px-2 align-top">
                                {apt.diagnosis ? (
                                    <>
                                        <p className="font-medium text-gray-800">{apt.diagnosis}</p>
                                        {apt.prescriptionNotes && (
                                            <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">{apt.prescriptionNotes}</p>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-gray-400 italic font-light">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    {appointments.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-500 italic">Nenhum atendimento registrado nesta data.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
                <p>Relatório gerado automaticamente pelo sistema em {new Date().toLocaleString('pt-BR')}</p>
            </div>
        </div>
    );
};

export default DailyReportDocument;
