import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import FeaturesPage from '@/pages/FeaturesPage';
import UploadPage from '@/pages/UploadPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DashboardPage from '@/pages/DashboardPage';

const TITLES: Record<string, string> = {
  home: 'LegalLens — AI-Powered Product Compliance Checker',
  features: 'Features | LegalLens',
  dashboard: 'Dashboard | LegalLens',
  upload: 'Scan | LegalLens',
  about: 'About | LegalLens',
  contact: 'Contact | LegalLens',
};

export default function App() {
  const [page, setPage] = useState('home');

  const navigate = (next: string) => {
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    document.title = TITLES[page] ?? TITLES.home;
  }, [page]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
      <Navbar page={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'features' && <FeaturesPage onNavigate={navigate} />}
        {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {page === 'upload' && <UploadPage />}
        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
