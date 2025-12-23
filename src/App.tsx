import React, { useState, useEffect } from 'react';
import { Screen, User } from './types';
import Layout from './components/Layout';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import PatientListScreen from './pages/PatientListScreen';
import PatientRecordScreen from './pages/PatientRecordScreen';
import PrescriptionScreen from './pages/PrescriptionScreen';
import RegistrationScreen from './pages/RegistrationScreen';
import AgendaScreen from './pages/AgendaScreen';

import NewAppointmentScreen from './pages/NewAppointmentScreen';
import PharmacyScreen from './pages/PharmacyScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('currentScreen');
    return (saved as Screen) || Screen.LOGIN;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(() => {
    return localStorage.getItem('selectedPatientId');
  });
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(() => {
    return localStorage.getItem('selectedAppointmentId');
  });

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentScreen(Screen.LOGIN);
    setCurrentUser(null);
    setSelectedPatientId(null);
    setSelectedAppointmentId(null);
    localStorage.removeItem('currentScreen');
    localStorage.removeItem('currentUser');
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
      case Screen.PHARMACY:
        return <PharmacyScreen onNavigate={navigate} patientId={selectedPatientId} appointmentId={selectedAppointmentId} />;
      default:
        return <DashboardScreen onNavigate={navigate} />;
    }
  };

  return (
    <Layout currentScreen={currentScreen} onNavigate={navigate} onLogout={handleLogout} user={currentUser}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
