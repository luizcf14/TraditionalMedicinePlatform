import React, { useState } from 'react';
import { Screen } from './types';
import Layout from './components/Layout';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import PatientListScreen from './screens/PatientListScreen';
import PatientRecordScreen from './screens/PatientRecordScreen';
import PrescriptionScreen from './screens/PrescriptionScreen';
import RegistrationScreen from './screens/RegistrationScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.LOGIN);

  const handleLogin = () => {
    setCurrentScreen(Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentScreen(Screen.LOGIN);
  };

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case Screen.DASHBOARD:
        return <DashboardScreen onNavigate={navigate} />;
      case Screen.PATIENT_LIST:
        return <PatientListScreen onNavigate={navigate} />;
      case Screen.PATIENT_RECORD:
        return <PatientRecordScreen onNavigate={navigate} />;
      case Screen.NEW_PRESCRIPTION:
        return <PrescriptionScreen onNavigate={navigate} />;
      case Screen.REGISTRATION:
        return <RegistrationScreen onNavigate={navigate} />;
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
