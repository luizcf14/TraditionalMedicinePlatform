import React, { useState } from 'react';
import { apiFetch } from '../services/api';

interface GrowthMeasurementModalProps {
    patientId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const GrowthMeasurementModal: React.FC<GrowthMeasurementModalProps> = ({ patientId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        headCircumference: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch(`/api/patients/${patientId}/growth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                onSuccess();
                onClose();
            } else {
                alert('Erro ao salvar medição: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp">
                <div className="flex items-center justify-between p-4 border-b border-border-light">
                    <h3 className="font-bold text-lg text-text-main">Nova Medição</h3>
                    <button onClick={onClose} className="text-text-muted hover:text-text-main">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">Data</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border-border-light p-2.5 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Peso (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full rounded-lg border-border-light p-2.5 focus:ring-primary focus:border-primary"
                                placeholder="Ex: 25.4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Altura (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full rounded-lg border-border-light p-2.5 focus:ring-primary focus:border-primary"
                                placeholder="Ex: 120"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1">Perímetro Craniano (cm)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="headCircumference"
                            value={formData.headCircumference}
                            onChange={handleChange}
                            className="w-full rounded-lg border-border-light p-2.5 focus:ring-primary focus:border-primary"
                            placeholder="Ex: 50.5"
                        />
                        <p className="text-xs text-text-muted mt-1">Recomendado para crianças até 3 anos.</p>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-border-light rounded-lg text-text-main hover:bg-background-light font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium disabled:opacity-70"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GrowthMeasurementModal;
