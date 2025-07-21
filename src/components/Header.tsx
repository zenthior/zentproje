"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowUserMenu(false);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
  };

  return (
    <>
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <Link href="/" className="group">
                {/* Logo Metni */}
                <motion.div
                  className="text-2xl font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {/* Ana Metin */}
                  <motion.span
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_100%]"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6)'
                    }}
                  >
                    ZentProje
                  </motion.span>
                  
                  {/* Sağa Giden ve Geri Gelen Çizgi Efekti */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    style={{
                      width: '100%'
                    }}
                    animate={{
                      x: ['-100%', '120%', '-100%'],
                      scaleX: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                  
                  {/* Parıltı Efekti */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0.9, 1.1, 0.9]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
            
            {/* Kullanıcı Butonu - Logo'nun sağında */}
            <div className="relative">
              {isLoading ? (
                <div className="bg-gray-200 animate-pulse px-4 py-2 rounded-full w-12 h-10"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer"
                    title={`Merhaba ${user.name}`}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  
                  {/* Kullanıcı Menüsü */}
                  {showUserMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">Merhaba {user.name}!</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer"
                  title="Giriş Yap"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Link href="/projects" className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 px-5 py-2 rounded-full font-medium transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600">
              Projeler
            </Link>
            <Link href="/packages" className="bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900 text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 px-5 py-2 rounded-full font-medium transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600">
              Paketler
            </Link>
            <Link href="/about" className="bg-slate-100 dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-900 text-slate-700 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-300 px-5 py-2 rounded-full font-medium transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600">
              Hakkımda
            </Link>
            <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-lg hover:shadow-xl">
              İletişim
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Menü dışına tıklandığında kapat */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}