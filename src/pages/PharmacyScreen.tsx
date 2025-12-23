import React, { useState, useEffect } from 'react';
import { Screen, Plant, Treatment } from '../types';
import { apiFetch } from '../services/api';

interface PharmacyScreenProps {
    onNavigate: (screen: Screen, patientId?: string) => void;
    patientId?: string | null;
    appointmentId?: string | null;
}

import PharmacyEntryModal from '../components/PharmacyEntryModal';

const PharmacyScreen: React.FC<PharmacyScreenProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'plants' | 'treatments'>('plants');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');

    const [plants, setPlants] = useState<Plant[]>([]);
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'plant' | 'treatment'>('plant');

    // Unified selection state
    const [selectedItem, setSelectedItem] = useState<Plant | Treatment | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [plantsRes, treatmentsRes] = await Promise.all([
                apiFetch('/api/pharmacy/plants'),
                apiFetch('/api/pharmacy/treatments')
            ]);

            const plantsData = await plantsRes.json();
            const treatmentsData = await treatmentsRes.json();

            if (plantsData.success) {
                setPlants(plantsData.plants);
                // Select first item if nothing selected or list was empty
                if (activeTab === 'plants' && (!selectedItem || !plantsData.plants.find((p: any) => p.id === selectedItem.id))) {
                    if (plantsData.plants.length > 0) setSelectedItem(plantsData.plants[0]);
                }
            }

            if (treatmentsData.success) {
                setTreatments(treatmentsData.treatments);
                // Keep selected treatment logic similar if needed, or just let it refresh
                if (activeTab === 'treatments' && selectedItem && !treatmentsData.treatments.find((t: any) => t.id === selectedItem.id)) {
                    if (treatmentsData.treatments.length > 0) setSelectedItem(treatmentsData.treatments[0]);
                }
            }

        } catch (error) {
            console.error("Failed to fetch pharmacy data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setIsEditing(false);
        setModalType(activeTab === 'plants' ? 'plant' : 'treatment');
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        if (!selectedItem) return;
        setIsEditing(true);
        setModalType(activeTab === 'plants' ? 'plant' : 'treatment');
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        const isPlant = activeTab === 'plants';
        const typeName = isPlant ? 'esta planta' : 'este tratamento';

        if (!window.confirm(`Tem certeza que deseja excluir ${typeName}?`)) {
            return;
        }

        try {
            const endpoint = isPlant
                ? `/api/pharmacy/plants/${selectedItem.id}`
                : `/api/pharmacy/treatments/${selectedItem.id}`;

            const res = await apiFetch(endpoint, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                setSelectedItem(null); // Clear selection
                fetchData(); // Refresh list
            } else {
                alert('Erro ao excluir.');
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            alert('Erro de conexão.');
        }
    };

    const handleSave = () => {
        fetchData(); // Refresh list
    };

    // Filter logic
    const categoryMap: Record<string, string> = {
        'Todas': 'Todas',
        'Digestivas': 'Digestiva',
        'Respiratórias': 'Respiratória',
        'Cicatrizantes': 'Cicatrizante',
        'Calmantes': 'Calmante',
        'Anti-inflamatórias': 'Anti-inflamatório'
    };

    const filteredPlants = plants.filter(p =>
        (selectedCategory === 'Todas' || p.mainUse?.includes(categoryMap[selectedCategory] || selectedCategory)) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTreatments = treatments.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const listItems = activeTab === 'plants' ? filteredPlants : filteredTreatments;

    // Helper to color codes (simplified for dynamic data)
    const getColorClass = (use: string) => {
        // Just a simple hash-like mapping or random for demo if strictly needed,
        // but let's stick to a generic one or check known types
        return 'bg-primary/10 text-primary';
    };

    const getTagColor = (use: string) => {
        if (!use) return 'bg-gray-100 text-gray-800';
        if (use.includes('Anti-inflamatório')) return 'bg-red-100 text-red-800';
        if (use.includes('Expectorante')) return 'bg-green-100 text-green-800';
        if (use.includes('Cicatrizante')) return 'bg-amber-100 text-amber-800';
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] rounded-xl border border-border-light overflow-hidden bg-white shadow-sm relative">
            <PharmacyEntryModal
                isOpen={isModalOpen}
                type={modalType}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={isEditing ? selectedItem : undefined}
            />

            {/* Left List Section */}
            <section className="flex flex-col w-full lg:w-5/12 border-r border-border-light bg-white">
                <div className="p-6 pb-2 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Farmácia Viva</h1>
                            <p className="text-slate-500 text-sm mt-1">Acervo de plantas e tratamentos.</p>
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            <span className="hidden sm:inline">Novo</span>
                        </button>
                    </div>

                    <div className="bg-slate-100 p-1 rounded-xl flex font-medium text-sm">
                        <button
                            onClick={() => { setActiveTab('plants'); setSelectedItem(plants[0] || null); }}
                            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'plants' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <span className={`material-symbols-outlined text-[18px] ${activeTab === 'plants' ? 'text-primary' : ''}`}>spa</span>
                            Plantas
                        </button>
                        <button
                            onClick={() => { setActiveTab('treatments'); setSelectedItem(treatments[0] || null); }}
                            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'treatments' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            <span className={`material-symbols-outlined text-[18px] ${activeTab === 'treatments' ? 'text-primary' : ''}`}>healing</span>
                            Tratamentos
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-border-light rounded-xl leading-5 bg-background-light text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                                placeholder={`Buscar ${activeTab === 'plants' ? 'plantas' : 'tratamentos'}...`}
                                type="text"
                            />
                        </div>
                        {activeTab === 'plants' && (
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                {['Todas', 'Digestivas', 'Respiratórias', 'Cicatrizantes', 'Calmantes', 'Anti-inflamatórias'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <div className="rounded-xl border border-border-light bg-white overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-500">Carregando...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-border-light sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nome</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">{activeTab === 'plants' ? 'Científico' : 'Origem'}</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Uso</th>
                                        <th className="w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light">
                                    {listItems.map((item: any) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => setSelectedItem(item)}
                                            className={`cursor-pointer transition-colors border-l-4 ${selectedItem?.id === item.id ? 'bg-primary/5 border-l-primary' : 'hover:bg-slate-50 border-l-transparent'}`}
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${getColorClass(item.mainUse)}`}>
                                                        <span className="material-symbols-outlined">{activeTab === 'plants' ? 'spa' : 'healing'}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                                        <p className="text-xs text-slate-500 italic">{item.indigenousName || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden sm:table-cell">
                                                <span className="text-sm text-slate-700">{activeTab === 'plants' ? item.scientificName : item.origin}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {item.mainUse && (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(item.mainUse)}`}>
                                                        {item.mainUse}
                                                    </span>
                                                )}
                                                {item.indications && !item.mainUse && (
                                                    <span className="text-xs text-slate-500 truncate max-w-[100px] block" title={item.indications}>
                                                        {item.indications}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="material-symbols-outlined text-state-400 text-[20px]">chevron_right</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {listItems.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                                                Nenhum item encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>

            {/* Right Details Section */}
            <section className="hidden lg:flex flex-col w-7/12 bg-background-light overflow-y-auto">
                <div className="sticky top-0 z-20 bg-background-light/95 backdrop-blur px-8 py-4 border-b border-border-light flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500">
                        <button onClick={handleEdit} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><span className="material-symbols-outlined">edit</span></button>
                        <button className="p-2 hover:bg-slate-200 rounded-full transition-colors"><span className="material-symbols-outlined">share</span></button>
                        <button onClick={handleDelete} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                    <div className="text-xs font-medium text-slate-400">Atualizado recentemente</div>
                </div>

                <div className="px-8 py-8 space-y-8">
                    {selectedItem ? (
                        activeTab === 'plants' ? (
                            // PLANT DETAILS
                            <>
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-900">{(selectedItem as Plant).name}</h2>
                                                <p className="text-lg text-primary font-medium mt-1">{(selectedItem as Plant).scientificName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Nome Indígena</p>
                                                <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">{(selectedItem as Plant).indigenousName || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 flex-wrap">
                                            {(selectedItem as Plant).mainUse && (
                                                <span className="px-3 py-1 bg-white border border-border-light rounded-md text-xs font-medium text-slate-600 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px] text-blue-500">healing</span> {(selectedItem as Plant).mainUse}
                                                </span>
                                            )}
                                            {/* Parse usageParts if string or render if array */}
                                            {/* Simulating parts for now or parsing if complex JSON handling needed */}
                                            <span className="px-3 py-1 bg-white border border-border-light rounded-md text-xs font-medium text-slate-600 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[16px] text-primary">eco</span> Partes: {Array.isArray((selectedItem as Plant).usageParts) ? (selectedItem as Plant).usageParts.join(', ') : 'Diversas'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <section className="bg-white p-5 rounded-xl border border-border-light shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">medication_liquid</span>
                                        Uso Tradicional & Preparo
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{(selectedItem as Plant).description}</p>
                                    <div className="space-y-3">
                                        <div className="flex gap-3 items-start p-3 bg-background-light rounded-lg">
                                            <span className="material-symbols-outlined text-slate-400 mt-0.5">filter_vintage</span>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700 uppercase">Preparo</p>
                                                <p className="text-sm text-slate-600">{(selectedItem as Plant).preparation || 'Não especificado.'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 items-start p-3 bg-background-light rounded-lg">
                                            <span className="material-symbols-outlined text-slate-400 mt-0.5">timer</span>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700 uppercase">Posologia</p>
                                                <p className="text-sm text-slate-600">{(selectedItem as Plant).dosage || 'Consulte o pajé/médico.'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-800">Contraindicações</h4>
                                            <p className="text-sm text-red-700 mt-1">{(selectedItem as Plant).contraindications || 'Nenhuma contraindicação registrada.'}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white p-5 rounded-xl border border-border-light shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">potted_plant</span>
                                        Cultivo e Colheita
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-border-light flex flex-col items-center text-center gap-2">
                                            <div className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><span className="material-symbols-outlined">wb_sunny</span></div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase">Clima</span>
                                            <span className="text-sm font-medium text-slate-800">{(selectedItem as Plant).cultivation?.climate || '-'}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-border-light flex flex-col items-center text-center gap-2">
                                            <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined">water_drop</span></div>
                                            <span className="text-xs font-semibold text-slate-500 uppercase">Água</span>
                                            <span className="text-sm font-medium text-slate-800">{(selectedItem as Plant).cultivation?.water || '-'}</span>
                                        </div>
                                    </div>
                                </section>
                            </>
                        ) : (
                            // TREATMENT DETAILS
                            <>
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h2 className="text-3xl font-bold text-slate-900">{(selectedItem as Treatment).name}</h2>
                                                <p className="text-lg text-primary font-medium mt-1">Origem: {(selectedItem as Treatment).origin}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                                {(selectedItem as Treatment).indications}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <section className="bg-white p-5 rounded-xl border border-border-light shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">grocery</span>
                                        Ingredientes
                                    </h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        {(selectedItem as Treatment).ingredients?.map((ing: any, idx: number) => (
                                            <li key={idx} className="text-sm text-slate-700">
                                                <span className="font-semibold">{ing.name}</span>: {ing.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="bg-white p-5 rounded-xl border border-border-light shadow-sm">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">blender</span>
                                        Modo de Preparo
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{(selectedItem as Treatment).preparationMethod}</p>
                                </section>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 uppercase mb-1">Frequência</p>
                                        <p className="text-sm text-slate-800">{(selectedItem as Treatment).frequency}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-700 uppercase mb-1">Duração</p>
                                        <p className="text-sm text-slate-800">{(selectedItem as Treatment).duration}</p>
                                    </div>
                                </div>
                            </>
                        )
                    ) : (
                        <div className="flex items-center justify-center h-64 text-text-muted italic">
                            {isLoading ? 'Carregando...' : 'Selecione um item para ver os detalhes completos.'}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PharmacyScreen;
