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

export interface Patient {
  id: string;
  name: string;
  motherName?: string;
  age: number;
  dob: string;
  village: string;
  ethnicity?: string;
  status: 'Em Tratamento' | 'Concluido' | 'Aguardando';
  lastVisit?: string;
  image: string;
  cns?: string;
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
}

export interface PrescriptionItem {
  id: string;
  type: 'Alopático' | 'Tradicional';
  name: string;
  dosage: string;
  frequency: string;
}
