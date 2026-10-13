import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { DiscoveryPage } from './pages/DiscoveryPage';
import { CreatorsPage } from './pages/CreatorsPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectFormPage } from './pages/ProjectFormPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ArchitecturePage } from './pages/ArchitecturePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#07070a] text-zinc-100 selection:bg-violet-600/30 selection:text-violet-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DiscoveryPage />} />
              <Route path="/creators" element={<CreatorsPage />} />
              <Route path="/creators/:handleOrId" element={<CreatorProfilePage />} />
              <Route path="/projects/new" element={<ProjectFormPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
              <Route path="/workflows" element={<WorkflowsPage />} />
              <Route path="/architecture" element={<ArchitecturePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
