import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { apiFetch } from '../services/api';

interface RegistrationScreenProps {
  onNavigate: (screen: Screen, patientId?: string) => void;
  patientId?: string | null;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onNavigate, patientId }) => {
  const [formData, setFormData] = useState({
    name: '',
    socialName: '',
    dob: '',
    sex: '',
    genderIdentity: '',
    indigenousName: '',
    ethnicity: '',
    village: '',
    language: '',
    dsei: 'Alto Rio Negro',
    cns: '',
    cpf: '',
    motherName: '',
    bloodType: '',
    allergies: '',
    conditions: '',
    image: '',
    status: '',
    statusOverride: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Webcam State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (patientId) {
      setFetching(true);
      apiFetch(`/api/patients/${patientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.patient) {
            const p = data.patient;
            setFormData(prev => ({
              ...prev,
              name: p.name || '',
              dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : '',
              village: p.village || '',
              ethnicity: p.ethnicity || '',
              cns: p.cns || '',
              cpf: p.cpf || '',
              motherName: p.motherName || '',
              indigenousName: p.indigenousName || '',
              bloodType: p.bloodType || '',
              allergies: p.allergies || '',
              conditions: p.conditions || '',
              image: p.image || '',
              status: p.status || ''
            }));
          }
        })
        .finally(() => setFetching(false));
    }
  }, [patientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit check (backend allows 50MB but good to be sane)
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Convert to Base64
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, image: dataUrl }));
        stopCamera();
      }
    }
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const body = {
        name: formData.name,
        dob: formData.dob || null,
        village: formData.village,
        ethnicity: formData.ethnicity,
        cns: formData.cns,
        cpf: formData.cpf,
        motherName: formData.motherName || 'Não Informado',
        indigenousName: formData.indigenousName,
        bloodType: formData.bloodType,
        allergies: formData.allergies,
        conditions: formData.conditions,
        image: formData.image,
        statusOverride: (formData as any).statusOverride
      };

      const url = patientId
        ? `/api/patients/${patientId}`
        : '/api/patients';

      const method = patientId ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        alert(patientId ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!');
        onNavigate(Screen.PATIENT_RECORD, patientId || data.patientId);
      } else {
        alert('Erro ao salvar: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm text-text-muted">
            <button onClick={() => onNavigate(Screen.PATIENT_LIST)} className="hover:underline">Pacientes</button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span>{patientId ? 'Editar Prontuário' : 'Novo Cadastro'}</span>
          </div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">{patientId ? 'Editar Paciente' : 'Cadastro de Paciente'}</h1>
          <p className="text-text-muted mt-1">
            {patientId ? 'Atualize os dados abaixo.' : 'Preencha os dados abaixo para iniciar um novo prontuário no sistema.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {patientId && (
            <button
              onClick={async () => {
                if (window.confirm("ATENÇÃO: Isso excluirá permanentemente o paciente e todos os seus registros de consultas e prescrições. Essa ação não pode ser desfeita.\n\nDeseja continuar?")) {
                  setLoading(true);
                  try {
                    const res = await apiFetch(`/api/patients/${patientId}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (data.success) {
                      alert('Paciente excluído.');
                      onNavigate(Screen.PATIENT_LIST);
                    } else {
                      alert('Erro: ' + data.message);
                    }
                  } catch (err) {
                    alert('Erro de conexão.');
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 font-medium text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Excluir
            </button>
          )}

          <button
            onClick={() => onNavigate(Screen.PATIENT_LIST)}
            className="px-4 py-2 rounded-lg border border-border-light text-text-main bg-white font-medium text-sm hover:bg-background-light transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium text-sm shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            {loading ? 'Salvando...' : 'Salvar Prontuário'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Photo & Basic Info */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center gap-3">
              {isCameraOpen ? (
                <div className="relative w-64 h-64 bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-4 flex gap-3">
                    <button
                      onClick={takePhoto}
                      type="button"
                      className="bg-white text-primary p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
                      title="Tirar Foto"
                    >
                      <span className="material-symbols-outlined">camera_alt</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      type="button"
                      className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
                      title="Cancelar"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="w-32 h-32 rounded-full border-4 border-background-light bg-gray-100 flex items-center justify-center overflow-hidden relative group"
                    style={{
                      backgroundImage: formData.image ? `url(${formData.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!formData.image && (
                      <span className="material-symbols-outlined text-4xl text-gray-400">add_a_photo</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      title="Carregar arquivo"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="text-xs flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      Usar Câmera
                    </button>
                    <span className="text-gray-300">|</span>
                    <p className="text-xs text-text-muted">Ou clique na foto para upload</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4 border-b border-border-light pb-2">
                <span className="material-symbols-outlined text-primary">person</span>
                <h3 className="text-lg font-bold text-text-main">Identificação Civil</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-2">Nome Civil Completo *</label>
                  <input
                    name="name" value={formData.name} onChange={handleChange}
                    className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3"
                    placeholder="Como consta no documento oficial" type="text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-main mb-2">Nome Social (Opcional)</label>
                  <input
                    name="socialName" value={formData.socialName} onChange={handleChange}
                    className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3"
                    placeholder="Nome pelo qual prefere ser chamado" type="text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Data de Nascimento</label>
                  <input
                    name="dob" value={formData.dob} onChange={handleChange}
                    className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3"
                    type="date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">Sexo Biológico</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Cultural Context */}
          <section className="bg-white rounded-xl border border-border-light p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-6 border-b border-border-light pb-4 relative z-10">
              <span className="material-symbols-outlined text-primary">groups</span>
              <h3 className="text-lg font-bold text-text-main">Identidade & Contexto Cultural</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-main mb-2">Nome Indígena (Língua Materna)</label>
                <input
                  name="indigenousName" value={formData.indigenousName} onChange={handleChange}
                  className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3"
                  placeholder="Nome original na língua do povo" type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Povo / Etnia</label>
                <input
                  name="ethnicity" value={formData.ethnicity} onChange={handleChange}
                  className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3"
                  placeholder="Ex: Tukano" type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Aldeia / Comunidade *</label>
                <input
                  name="village" value={formData.village} onChange={handleChange}
                  className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3"
                  placeholder="Ex: São Gabriel da Cachoeira" type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-2">Distrito Sanitário Especial (DSEI)</label>
                <select name="dsei" value={formData.dsei} onChange={handleChange} className="w-full rounded-lg border-border-light bg-background-light text-text-main focus:ring-primary focus:border-primary p-3">
                  <option value="Alto Rio Negro">Alto Rio Negro</option>
                  <option value="Yanomami">Yanomami</option>
                  <option value="Médio Rio Purus">Médio Rio Purus</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Documents Quick Entry */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-text-main">Documentos Essenciais</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Cartão Nacional de Saúde (CNS)</label>
                <input
                  name="cns" value={formData.cns} onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  placeholder="000 0000 0000 0000" type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">CPF</label>
                <input
                  name="cpf" value={formData.cpf} onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  placeholder="000.000.000-00" type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Nome da Mãe</label>
                <input
                  name="motherName" value={formData.motherName} onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  placeholder="Nome da mãe" type="text"
                />
              </div>
            </div>
          </div>

          {/* Health Info */}
          <div className="bg-white rounded-xl border border-border-light p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-text-main">Dados de Saúde</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Tipo Sanguíneo</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">Selecione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Alergias</label>
                <textarea
                  name="allergies" value={formData.allergies} onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  placeholder="Liste as alergias conhecidas..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Condições Crônicas</label>
                <textarea
                  name="conditions" value={formData.conditions} onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  placeholder="Ex: Hipertensão, Diabetes..."
                  rows={3}
                />
              </div>

              {patientId && (
                <div className="pt-4 border-t border-border-light mt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Status do Paciente</label>
                  <p className="text-xs text-text-muted mb-2">Use com cautela para registrar óbito ou arquivamento.</p>
                  <select
                    name="statusOverride"
                    value={(formData as any).statusOverride || ''}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  >
                    <option value="">Manter Atual ({formData.status || 'Automático'})</option>
                    <option value="Óbito">Óbito (Falecimento)</option>
                    <option value="Arquivo Morto">Arquivo Morto (Inativo)</option>
                    <option value="Ativo">Ativo</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Condições Crônicas</label>
                <textarea
                  name="conditions" value={formData.conditions} onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-lg border border-border-light bg-white text-sm focus:ring-primary focus:border-primary"
                  placeholder="Ex: Hipertensão, Diabetes..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default RegistrationScreen;
