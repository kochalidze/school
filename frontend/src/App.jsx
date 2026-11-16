import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './store/authStore.js';

export default function App() {
  const init = useAuth((s) => s.init);
  const checkSession = useAuth((s) => s.checkSession);
  
  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // 5 წუთში ერთხელ შეამოწმე სესია

    return () => clearInterval(interval);
  }, [checkSession]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
