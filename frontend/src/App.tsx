import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import { SettingsPage } from './pages/Settings';
import { NotFoundPage } from './pages/NotFound';
import { useAppDispatch } from './store/hooks';
import { disconnectSocket } from './services/socket';

function App() {
  const { user, isAuth, logout } = useAuth();
  const dispatch = useAppDispatch();

  useSocket(isAuth ? user : null);

  const handleLogout = () => {
    disconnectSocket();
    logout();
  };

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  if (!isAuth) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={handleLogout} />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
