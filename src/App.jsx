import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './cms/AuthContext';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';

// Admin pages
import AdminLayout from './cms/admin/AdminLayout';
import LoginPage from './cms/admin/LoginPage';
import DashboardHome from './cms/admin/DashboardHome';
import SettingsEditor from './cms/admin/editors/SettingsEditor';
import ExperienceEditor from './cms/admin/editors/ExperienceEditor';
import ProjectsEditor from './cms/admin/editors/ProjectsEditor';
import ProcessEditor from './cms/admin/editors/ProcessEditor';
import ServicesEditor from './cms/admin/editors/ServicesEditor';
import WhyChooseMeEditor from './cms/admin/editors/WhyChooseMeEditor';
import TestimonialsEditor from './cms/admin/editors/TestimonialsEditor';
import FAQEditor from './cms/admin/editors/FAQEditor';
import MessagesInbox from './cms/admin/editors/MessagesInbox';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />

          {/* Admin Login (unprotected) */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin Dashboard (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="settings" element={<SettingsEditor />} />
            <Route path="experience" element={<ExperienceEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="process" element={<ProcessEditor />} />
            <Route path="services" element={<ServicesEditor />} />
            <Route path="why-me" element={<WhyChooseMeEditor />} />
            <Route path="testimonials" element={<TestimonialsEditor />} />
            <Route path="faq" element={<FAQEditor />} />
            <Route path="messages" element={<MessagesInbox />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
