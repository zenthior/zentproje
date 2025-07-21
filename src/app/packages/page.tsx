"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Home, Package, X, ArrowRight, ArrowLeft, CreditCard, Palette, Globe, Shield, Zap, Users, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthModal from "@/components/AuthModal"; // Bu satırı ekleyin

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
  popular: boolean;
}

interface SiteInfo {
  siteName: string;
  domain: string;
  description: string;
  themeColor: string;
  extraFeatures: string[];
  guestPurchase: boolean;
  sslCertificate: boolean;
  analytics: boolean;
  fastLoading: boolean;
  mobileResponsive: boolean;
  socialMedia: boolean;
}

interface DesignTemplate {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [modalStep, setModalStep] = useState(1);
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    siteName: '',
    domain: '',
    description: '',
    themeColor: '#3B82F6',
    extraFeatures: [],
    guestPurchase: false,
    sslCertificate: true,
    analytics: true,
    fastLoading: true,
    mobileResponsive: true,
    socialMedia: false
  });
  const [selectedDesign, setSelectedDesign] = useState<DesignTemplate | null>(null);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; template: DesignTemplate | null }>({ isOpen: false, template: null });

  const themeColors = [
    { name: 'Mavi', value: '#3B82F6' },
    { name: 'Mor', value: '#8B5CF6' },
    { name: 'Yeşil', value: '#10B981' },
    { name: 'Kırmızı', value: '#EF4444' },
    { name: 'Turuncu', value: '#F59E0B' },
    { name: 'Pembe', value: '#EC4899' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Gri', value: '#6B7280' }
  ];

  const extraFeatures = [
    { id: 'blog', name: 'Blog Sistemi', price: 1500 },
    { id: 'ecommerce', name: 'E-Ticaret Modülü', price: 3000 },
    { id: 'booking', name: 'Randevu Sistemi', price: 2000 },
    { id: 'membership', name: 'Üyelik Sistemi', price: 2500 },
    { id: 'chat', name: 'Canlı Destek', price: 1000 },
    { id: 'social', name: 'Sosyal Medya Entegrasyonu', price: 500 },
    { id: 'multilang', name: 'Çoklu Dil Desteği', price: 2000 },
    { id: 'seo', name: 'Gelişmiş SEO Optimizasyonu', price: 1200 },
    { id: 'backup', name: 'Otomatik Yedekleme', price: 800 },
    { id: 'cdn', name: 'CDN Hızlandırma', price: 600 },
    { id: 'security', name: 'Gelişmiş Güvenlik', price: 1500 },
    { id: 'performance', name: 'Performans Optimizasyonu', price: 1000 }
  ];

  const designTemplates: DesignTemplate[] = [
    { id: '1', name: 'Modern Minimal', image: '/api/placeholder/300/200', category: 'Kurumsal', price: 0 },
    { id: '2', name: 'Creative Agency', image: '/api/placeholder/300/200', category: 'Ajans', price: 500 },
    { id: '3', name: 'E-Commerce Pro', image: '/api/placeholder/300/200', category: 'E-Ticaret', price: 1000 },
    { id: '4', name: 'Restaurant Deluxe', image: '/api/placeholder/300/200', category: 'Restoran', price: 750 },
    { id: '5', name: 'Portfolio Showcase', image: '/api/placeholder/300/200', category: 'Portfolyo', price: 300 },
    { id: '6', name: 'Medical Care', image: '/api/placeholder/300/200', category: 'Sağlık', price: 800 },
    { id: '7', name: 'Tech Startup', image: '/api/placeholder/300/200', category: 'Teknoloji', price: 600 },
    { id: '8', name: 'Fashion Store', image: '/api/placeholder/300/200', category: 'Moda', price: 900 },
    { id: '9', name: 'Real Estate', image: '/api/placeholder/300/200', category: 'Emlak', price: 1200 },
    { id: '10', name: 'Education Hub', image: '/api/placeholder/300/200', category: 'Eğitim', price: 700 },
    { id: '11', name: 'Fitness Center', image: '/api/placeholder/300/200', category: 'Spor', price: 650 },
    { id: '12', name: 'Travel Agency', image: '/api/placeholder/300/200', category: 'Turizm', price: 850 },
    { id: '13', name: 'Law Firm', image: '/api/placeholder/300/200', category: 'Hukuk', price: 950 },
    { id: '14', name: 'Beauty Salon', image: '/api/placeholder/300/200', category: 'Güzellik', price: 550 },
    { id: '15', name: 'Auto Service', image: '/api/placeholder/300/200', category: 'Otomotiv', price: 750 }
  ];

  // Her tasarım için özel site tasarımı oluştur
  const generatePreviewContent = (template: DesignTemplate) => {
    switch (template.category) {
      case 'Kurumsal':
        return (
          <div className="bg-white text-gray-800 min-h-screen">
            <header className="bg-blue-900 text-white p-4">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">ŞİRKETİM A.Ş.</h1>
                <nav className="flex gap-6">
                  <a href="#" className="hover:text-blue-200">Anasayfa</a>
                  <a href="#" className="hover:text-blue-200">Hakkımızda</a>
                  <a href="#" className="hover:text-blue-200">Hizmetler</a>
                  <a href="#" className="hover:text-blue-200">İletişim</a>
                </nav>
              </div>
            </header>
            <main className="container mx-auto p-8">
              <section className="text-center py-16">
                <h2 className="text-4xl font-bold mb-4">Güvenilir İş Ortağınız</h2>
                <p className="text-xl text-gray-600 mb-8">20 yıllık deneyimimizle sektörde lider konumdayız</p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">Hizmetlerimizi Keşfedin</button>
              </section>
              <section className="grid grid-cols-3 gap-8 py-16">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Güvenilirlik</h3>
                  <p className="text-gray-600">Müşteri memnuniyeti odaklı hizmet anlayışı</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hızlı Çözüm</h3>
                  <p className="text-gray-600">Zamanında ve etkili çözümler sunuyoruz</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Uzman Ekip</h3>
                  <p className="text-gray-600">Alanında uzman profesyonel kadromuz</p>
                </div>
              </section>
            </main>
          </div>
        );
      
      case 'E-Ticaret':
        return (
          <div className="bg-gray-50 text-gray-800 min-h-screen">
            <header className="bg-white shadow-md p-4">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-600">E-MAĞAZA</h1>
                <div className="flex items-center gap-4">
                  <input type="text" placeholder="Ürün ara..." className="border rounded-lg px-4 py-2" />
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Sepet (3)</button>
                </div>
              </div>
            </header>
            <main className="container mx-auto p-8">
              <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-12 rounded-lg mb-8">
                <h2 className="text-4xl font-bold mb-4">Yeni Sezon İndirimleri</h2>
                <p className="text-xl mb-6">%50'ye varan indirimlerle alışverişin keyfini çıkarın</p>
                <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Hemen Alışveriş Yap</button>
              </section>
              <section>
                <h3 className="text-2xl font-bold mb-6">Öne Çıkan Ürünler</h3>
                <div className="grid grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-gray-200 h-48 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold mb-2">Ürün {i}</h4>
                        <p className="text-gray-600 text-sm mb-2">Ürün açıklaması burada yer alır</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-purple-600">₺{(i * 100).toLocaleString()}</span>
                          <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">Sepete Ekle</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        );
      
      case 'Restoran':
        return (
          <div className="bg-amber-50 text-gray-800 min-h-screen">
            <header className="bg-amber-900 text-white p-4">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">LEZZET DURAĞI</h1>
                <nav className="flex gap-6">
                  <a href="#" className="hover:text-amber-200">Menü</a>
                  <a href="#" className="hover:text-amber-200">Rezervasyon</a>
                  <a href="#" className="hover:text-amber-200">Hakkımızda</a>
                  <a href="#" className="hover:text-amber-200">İletişim</a>
                </nav>
              </div>
            </header>
            <main>
              <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-16 text-center">
                <h2 className="text-5xl font-bold mb-4">Geleneksel Lezzetler</h2>
                <p className="text-xl mb-8">Ailenizle unutulmaz yemek deneyimi yaşayın</p>
                <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Rezervasyon Yap</button>
              </section>
              <section className="container mx-auto p-8">
                <h3 className="text-3xl font-bold text-center mb-8">Özel Menümüz</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-bold mb-4 text-amber-600">Ana Yemekler</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Izgara Köfte</span>
                        <span className="font-semibold">₺85</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tavuk Şiş</span>
                        <span className="font-semibold">₺75</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balık Izgara</span>
                        <span className="font-semibold">₺120</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="text-xl font-bold mb-4 text-amber-600">Tatlılar</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Baklava</span>
                        <span className="font-semibold">₺45</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Künefe</span>
                        <span className="font-semibold">₺50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sütlaç</span>
                        <span className="font-semibold">₺35</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 text-gray-800 min-h-screen">
            <header className="bg-gray-800 text-white p-4">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">{template.name.toUpperCase()}</h1>
                <nav className="flex gap-6">
                  <a href="#" className="hover:text-gray-300">Anasayfa</a>
                  <a href="#" className="hover:text-gray-300">Hizmetler</a>
                  <a href="#" className="hover:text-gray-300">Portfolyo</a>
                  <a href="#" className="hover:text-gray-300">İletişim</a>
                </nav>
              </div>
            </header>
            <main className="container mx-auto p-8">
              <section className="text-center py-16">
                <h2 className="text-4xl font-bold mb-4">{template.category} Çözümleri</h2>
                <p className="text-xl text-gray-600 mb-8">Profesyonel ve modern tasarım anlayışı</p>
                <button className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700">Daha Fazla Bilgi</button>
              </section>
              <section className="grid grid-cols-3 gap-8 py-16">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="bg-gray-200 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Star className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Özellik {i}</h3>
                    <p className="text-gray-600">Bu özellik hakkında detaylı bilgi</p>
                  </div>
                ))}
              </section>
            </main>
          </div>
        );
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        } else {
          // Fallback paketler
          setPackages([
            {
              id: '1',
              name: 'Temel Web Sitesi',
              description: 'Küçük işletmeler için temel web sitesi paketi',
              price: 5000,
              features: ['Responsive tasarım', '5 sayfa', 'İletişim formu', 'SEO optimizasyonu'],
              duration: '2-3 hafta',
              popular: false
            },
            {
              id: '2',
              name: 'E-Ticaret Sitesi',
              description: 'Online satış için kapsamlı e-ticaret çözümü',
              price: 15000,
              features: ['Ürün yönetimi', 'Ödeme entegrasyonu', 'Stok takibi', 'Admin paneli'],
              duration: '4-6 hafta',
              popular: true
            },
            {
              id: '3',
              name: 'Kurumsal Web Sitesi',
              description: 'Büyük şirketler için profesyonel web çözümü',
              price: 25000,
              features: ['Özel tasarım', 'CMS sistemi', 'Çoklu dil desteği', 'Analitik raporlama'],
              duration: '6-8 hafta',
              popular: false
            }
          ]);
        }
      } catch (error) {
        console.error('Paketler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    // Kullanıcı giriş yapmamışsa auth modal aç
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setSelectedPackage(pkg);
    setModalStep(1);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const closeModal = () => {
    setSelectedPackage(null);
    setModalStep(1);
    setSiteInfo({
      siteName: '',
      domain: '',
      description: '',
      themeColor: '#3B82F6',
      extraFeatures: [],
      guestPurchase: false,
      sslCertificate: true,
      analytics: true,
      fastLoading: true,
      mobileResponsive: true,
      socialMedia: false
    });
    setSelectedDesign(null);
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    
    let total = selectedPackage.price;
    
    // Ekstra özellikler
    siteInfo.extraFeatures.forEach(featureId => {
      const feature = extraFeatures.find(f => f.id === featureId);
      if (feature) total += feature.price;
    });
    
    // Tasarım şablonu
    if (selectedDesign) {
      total += selectedDesign.price;
    }
    
    return total;
  };

  const handleOrderSubmit = async () => {
    if (!user || !selectedPackage) {
      alert('Lütfen giriş yapın!');
      return;
    }
  
    try {
      const orderData = {
        packageId: selectedPackage.id,
        siteName: siteInfo.siteName,
        domain: siteInfo.domain,
        description: siteInfo.description,
        themeColor: siteInfo.themeColor,
        extraFeatures: JSON.stringify(siteInfo.extraFeatures),
        sslCertificate: siteInfo.sslCertificate,
        analytics: siteInfo.analytics,
        fastLoading: siteInfo.fastLoading,
        mobileResponsive: siteInfo.mobileResponsive,
        socialMedia: siteInfo.socialMedia,
        guestPurchase: siteInfo.guestPurchase,
        designTemplate: selectedDesign ? JSON.stringify(selectedDesign) : null,
        totalAmount: calculateTotalPrice(),
        currency: 'TRY'
      };
  
      console.log('Gönderilen sipariş verisi:', orderData);
  
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
  
      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const order = await response.json();
        console.log('Başarılı sipariş:', order);
        alert(`Siparişiniz başarıyla oluşturuldu! Sipariş No: ${order.orderNumber}`);
        closeModal();
      } else {
        const errorData = await response.json();
        console.error('API Hatası:', errorData);
        throw new Error(errorData.error || 'Sipariş oluşturulamadı');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(`Sipariş oluşturulurken hata oluştu: ${error.message}`);
    }
  };

  const nextStep = () => {
    // İlk adımda zorunlu alanları kontrol et
    if (modalStep === 1) {
      if (!siteInfo.siteName.trim()) {
        alert('Site adı zorunludur!');
        return;
      }
      if (!siteInfo.domain.trim()) {
        alert('Domain adı zorunludur!');
        return;
      }
      if (!siteInfo.description.trim()) {
        alert('Site açıklaması zorunludur!');
        return;
      }
    }
    
    // İkinci adımda tasarım seçimi kontrolü
    if (modalStep === 2) {
      if (!selectedDesign) {
        alert('Tasarım şablonu seçimi zorunludur!');
        return;
      }
    }
    
    if (modalStep < 3) {
      setModalStep(modalStep + 1);
    }
  };

  const prevStep = () => {
    if (modalStep > 1) {
      setModalStep(modalStep - 1);
    }
  };

  const renderModalContent = () => {
    switch (modalStep) {
      case 1:
        return (
          <div className="flex h-full">
            {/* Sol Taraf - Site Bilgileri */}
            <div className="w-1/2 p-6 border-r border-gray-600">
              <h3 className="text-xl font-bold text-white mb-6">Site Bilgileri</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2">Site Adı <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={siteInfo.siteName}
                    onChange={(e) => setSiteInfo({...siteInfo, siteName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                    placeholder="Örn: Şirketim"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Domain Adı <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={siteInfo.domain}
                    onChange={(e) => setSiteInfo({...siteInfo, domain: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                    placeholder="Örn: sirketim.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Site Açıklaması <span className="text-red-400">*</span></label>
                  <textarea
                    value={siteInfo.description}
                    onChange={(e) => setSiteInfo({...siteInfo, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none h-24 resize-none"
                    placeholder="Sitenizin kısa açıklaması..."
                    required
                  />
                </div>
              </div>
              
              {/* Tema Rengi Seçimi */}
              <div>
                <label className="block text-gray-300 mb-3">Tema Rengi</label>
                <div className="grid grid-cols-4 gap-2">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSiteInfo({...siteInfo, themeColor: color.value})}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        siteInfo.themeColor === color.value ? 'border-white scale-110' : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sağ Taraf - Ekstra Özellikler */}
            <div className="w-1/2 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Ekstra Özellikler</h3>
              
              <div className="space-y-3 mb-6">
                {extraFeatures.map((feature) => {
                  // Seçilen pakette bu özellik dahil mi kontrol et
                  const isIncludedInPackage = selectedPackage?.includedExtraFeatures?.includes(feature.id);
                  
                  return (
                    <label key={feature.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isIncludedInPackage 
                        ? 'bg-green-900/30 border border-green-600 cursor-default' 
                        : 'bg-gray-700/50 hover:bg-gray-700 cursor-pointer'
                    }`}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isIncludedInPackage || siteInfo.extraFeatures.includes(feature.id)}
                          onChange={(e) => {
                            if (!isIncludedInPackage) {
                              if (e.target.checked) {
                                setSiteInfo({...siteInfo, extraFeatures: [...siteInfo.extraFeatures, feature.id]});
                              } else {
                                setSiteInfo({...siteInfo, extraFeatures: siteInfo.extraFeatures.filter(f => f !== feature.id)});
                              }
                            }
                          }}
                          disabled={isIncludedInPackage}
                          className="mr-3 w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400 disabled:opacity-50"
                        />
                        <span className="text-white">{feature.name}</span>
                      </div>
                      <span className={`font-semibold ${
                        isIncludedInPackage 
                          ? 'text-green-400' 
                          : 'text-blue-400'
                      }`}>
                        {isIncludedInPackage ? 'Pakette dahil' : `+₺${feature.price.toLocaleString()}`}
                      </span>
                    </label>
                  );
                })}
              </div>
                
              {/* Site Seçenekleri */}
              <h4 className="text-lg font-semibold text-white mb-4">Site Seçenekleri</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                  <span className="text-white">Kayıtsız Satın Alım</span>
                  <input
                    type="checkbox"
                    checked={siteInfo.guestPurchase}
                    onChange={(e) => setSiteInfo({...siteInfo, guestPurchase: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                  <span className="text-white">SSL Sertifikası</span>
                  <input
                    type="checkbox"
                    checked={siteInfo.sslCertificate}
                    onChange={(e) => setSiteInfo({...siteInfo, sslCertificate: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Hızlı Yükleme</span>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <input
                    type="checkbox"
                    checked={siteInfo.fastLoading}
                    onChange={(e) => setSiteInfo({...siteInfo, fastLoading: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Mobil Uyumlu</span>
                    <Users className="w-4 h-4 text-green-400" />
                  </div>
                  <input
                    type="checkbox"
                    checked={siteInfo.mobileResponsive}
                    onChange={(e) => setSiteInfo({...siteInfo, mobileResponsive: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Sosyal Medya Entegrasyonu</span>
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <input
                    type="checkbox"
                    checked={siteInfo.socialMedia}
                    onChange={(e) => setSiteInfo({...siteInfo, socialMedia: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700">
                  <span className="text-white">Google Analytics</span>
                  <input
                    type="checkbox"
                    checked={siteInfo.analytics}
                    onChange={(e) => setSiteInfo({...siteInfo, analytics: e.target.checked})}
                    className="w-4 h-4 text-blue-400 bg-gray-600 border-gray-500 rounded focus:ring-blue-400"
                  />
                </label>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Tasarım Şablonu Seçin</h3>
            <p className="text-center text-red-400 mb-6 font-medium">* Tasarım seçimi zorunludur</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {designTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative bg-gray-700/50 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedDesign?.id === template.id ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div 
                    className="aspect-video bg-gray-600 flex items-center justify-center cursor-pointer"
                    onClick={() => setSelectedDesign(template)}
                  >
                    <Palette className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-1">{template.name}</h4>
                    <p className="text-gray-400 text-sm mb-2">{template.category}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-blue-400 font-semibold">
                        {template.price === 0 ? 'Ücretsiz' : `+₺${template.price.toLocaleString()}`}
                      </span>
                      {selectedDesign?.id === template.id && (
                        <Check className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedDesign(template)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedDesign?.id === template.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        }`}
                      >
                        {selectedDesign?.id === template.id ? 'Seçildi' : 'Seç'}
                      </button>
                      
                      <button
                        onClick={() => setPreviewModal({ isOpen: true, template })}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Önizle
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="flex h-full">
            {/* Sol Taraf - Sipariş Özeti */}
            <div className="w-1/2 p-6 border-r border-gray-600">
              <h3 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-white">{selectedPackage?.name}</span>
                  <span className="text-blue-400 font-semibold">₺{selectedPackage?.price.toLocaleString()}</span>
                </div>
                
                {siteInfo.extraFeatures.map(featureId => {
                  const feature = extraFeatures.find(f => f.id === featureId);
                  return feature ? (
                    <div key={featureId} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-white">{feature.name}</span>
                      <span className="text-blue-400 font-semibold">₺{feature.price.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                
                {selectedDesign && selectedDesign.price > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-white">{selectedDesign.name} Şablonu</span>
                    <span className="text-blue-400 font-semibold">₺{selectedDesign.price.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-white">Toplam</span>
                    <span className="text-blue-400">₺{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Site Bilgileri Özeti */}
              <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                <h4 className="text-white font-semibold mb-3">Site Bilgileri</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-400">Site Adı:</span> <span className="text-white">{siteInfo.siteName || 'Belirtilmedi'}</span></div>
                  <div><span className="text-gray-400">Domain:</span> <span className="text-white">{siteInfo.domain || 'Belirtilmedi'}</span></div>
                  <div><span className="text-gray-400">Açıklama:</span> <span className="text-white">{siteInfo.description || 'Belirtilmedi'}</span></div>
                  <div><span className="text-gray-400">Tema Rengi:</span> <span className="w-4 h-4 rounded inline-block ml-2" style={{backgroundColor: siteInfo.themeColor}}></span></div>
                </div>
              </div>
              
              {/* Seçilen Tasarım */}
              {selectedDesign && (
                <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                  <h4 className="text-white font-semibold mb-3">Seçilen Tasarım</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">Tasarım:</span> <span className="text-white">{selectedDesign.name}</span></div>
                    <div><span className="text-gray-400">Kategori:</span> <span className="text-white">{selectedDesign.category}</span></div>
                  </div>
                </div>
              )}
              
              {/* Site Seçenekleri Özeti */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Site Seçenekleri</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${siteInfo.sslCertificate ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-white">SSL Sertifikası</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${siteInfo.analytics ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-white">Google Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${siteInfo.fastLoading ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-white">Hızlı Yükleme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${siteInfo.mobileResponsive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-white">Mobil Uyumlu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${siteInfo.socialMedia ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-white">Sosyal Medya</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${siteInfo.guestPurchase ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <span className="text-white">Kayıtsız Satın Alım</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sağ Taraf - Ödeme Formu */}
            <div className="w-1/2 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Ödeme Bilgileri</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Kart Numarası</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Son Kullanma</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">CVV</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Kart Sahibi Adı</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                    placeholder="Ad Soyad"
                  />
                </div>
                
                <div className="pt-4">
                  <h4 className="text-white font-semibold mb-3">Fatura Adresi</h4>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      placeholder="Adres"
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        placeholder="Şehir"
                      />
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                        placeholder="Posta Kodu"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 mt-6"
                  onClick={handleOrderSubmit}
                >
                  <CreditCard className="w-5 h-5" />
                  ₺{calculateTotalPrice().toLocaleString()} Öde
                </button>
              </form>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Modern Navigation */}
        <div className="fixed top-6 left-6 z-50 flex gap-3">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            >
              <Home size={18} />
              <span className="font-medium">Ana Sayfa</span>
            </motion.button>
          </Link>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/90 backdrop-blur-md rounded-full shadow-lg text-white border border-blue-400/30"
          >
            <Package size={18} />
            <span className="font-medium">Paketler</span>
          </motion.div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-xl">Paketler yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Modern Navigation */}
      <div className="fixed top-6 left-6 z-50 flex gap-3">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
          >
            <Home size={18} />
            <span className="font-medium">Ana Sayfa</span>
          </motion.button>
        </Link>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/90 backdrop-blur-md rounded-full shadow-lg text-white border border-blue-400/30"
        >
          <Package size={18} />
          <span className="font-medium">Paketler</span>
        </motion.div>
      </div>
      
      {/* ZentProje Logo - Centered */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            className="text-3xl font-bold relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Ana Metin */}
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_100%]"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa, #22d3ee, #a78bfa, #60a5fa)'
              }}
            >
              ZentProje
            </motion.span>
            
            {/* Sağa Giden ve Geri Gelen Çizgi Efekti */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
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
                background: 'radial-gradient(ellipse, rgba(96, 165, 250, 0.2) 0%, transparent 70%)'
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
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 mt-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">
            Hizmet <span className="text-blue-400">Paketlerimiz</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            İhtiyaçlarınıza uygun profesyonel çözümler
          </p>
        </motion.div>

        {packages.length === 0 ? (
          <div className="text-center text-white">
            <p className="text-xl mb-4">Henüz paket eklenmemiş.</p>
            <p className="text-gray-300">Admin panelinden paket ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Popüler
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-gray-300 mb-4">{pkg.description}</p>
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    ₺{pkg.price.toLocaleString()}
                  </div>
                  <p className="text-gray-400">{pkg.duration}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePackageSelect(pkg)}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
                >
                  Paket Seç
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">{selectedPackage.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Adım {modalStep}/3</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {modalStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Geri
                    </button>
                  )}
                  
                  {modalStep < 3 && (
                    <button
                      onClick={nextStep}
                      disabled={modalStep === 2 && !selectedDesign}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        modalStep === 2 && !selectedDesign 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      İleri
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="flex-1 overflow-auto">
                {renderModalContent()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview Modal */}
      <AnimatePresence>
        {previewModal.isOpen && previewModal.template && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold">{previewModal.template.name} - Önizleme</h3>
                  <span className="px-3 py-1 bg-blue-600 rounded-full text-sm">{previewModal.template.category}</span>
                  <span className="text-gray-300">
                    {previewModal.template.price === 0 ? 'Ücretsiz' : `+₺${previewModal.template.price.toLocaleString()}`}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedDesign(previewModal.template);
                      setPreviewModal({ isOpen: false, template: null });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Bu Tasarımı Seç
                  </button>
                  
                  <button
                    onClick={() => setPreviewModal({ isOpen: false, template: null })}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="flex-1 overflow-auto bg-gray-100">
                <div className="transform scale-75 origin-top-left" style={{ width: '133.33%', height: '133.33%' }}>
                  {generatePreviewContent(previewModal.template)}
                </div>
              </div>
              
              {/* Preview Footer */}
              <div className="p-4 bg-gray-800 text-white border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    Bu bir önizlemedir. Gerçek site daha detaylı ve özelleştirilebilir olacaktır.
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPreviewModal({ isOpen: false, template: null })}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDesign(previewModal.template);
                        setPreviewModal({ isOpen: false, template: null });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Seç ve Devam Et
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AuthModal ekle */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
