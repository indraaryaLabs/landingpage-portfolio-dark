import { Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './AuthContext';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/LoginPage';
import ProjectsEditor from './admin/editors/ProjectsEditor';
import '../index.css';

function Overview() {
  return <div className="admin-card"><h1 className="admin-card-title">Portfolio images</h1><p>The public portfolio uses verified project descriptions. Use Project Images to add or replace screenshots. No image is published until you save its project card.</p><p><a className="admin-btn admin-btn-primary" href="/admin/projects">Manage project images</a></p></div>;
}

export default function AdminApp() {
  return <AuthProvider><Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Overview />} />
      <Route path="projects" element={<ProjectsEditor />} />
    </Route>
  </Routes></AuthProvider>;
}
