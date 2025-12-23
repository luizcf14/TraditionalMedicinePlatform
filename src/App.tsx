import React, { useState } from 'react';
import { Screen } from './types';
import Layout from './components/Layout';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import PatientListScreen from './pages/PatientListScreen';
import PatientRecordScreen from './pages/PatientRecordScreen';
import PrescriptionScreen from './pages/PrescriptionScreen';
import RegistrationScreen from './pages/RegistrationScreen';
import AgendaScreen from './pages/AgendaScreen';

import NewAppointmentScreen from './pages/NewAppointmentScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('currentScreen');
    return (saved as Screen) || Screen.LOGIN;
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(() => {
    return localStorage.getItem('selectedPatientId');
  });
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(() => {
    return localStorage.getItem('selectedAppointmentId');
  });

  const handleLogin = () => {
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentScreen(Screen.LOGIN);
    setSelectedPatientId(null);
    setSelectedAppointmentId(null);
    localStorage.removeItem('currentScreen');
    localStorage.removeItem('selectedPatientId');
    localStorage.removeItem('selectedAppointmentId');
  };

  const navigate = (screen: Screen, patientId?: string | null, appointmentId?: string | null) => {
    if (patientId !== undefined) {
      setSelectedPatientId(patientId);
      if (patientId) localStorage.setItem('selectedPatientId', patientId);
      else localStorage.removeItem('selectedPatientId');
    } else if (screen === Screen.REGISTRATION) {
      // Clear patient ID if navigating to Registration without explicit ID (New Patient mode)
      setSelectedPatientId(null);
      localStorage.removeItem('selectedPatientId');
    }

    if (appointmentId !== undefined) {
      setSelectedAppointmentId(appointmentId);
      if (appointmentId) localStorage.setItem('selectedAppointmentId', appointmentId);
      else localStorage.removeItem('selectedAppointmentId');
    }

    setCurrentScreen(screen);
    localStorage.setItem('currentScreen', screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case Screen.DASHBOARD:
        return <DashboardScreen onNavigate={navigate} />;
      case Screen.NEW_APPOINTMENT:
        return <NewAppointmentScreen onNavigate={navigate} />;
      case Screen.PATIENT_LIST:
        return <PatientListScreen onNavigate={navigate} />;
      case Screen.PATIENT_RECORD:
        return <PatientRecordScreen onNavigate={navigate} patientId={selectedPatientId} />;
      case Screen.NEW_PRESCRIPTION:
        return <PrescriptionScreen onNavigate={navigate} patientId={selectedPatientId} appointmentId={selectedAppointmentId} />;
      case Screen.REGISTRATION:
        return <RegistrationScreen onNavigate={navigate} patientId={selectedPatientId} />;
      case Screen.AGENDA:
        return <AgendaScreen onNavigate={navigate} />;
      default:
        return <DashboardScreen onNavigate={navigate} />;
    }
  };

  return (
    <Layout currentScreen={currentScreen} onNavigate={navigate} onLogout={handleLogout}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
