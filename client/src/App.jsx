import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Route, Routes, useLocation } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Credits from './pages/Credits';
import Community from './pages/Community';
import ResetPassword from './pages/ResetPassword';
import './assets/prism.css';
import Loading from './pages/Loading';
import Loader from './components/Loader';
import { useAppContext } from './context/AppContext';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { user, loadingUser } = useAppContext();
  // Start sidebar closed on mobile, open on desktop
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth >= 768);
  const { pathname } = useLocation();

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  if (pathname === '/loading') return <Loading />;
  if (loadingUser) return <Loader fullScreen />;

  if (pathname.startsWith('/reset-password/')) {
    return (
      <>
        <Toaster />
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <Toaster />
      {user ? (
        <div className="bg-[#F8FAFC] dark:bg-[#0D1117] text-[#0F172A] dark:text-[#E6EDF3] h-screen w-screen transition-colors duration-300 overflow-hidden">
          <div className="flex h-full w-full relative">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

            {/* Backdrop overlay on mobile when sidebar is open */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <Routes>
                <Route path="/" element={<ChatBox isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />} />
                <Route path="/credits" element={<Credits setIsMenuOpen={setIsMenuOpen} />} />
                <Route path="/community" element={<Community setIsMenuOpen={setIsMenuOpen} />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#F8FAFC] dark:bg-[#0D1117] text-[#0F172A] dark:text-[#E6EDF3] flex items-center justify-center h-screen w-screen transition-colors duration-300 p-4">
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
