
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

interface PharmacyEntryModalProps {
    type: 'plant' | 'treatment';
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    initialData?: any;
}

interface Ingredient {
    name: string;
    quantity: string;
    plantId?: string;
}

const PharmacyEntryModal: React.FC<PharmacyEntryModalProps> = ({ type, isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);

    // Ingredients State
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [newIngredient, setNewIngredient] = useState<Ingredient>({ name: '', quantity: '' });
    const [availablePlants, setAvailablePlants] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData(initialData);
                if (type === 'treatment' && initialData.ingredients) {
                    setIngredients(initialData.ingredients);
                }
            } else {
                setFormData({});
                setIngredients([]);
            }
        }
    }, [isOpen, initialData, type]);

    useEffect(() => {
        if (isOpen && type === 'treatment') {
            // Fetch plants for the ingredient selector
            apiFetch('/api/pharmacy/plants')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setAvailablePlants(data.plants);
                })
                .catch(err => console.error("Failed to load plants for ingredients", err));
        }
    }, [isOpen, type]);

    if (!isOpen) return null;

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleAddIngredient = () => {
        if (!newIngredient.name || !newIngredient.quantity) return;
        setIngredients([...ingredients, newIngredient]);
        setNewIngredient({ name: '', quantity: '' }); // Reset
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientPlantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const plantId = e.target.value;
        const selected = availablePlants.find(p => p.id === plantId);

        if (selected) {
            setNewIngredient({ ...newIngredient, name: selected.name, plantId: selected.id });
        } else {
            setNewIngredient({ ...newIngredient, name: '', plantId: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const isEdit = !!initialData?.id;
        let endpoint = type === 'plant'
            ? `/api/pharmacy/plants`
            : `/api/pharmacy/treatments`;

        if (isEdit) {
            endpoint += `/${initialData.id}`;
        }

        const payload = { ...formData };
        if (type === 'treatment') {
            payload.ingredients = ingredients;
        }

        try {
            const response = await apiFetch(endpoint, {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSave();
                onClose();
            } else {
                alert('Erro ao salvar.');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Erro de conexão.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border-light flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">
                        {initialData ? (type === 'plant' ? 'Editar Planta' : 'Editar Tratamento') : (type === 'plant' ? 'Nova Planta' : 'Novo Tratamento')}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Principal *</label>
                            <input
                                required
                                value={formData.name || ''}
                                className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder={type === 'plant' ? "Ex: Capim-santo" : "Ex: Chá de Casca"}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                        </div>

                        {type === 'plant' ? (
                            // PLANT FORM
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Científico</label>
                                        <input
                                            value={formData.scientificName || ''}
                                            className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            onChange={e => handleChange('scientificName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nome Indígena</label>
                                        <input
                                            value={formData.indigenousName || ''}
                                            className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            onChange={e => handleChange('indigenousName', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Uso Principal (Categoria)</label>
                                    <select
                                        value={formData.mainUse || ''}
                                        className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        onChange={e => handleChange('mainUse', e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Digestiva">Digestiva</option>
                                        <option value="Respiratória">Respiratória</option>
                                        <option value="Cicatrizante">Cicatrizante</option>
                                        <option value="Calmante">Calmante</option>
                                        <option value="Anti-inflamatório">Anti-inflamatório</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Botânica</label>
                                    <textarea
                                        value={formData.description || ''}
                                        className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[80px]"
                                        onChange={e => handleChange('description', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Preparo / Infusão</label>
                                        <textarea
                                            value={formData.preparation || ''}
                                            className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            onChange={e => handleChange('preparation', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Posologia</label>
                                        <textarea
                                            value={formData.dosage || ''}
                                            className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            onChange={e => handleChange('dosage', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-red-600 mb-1">Contra Indicações</label>
                                    <input
                                        value={formData.contraindications || ''}
                                        className="w-full rounded-lg border border-red-100 bg-red-50 px-4 py-2 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                                        placeholder="Ex: Gestantes, Hipertensos"
                                        onChange={e => handleChange('contraindications', e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            // TREATMENT FORM
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Origem / Etnia</label>
                                    <input
                                        value={formData.origin || ''}
                                        className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Ex: Povo Tukano"
                                        onChange={e => handleChange('origin', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Indicações</label>
                                    <input
                                        value={formData.indications || ''}
                                        className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Ex: Febre, Dor de cabeça"
                                        onChange={e => handleChange('indications', e.target.value)}
                                    />
                                </div>

                                {/* Ingredients Section */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-border-light">
                                    <label className="block text-sm font-bold text-slate-800 mb-3">Ingredientes</label>

                                    <div className="flex gap-2 mb-3">
                                        <div className="flex-1">
                                            <select
                                                className="w-full rounded-lg border border-border-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                onChange={handleIngredientPlantChange}
                                                value={newIngredient.plantId || ''}
                                            >
                                                <option value="">-- Selecionar Planta (Opcional) --</option>
                                                {availablePlants.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                className="w-full rounded-lg border border-border-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Nome (ou use seleção)"
                                                value={newIngredient.name}
                                                onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                className="w-full rounded-lg border border-border-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                                placeholder="Qtd."
                                                value={newIngredient.quantity}
                                                onChange={e => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddIngredient}
                                            className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">add</span>
                                        </button>
                                    </div>

                                    {ingredients.length > 0 && (
                                        <ul className="space-y-2">
                                            {ingredients.map((ing, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-border-light">
                                                    <span className="text-sm text-slate-700">
                                                        <span className="font-semibold">{ing.name}</span> - {ing.quantity}
                                                    </span>
                                                    <button type="button" onClick={() => handleRemoveIngredient(idx)} className="text-red-500 hover:bg-red-50 rounded p-1">
                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Modo de Preparo</label>
                                    <textarea
                                        value={formData.preparationMethod || ''}
                                        className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
                                        onChange={e => handleChange('preparationMethod', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Frequência</label>
                                        <input
                                            value={formData.frequency || ''}
                                            className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Ex: 3x ao dia"
                                            onChange={e => handleChange('frequency', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Duração</label>
                                        <input
                                            value={formData.duration || ''}
                                            className="w-full rounded-lg border border-border-light px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Ex: 7 dias"
                                            onChange={e => handleChange('duration', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-1">Efeitos Colaterais</label>
                                    <input
                                        value={formData.sideEffects || ''}
                                        className="w-full rounded-lg border border-red-100 bg-red-50 px-4 py-2 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                                        placeholder="Ex: Sonolência"
                                        onChange={e => handleChange('sideEffects', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-red-600 mb-1">Contra Indicações</label>
                                    <input
                                        value={formData.contraindications || ''}
                                        className="w-full rounded-lg border border-red-100 bg-red-50 px-4 py-2 focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition-all"
                                        placeholder="Ex: Gestantes, Crianças menores de 2 anos"
                                        onChange={e => handleChange('contraindications', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border-light">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            {isLoading && <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>}
                            Salvar {type === 'plant' ? 'Planta' : 'Tratamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PharmacyEntryModal;
