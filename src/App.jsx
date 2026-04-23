import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import AppRoutes from './routes';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <AppRoutes />;
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
