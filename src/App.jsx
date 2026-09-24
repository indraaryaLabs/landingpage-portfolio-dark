import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

// Admin code and Supabase are not needed to show the public portfolio.
const AdminApp = lazy(() => import('./cms/AdminApp'));

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/project/:id" element={<Navigate to="/#work" replace />} />
    <Route path="/admin/*" element={<Suspense fallback={<div className="admin-loading">Loading editor…</div>}><AdminApp /></Suspense>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
