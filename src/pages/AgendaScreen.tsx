import React, { useState, useEffect } from 'react';
import { Screen, Appointment } from '../types';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';

interface AgendaScreenProps {
    onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
}

const AgendaScreen: React.FC<AgendaScreenProps> = ({ onNavigate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get day of week for first day
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const fetchAppointments = async () => {
        setLoading(true);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startDate = new Date(year, month, 1).toISOString();
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();

        try {
            const res = await fetch(`http://localhost:3001/api/appointments?startDate=${startDate}&endDate=${endDate}`);
            const data = await res.json();
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [currentDate]);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();

        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-background-light/30 border border-border-light/50"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = new Date(year, month, day).toLocaleDateString('pt-BR'); // Format dependent on localized DB date could be tricky, using simple comparison
            // DB sends ISO, we can compare parts
            const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getDate() === day && aptDate.getMonth() === month && aptDate.getFullYear() === year;
            });

            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

            days.push(
                <div key={day} className={`h-32 border border-border-light p-2 overflow-y-auto ${isToday ? 'bg-primary/5' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-text-main'}`}>{day}</span>
                        {dayAppointments.length > 0 && <span className="text-[10px] bg-gray-100 text-text-muted px-1.5 py-0.5 rounded">{dayAppointments.length}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        {dayAppointments.map(apt => (
                            <button
                                key={apt.id}
                                onClick={() => setSelectedAppointmentId(apt.id)}
                                className={`text-left text-[10px] p-1.5 rounded border border-l-4 truncate transition-all hover:scale-[1.02] ${apt.status === 'Concluida' ? 'bg-green-50 border-green-200 border-l-green-500 text-green-800' :
                                    apt.status === 'Cancelada' ? 'bg-red-50 border-red-200 border-l-red-500 text-red-800' :
                                        'bg-blue-50 border-blue-200 border-l-blue-500 text-blue-800'
                                    }`}
                                title={`${apt.patientName} - ${apt.reason}`}
                            >
                                <div className="font-bold truncate">{apt.patientName}</div>
                                <div className="truncate opacity-80">{new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {apt.reason}</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main">Agenda</h1>
                    <p className="text-text-muted">Acompanhe os atendimentos e consultas.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-border-light">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-background-light rounded-lg text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="text-lg font-bold text-text-main w-40 text-center select-none">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-background-light rounded-lg text-text-muted hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden flex-1 flex flex-col">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 border-b border-border-light bg-background-light">
                    {weekDays.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {loading ? (
                        <div className="col-span-7 flex items-center justify-center p-20">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        </div>
                    ) : renderCalendar()}
                </div>
            </div>

            {selectedAppointmentId && (
                <AppointmentDetailsModal
                    appointmentId={selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                    onNavigate={onNavigate}
                />
            )}
        </div>
    );
};

export default AgendaScreen;
