export enum Screen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PATIENT_LIST = 'PATIENT_LIST',
  PATIENT_RECORD = 'PATIENT_RECORD',
  NEW_PRESCRIPTION = 'NEW_PRESCRIPTION',
  REGISTRATION = 'REGISTRATION',
  NEW_APPOINTMENT = 'NEW_APPOINTMENT',
  AGENDA = 'AGENDA',
  PHARMACY = 'PHARMACY',
  SETTINGS = 'SETTINGS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty?: string;
  image?: string;
}

export interface Patient {
  id: string;
  name: string;
  motherName?: string;
  age: number;
  dob: string;
  village: string;
  ethnicity?: string;
  status: 'Em Tratamento' | 'Concluido' | 'Aguardando' | 'Acompanhamento' | 'Ativo' | 'Triagem' | 'Novo Paciente' | 'Óbito' | 'Arquivo Morto';
  lastVisit?: string;
  image: string;
  cns?: string;
  cpf?: string;
  indigenousName?: string;
  allergies?: string;
  conditions?: string;
  bloodType?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  reason: string;
  notes: string;
  status: 'Agendada' | 'Concluida' | 'Cancelada';
  prescriptionId?: string;
  prescriptionItems?: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: string;
  type: 'Alopático' | 'Tradicional';
  name: string;
  dosage: string;
  frequency: string;
  treatmentDetails?: Treatment;
  plantDetails?: Plant;
}

export interface CultivationInfo {
  climate?: string;
  water?: string;
  harvest?: string;
  soil?: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  indigenousName: string;
  description: string;
  mainUse: string;
  usageParts: string[]; // JSON array
  indications: string;
  preparation: string;
  dosage: string;
  contraindications: string;
  cultivation: CultivationInfo;
  image: string;
}

export interface Treatment {
  id: string;
  name: string;
  origin: string;
  indications: string;
  ingredients: any[]; // JSON array
  preparationMethod: string;
  duration: string;
  frequency: string;
  sideEffects: string;
  contraindications: string;
  notes: string;
}

export interface ICDCode {
  code: string;
  description: string;
}
