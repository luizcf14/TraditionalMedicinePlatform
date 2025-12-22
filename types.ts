export enum Screen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PATIENT_LIST = 'PATIENT_LIST',
  PATIENT_RECORD = 'PATIENT_RECORD',
  NEW_PRESCRIPTION = 'NEW_PRESCRIPTION',
  REGISTRATION = 'REGISTRATION'
}

export interface Patient {
  id: string;
  name: string;
  motherName?: string;
  age: number;
  dob: string;
  village: string;
  ethnicity?: string;
  status: 'Em Tratamento' | 'Acompanhamento' | 'Alta Médica' | 'Triagem';
  lastVisit?: string;
  image: string;
  cns?: string;
}

export interface PrescriptionItem {
  id: string;
  type: 'Alopático' | 'Tradicional';
  name: string;
  dosage: string;
  frequency: string;
}
