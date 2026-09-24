import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './AuthContext';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/LoginPage';
import PortfolioEditor from './admin/PortfolioEditor';
import '../index.css';
import './admin/recon-admin.css';

export default function AdminApp() {
  return <AuthProvider><Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<PortfolioEditor />} />
      <Route path="projects" element={<Navigate to="/admin#work" replace />} />
    </Route>
  </Routes></AuthProvider>;
}
