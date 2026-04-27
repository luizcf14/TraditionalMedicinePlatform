import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../services/api';

interface ExternalEventModalProps {
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ExternalEventModal: React.FC<ExternalEventModalProps> = ({ patientId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    externalCrm: '',
    reason: '',
    notes: '',
    attachmentUrl: ''
  });
  const [loading, setLoading] = useState(false);

  // Webcam State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachmentUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setFormData(prev => ({ ...prev, attachmentUrl: dataUrl }));
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleSave = async () => {
    if (!formData.date || !formData.externalCrm || !formData.reason) {
      alert("Data, CRM do Profissional e Motivo são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          date: formData.date,
          reason: formData.reason,
          notes: formData.notes,
          isExternal: true,
          externalCrm: formData.externalCrm,
          attachmentUrl: formData.attachmentUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        alert("Erro ao salvar: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-background-main w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-border-light flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined">domain</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">Registrar Evento Externo</h2>
              <p className="text-sm text-text-muted">Consulta ou exame fora da plataforma</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-light rounded-full transition-colors text-text-muted hover:text-text-main">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 bg-background-light">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Data do Evento *</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border-border-light bg-white text-text-main focus:ring-primary focus:border-primary p-3 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Nome do Profissional / CRM *</label>
            <input 
              type="text" 
              name="externalCrm"
              placeholder="Ex: Dr. João Silva - CRM 12345"
              value={formData.externalCrm}
              onChange={handleChange}
              className="w-full rounded-lg border-border-light bg-white text-text-main focus:ring-primary focus:border-primary p-3 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Motivo / Especialidade *</label>
            <input 
              type="text" 
              name="reason"
              placeholder="Ex: Consulta Cardiológica"
              value={formData.reason}
              onChange={handleChange}
              className="w-full rounded-lg border-border-light bg-white text-text-main focus:ring-primary focus:border-primary p-3 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Anotações / Laudos Livres</label>
            <textarea 
              name="notes"
              rows={4}
              placeholder="Descreva o que foi feito, exames solicitados, etc."
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-lg border-border-light bg-white text-text-main focus:ring-primary focus:border-primary p-3 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">Anexar Documento / Exame</label>
            {isCameraOpen ? (
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
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
            ) : formData.attachmentUrl ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-border-light group">
                <img src={formData.attachmentUrl} alt="Anexo" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, attachmentUrl: '' }))}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-600 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full h-24 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 flex flex-col items-center justify-center text-primary hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined mb-1">upload_file</span>
                    <span className="text-xs font-medium">Carregar Arquivo</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 h-24 border border-border-light rounded-lg bg-surface-light flex flex-col items-center justify-center text-text-muted hover:bg-gray-100 transition-colors"
                >
                  <span className="material-symbols-outlined mb-1">photo_camera</span>
                  <span className="text-xs font-medium">Usar Câmera</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-light bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border-light text-text-main font-medium hover:bg-surface-light transition-colors">
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Salvando...</>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">save</span> Salvar Evento</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExternalEventModal;
