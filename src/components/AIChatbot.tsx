"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben ZentProje AI asistanıyım. Size en uygun paket önerilerinde bulunabilirim. Nasıl yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Admin panelinde AI chatbot'u gizle
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    return null;
  }

  // Paketleri yükle
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        }
      } catch (error) {
        console.error('Paketler yüklenirken hata:', error);
      }
    };
    fetchPackages();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findPackageByKeywords = (keywords: string[]): Package | null => {
    return packages.find(pkg => 
      keywords.some(keyword => 
        pkg.name.toLowerCase().includes(keyword) ||
        pkg.description.toLowerCase().includes(keyword)
      )
    ) || null;
  };

  const formatPrice = (price: number, currency: string = 'TRY'): string => {
    if (currency === 'TRY' || currency === 'TL') {
      return `${price.toLocaleString('tr-TR')}₺`;
    } else if (currency === 'USD') {
      return `$${price.toLocaleString('en-US')}`;
    } else if (currency === 'EUR') {
      return `€${price.toLocaleString('de-DE')}`;
    }
    return `${price.toLocaleString('tr-TR')} ${currency}`;
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Özel gizli mesaj - 30.06.2007
    if (message.includes('30.06.2007') || message.includes('30/06/2007') || message.includes('30-06-2007')) {
      return '💕 İyi ki Varsın Sevgilim \n\n💖 Seni Çoook Seviyorum ';
    }
    
    // E-ticaret ile ilgili kelimeler
    else if (message.includes('e-ticaret') || message.includes('eticaret') || 
        message.includes('online satış') || message.includes('satış') || 
        message.includes('mağaza') || message.includes('shop') ||
        message.includes('ürün sat') || message.includes('online mağaza')) {
      
      const ecommercePackage = findPackageByKeywords(['e-ticaret', 'ecommerce', 'satış', 'mağaza']);
      if (ecommercePackage) {
        const price = formatPrice(ecommercePackage.price, ecommercePackage.currency || 'TRY');
        return `E-ticaret siteniz için **${ecommercePackage.name}** paketimiz mükemmel! Fiyatı ${price} ve online satış yapmak isteyenler için idealdir. 10 saniye içinde sizi uygun pakete yönlendiriyorum...`;
      } else {
        return 'E-ticaret siteniz için uygun paketimiz mevcut. 10 saniye içinde sizi paket sayfasına yönlendiriyorum...';
      }
    }
    
    // Küçük işletme ile ilgili kelimeler
    else if (message.includes('küçük işletme') || message.includes('küçük') || 
             message.includes('basit') || message.includes('temel') ||
             message.includes('başlangıç') || message.includes('ucuz') ||
             message.includes('ekonomik') || message.includes('uygun fiyat')) {
      
      const basicPackage = findPackageByKeywords(['temel', 'basic', 'küçük', 'başlangıç']);
      if (basicPackage) {
        const price = formatPrice(basicPackage.price, basicPackage.currency || 'TRY');
        return `Küçük işletmeniz için **${basicPackage.name}** paketimiz en uygun olacaktır. Fiyatı ${price} ve küçük işletmeler için idealdir. 10 saniye içinde sizi uygun pakete yönlendiriyorum...`;
      } else {
        return 'Küçük işletmeniz için uygun paketimiz mevcut. 10 saniye içinde sizi paket sayfasına yönlendiriyorum...';
      }
    }
    
    // Kurumsal ile ilgili kelimeler
    else if (message.includes('kurumsal') || message.includes('büyük') || 
             message.includes('şirket') || message.includes('firma') ||
             message.includes('profesyonel') || message.includes('corporate') ||
             message.includes('enterprise') || message.includes('büyük proje')) {
      
      const corporatePackage = findPackageByKeywords(['kurumsal', 'corporate', 'enterprise', 'büyük', 'profesyonel']);
      if (corporatePackage) {
        const price = formatPrice(corporatePackage.price, corporatePackage.currency || 'TRY');
        return `Büyük şirketiniz için **${corporatePackage.name}** paketimiz en profesyonel çözüm. Fiyatı ${price} ve kurumsal projeler için idealdir. 10 saniye içinde sizi uygun pakete yönlendiriyorum...`;
      } else {
        return 'Kurumsal projeniz için uygun paketimiz mevcut. 10 saniye içinde sizi paket sayfasına yönlendiriyorum...';
      }
    }
    
    // Blog ve içerik ile ilgili kelimeler
    else if (message.includes('blog') || message.includes('içerik') || 
             message.includes('yazı') || message.includes('makale') ||
             message.includes('haber') || message.includes('content') ||
             message.includes('yazar') || message.includes('editör')) {
      
      const blogPackage = findPackageByKeywords(['blog', 'içerik', 'content', 'yazı', 'makale']);
      if (blogPackage) {
        const price = formatPrice(blogPackage.price, blogPackage.currency || 'TRY');
        return `İçerik odaklı projeniz için **${blogPackage.name}** paketimiz ideal. Fiyatı ${price} ve blog/içerik siteleri için mükemmel. 10 saniye içinde sizi uygun pakete yönlendiriyorum...`;
      } else {
        return 'Blog/içerik siteniz için uygun paketimiz mevcut. 10 saniye içinde sizi paket sayfasına yönlendiriyorum...';
      }
    }
    
    // Genel paket soruları
    else if (message.includes('paket') || message.includes('fiyat') || 
             message.includes('uygun') || message.includes('öneri') ||
             message.includes('hangisi') || message.includes('seçmek') ||
             message.includes('karar') || message.includes('yardım')) {
      return 'Size en uygun paketi önerebilmem için biraz daha detay verebilir misiniz? Küçük bir işletme mi, e-ticaret mi, yoksa kurumsal bir proje mi planlıyorsunuz?';
    }
    
    // Selamlaşma
    else if (message.includes('merhaba') || message.includes('selam') || 
             message.includes('hey') || message.includes('hi') ||
             message.includes('hello') || message.includes('iyi')) {
      return 'Merhaba! Size nasıl yardımcı olabilirim? Hangi tür bir web sitesi planlıyorsunuz?';
    }
    
    // Teşekkür
    else if (message.includes('teşekkür') || message.includes('sağol') || 
             message.includes('thanks') || message.includes('thank you') ||
             message.includes('eyvallah') || message.includes('çok güzel')) {
      return 'Rica ederim! Başka sorularınız varsa her zaman buradayım. Size nasıl yardımcı olabilirim?';
    }
    
    // Site türü belirtmeden genel sorular
    else if (message.includes('site') || message.includes('web') ||
             message.includes('tasarım') || message.includes('yapım') ||
             message.includes('geliştirme') || message.includes('proje')) {
      return 'Web sitesi projeniz için size yardımcı olmaktan mutluluk duyarım! Hangi tür bir site düşünüyorsunuz? E-ticaret, kurumsal, blog veya temel bir site mi?';
    }
    
    // Varsayılan yanıt - daha yardımcı
    else {
      return 'Size daha iyi yardımcı olabilmem için projenizin türünü belirtebilir misiniz? Örneğin: e-ticaret, kurumsal site, blog veya küçük işletme sitesi gibi...';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // AI yanıtını simüle et
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Eğer yönlendirme mesajı varsa, 10 saniye sonra yönlendir
      if (aiResponse.includes('yönlendiriyorum')) {
        setTimeout(() => {
          window.location.href = '/packages';
        }, 10000); // 10 saniye
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* AI Chatbot Button - Yeni Tasarım */}
      <motion.div
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white p-4 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group relative overflow-hidden cursor-pointer"
          style={{
            clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)'
          }}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center justify-center relative z-10">
            <span className="text-xl font-bold tracking-wider">ZP</span>
          </div>
          
          {/* Animated Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-30"
            style={{
              clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)'
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-emerald-400 opacity-20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col border border-gray-700"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header - Logo Düzeltildi */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg">
                    <span className="text-white font-bold text-lg drop-shadow-lg">ZP</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">ZentProje AI</h3>
                    <p className="text-emerald-100 text-xs">Paket Danışmanınız</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.isUser
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                          : 'bg-gray-800 text-gray-100 border border-gray-700'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl border border-gray-700">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-teal-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    disabled={!inputValue.trim()}
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;