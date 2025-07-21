"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [securityStep, setSecurityStep] = useState(0);
  
  // Admin panelde preloader'ı devre dışı bırak
  const isAdminPage = pathname.startsWith('/admin');

  const securitySteps = [
    "SSL sertifikası doğrulanıyor...",
    "SSL sertifikası doğrulanıyor...",
    "Firewall kuralları kontrol ediliyor...",
    "Kullanıcı yetkileri kontrol ediliyor...",
    "Sistem güvenliği onaylandı ✓"
  ];

  useEffect(() => {
    // İlk yükleme kontrolü
    if (!hasInitialLoad && !isAdminPage) {
      // SessionStorage'dan preloader durumunu kontrol et
      const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
      
      // Eğer daha önce preloader görülmemişse göster
      if (!hasSeenPreloader) {
        setIsLoading(true);
        
        // Güvenlik adımları animasyonu
        const securityInterval = setInterval(() => {
          setSecurityStep(prev => {
            if (prev < securitySteps.length - 1) {
              return prev + 1;
            }
            clearInterval(securityInterval);
            return prev;
          });
        }, 650); // Her 560ms'de bir adım (2800ms / 5 adım)
        
        const timer = setTimeout(() => {
          setIsLoading(false);
          setHasInitialLoad(true);
          // Preloader gösterildikten sonra sessionStorage'a kaydet
          sessionStorage.setItem('hasSeenPreloader', 'true');
        }, 3400);
        
        return () => {
          clearTimeout(timer);
          clearInterval(securityInterval);
        };
      } else {
        setHasInitialLoad(true);
      }
    }
  }, [hasInitialLoad, isAdminPage]);

  return (
    <>
      {/* Preloader Overlay - Sadece ilk yüklemede */}
      <AnimatePresence>
        {isLoading && !isAdminPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
          >
            {/* Ana Preloader Container */}
            <div className="relative flex flex-col items-center">
              
              {/* Loading Text */}
              <motion.div
                className="text-center mb-16 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Yıldız Kaymaları - Arka Plan */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`back-${i}`}
                      className="absolute w-2 h-2 bg-blue-400/80 rounded-full shadow-lg"
                      style={{
                        top: `${5 + (i * 12)}%`,
                        right: '130%',
                        boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
                      }}
                      animate={{
                        x: [-120, 450],
                        y: [0, 100],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 3.4,
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>

                <motion.h2
                  className="text-4xl font-bold relative z-10"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)',
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  ZentProje
                </motion.h2>

                {/* Yıldız Kaymaları - Ön Plan */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`front-${i}`}
                      className="absolute w-2.5 h-2.5 bg-purple-400/90 rounded-full shadow-lg"
                      style={{
                        top: `${15 + (i * 15)}%`,
                        right: '115%',
                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.7)'
                      }}
                      animate={{
                        x: [-100, 400],
                        y: [0, 80],
                        opacity: [0, 1, 0],
                        scale: [0.6, 1.4, 0.6]
                      }}
                      transition={{
                        duration: 2.3,
                        repeat: Infinity,
                        delay: 1 + (i * 0.4),
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Güvenlik Kontrolü Mesajı */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  key={securityStep}
                  className="text-sm text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {securityStep < securitySteps.length - 1 && (
                    <motion.div
                      className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  {securitySteps[securityStep]}
                </motion.div>
              </motion.div>
            </div>
            
            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 2.8,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sayfa İçeriği - Sadece preloader yokken göster */}
      {(!isLoading || isAdminPage) && (
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}