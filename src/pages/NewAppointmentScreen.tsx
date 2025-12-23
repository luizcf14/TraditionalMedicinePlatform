import React, { useState } from 'react';
import { Screen, Patient } from '../types';

interface NewAppointmentScreenProps {
    onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
}



const NewAppointmentScreen: React.FC<NewAppointmentScreenProps> = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    // Use local date for default value to avoid late-night UTC shifts
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    });
    const [selectedTime, setSelectedTime] = useState('09:00');

    const handleSearch = async () => {
        setIsLoading(true);
        setHasSearched(true);
        try {
            const response = await fetch(`http://localhost:3001/api/patients?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            if (data.success) {
                setPatients(data.patients);
            }
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectPatient = async (patientId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientId,
                    date: `${selectedDate}T${selectedTime}:00`,
                    reason: 'Nova Consulta',
                    status: 'Agendada'
                }),
            });
            const data = await response.json();
            if (data.success) {
                const today = new Date().toISOString().split('T')[0];
                if (selectedDate > today) {
                    console.log('Future appointment created. Navigating to Agenda.');
                    onNavigate(Screen.AGENDA);
                } else {
                    console.log('Appointment created. Navigating to Prescription with:', patientId, data.appointmentId);
                    onNavigate(Screen.NEW_PRESCRIPTION, patientId, data.appointmentId);
                }
            }
        } catch (error) {
            console.error('Failed to create appointment', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Header / Back Link */}
            <div>
                <button
                    onClick={() => onNavigate(Screen.DASHBOARD)}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-4 text-sm font-medium"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Voltar ao Painel
                </button>
                <h2 className="text-text-main text-3xl font-bold leading-tight">Novo Atendimento</h2>
                <p className="text-text-muted text-base">Pesquise o paciente para vincular ao atendimento ou cadastre um novo perfil.</p>
            </div>

            {/* Date Selection */}
            <div className="bg-white p-6 rounded-xl border border-border-light shadow-sm">
                <label className="block text-text-main font-semibold mb-2">Data do Atendimento</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary"
                />
                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full md:w-1/4 px-4 py-2 rounded-lg border border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary ml-2"
                />
            </div>

            {/* Search Box */}
            <div className="bg-white p-8 rounded-xl border border-border-light shadow-sm flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <label className="text-text-main font-semibold">Buscar Paciente</label>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <span className="material-symbols-outlined absolute left-4 top-3.5 text-text-muted">search</span>
                            <input
                                type="text"
                                placeholder="Nome, CPF ou Cartão SUS"
                                className="w-full pl-12 pr-4 py-3 bg-background-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-70"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                </div>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-full h-[1px] bg-border-light"></div>
                    <span className="bg-white px-4 text-text-muted text-sm font-medium relative z-10">OU</span>
                </div>

                {/* New Patient Button */}
                <button
                    onClick={() => onNavigate(Screen.REGISTRATION)}
                    className="w-full border-2 border-dashed border-border-light hover:border-primary/50 hover:bg-primary/5 text-text-muted hover:text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Cadastrar Novo Paciente
                </button>
            </div>

            {/* Results Section */}
            {hasSearched && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                        <h3 className="text-text-main text-lg font-bold">Resultados da busca</h3>
                        <span className="text-sm text-text-muted bg-background-light px-2 py-1 rounded">{patients.length} encontrados</span>
                    </div>

                    {patients.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            Nenhum paciente encontrado. Tente outro termo ou cadastre um novo paciente.
                        </div>
                    ) : (
                        patients.map((patient) => (
                            <div key={patient.id} className="bg-white p-4 rounded-xl border border-border-light shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    {(!patient.image || patient.image === 'PLACEHOLDER_INITIALS') ? (
                                        <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                            {patient.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div
                                            className="size-12 rounded-full bg-gray-200 bg-center bg-cover"
                                            style={{ backgroundImage: `url("${patient.image}")` }}
                                        ></div>
                                    )}
                                    <div>
                                        <h4 className="text-text-main font-bold text-lg">{patient.name}</h4>
                                        <p className="text-text-muted text-sm flex items-center gap-2">
                                            <span>{patient.age} anos</span>
                                            <span className="size-1 bg-text-muted rounded-full"></span>
                                            <span>Mãe: {patient.motherName}</span>
                                            {patient.id && (
                                                <>
                                                    <span className="size-1 bg-text-muted rounded-full"></span>
                                                    <span>ID: {patient.id.substring(0, 8)}...</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSelectPatient(patient.id)}
                                    className="w-full md:w-auto border border-border-light text-text-main hover:border-primary hover:text-primary px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Selecionar
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NewAppointmentScreen;
