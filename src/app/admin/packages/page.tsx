'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  Users,
  Star,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  duration: string;
  category: 'web-development' | 'mobile-app' | 'ui-ux-design' | 'consulting' | 'maintenance';
  features: string[];
  includedExtraFeatures: string[]; // Yeni alan
  isPopular: boolean;
  isActive: boolean;
  maxRevisions: number;
  deliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

const ServicePackagesPage = () => {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: 0,
    currency: 'USD',
    duration: '',
    category: 'web-development' as ServicePackage['category'],
    features: [''],
    includedExtraFeatures: [] as string[], // Yeni alan
    isPopular: false,
    isActive: true,
    maxRevisions: 3,
    deliveryTime: ''
  });

  // Ekstra özellikler listesi (paketler sayfasındakiyle aynı)
  const extraFeatures = [
    { id: 'blog', name: 'Blog Sistemi', price: 1500 },
    { id: 'ecommerce', name: 'E-Ticaret Modülü', price: 3000 },
    { id: 'booking', name: 'Randevu Sistemi', price: 2000 },
    { id: 'membership', name: 'Üyelik Sistemi', price: 2500 },
    { id: 'chat', name: 'Canlı Destek', price: 1000 },
    { id: 'social', name: 'Sosyal Medya Entegrasyonu', price: 500 }
  ];

  useEffect(() => {
    // API'den paketleri çek
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages');
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        }
      } catch (error) {
        console.error('Paketler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const packageData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: formData.price,
        currency: formData.currency,
        duration: formData.duration,
        category: formData.category,
        features: formData.features.filter(feature => feature.trim() !== ''),
        includedExtraFeatures: formData.includedExtraFeatures, // Yeni alan
        isPopular: formData.isPopular,
        isActive: formData.isActive,
        maxRevisions: formData.maxRevisions,
        deliveryTime: formData.deliveryTime
      };

      if (editingPackage) {
        // Mevcut paketi güncelle
        const response = await fetch(`/api/packages/${editingPackage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packageData),
        });

        if (response.ok) {
          const updatedPackage = await response.json();
          setPackages(prev => prev.map(pkg => pkg.id === editingPackage.id ? updatedPackage : pkg));
          alert('Paket başarıyla güncellendi!');
        } else {
          const errorData = await response.json();
          console.error('Güncelleme hatası:', errorData);
          alert('Paket güncellenirken hata oluştu: ' + (errorData.error || 'Bilinmeyen hata'));
        }
      } else {
        // Yeni paket ekle
        const response = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(packageData),
        });

        if (response.ok) {
          const newPackage = await response.json();
          setPackages(prev => [...prev, newPackage]);
          alert('Paket başarıyla eklendi!');
        } else {
          const errorData = await response.json();
          console.error('Ekleme hatası:', errorData);
          alert('Paket eklenirken hata oluştu: ' + (errorData.error || 'Bilinmeyen hata'));
        }
      }
      
      resetForm();
    } catch (error) {
      console.error('Paket kaydedilirken hata:', error);
      alert('Paket kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  useEffect(() => {
    let filtered = packages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === categoryFilter);
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, categoryFilter]);

  const handleEdit = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      shortDescription: pkg.shortDescription,
      price: pkg.price,
      currency: pkg.currency,
      duration: pkg.duration,
      category: pkg.category,
      features: [...pkg.features],
      includedExtraFeatures: pkg.includedExtraFeatures || [], // Yeni alan
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
      maxRevisions: pkg.maxRevisions,
      deliveryTime: pkg.deliveryTime
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (packageId: string) => {
    if (confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/packages/${packageId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
          alert('Paket başarıyla silindi!');
        } else {
          alert('Paket silinirken hata oluştu.');
        }
      } catch (error) {
        console.error('Paket silinirken hata:', error);
        alert('Paket silinemedi. Lütfen tekrar deneyin.');
      }
    }
  };

  const handleToggleActive = async (packageId: string) => {
    try {
      const pkg = packages.find(p => p.id === packageId);
      if (!pkg) return;

      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...pkg, active: !pkg.isActive }),
      });

      if (response.ok) {
        setPackages(prev => prev.map(p => 
          p.id === packageId ? { ...p, isActive: !p.isActive } : p
        ));
      }
    } catch (error) {
      console.error('Paket durumu güncellenirken hata:', error);
    }
  };

  const handleTogglePopular = async (packageId: string) => {
    try {
      const pkg = packages.find(p => p.id === packageId);
      if (!pkg) return;

      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...pkg, popular: !pkg.isPopular }),
      });

      if (response.ok) {
        setPackages(prev => prev.map(p => 
          p.id === packageId ? { ...p, isPopular: !p.isPopular } : p
        ));
      }
    } catch (error) {
      console.error('Paket popülerlik durumu güncellenirken hata:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: 0,
      currency: 'USD',
      duration: '',
      category: 'web-development',
      features: [''],
      includedExtraFeatures: [], // Yeni alan
      isPopular: false,
      isActive: true,
      maxRevisions: 3,
      deliveryTime: ''
    });
    setEditingPackage(null);
    setIsModalOpen(false);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  // Yeni fonksiyon: Dahil edilen ekstra özellik toggle
  const toggleIncludedExtraFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      includedExtraFeatures: prev.includedExtraFeatures.includes(featureId)
        ? prev.includedExtraFeatures.filter(id => id !== featureId)
        : [...prev.includedExtraFeatures, featureId]
    }));
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'web-development': { label: 'Web Geliştirme', className: 'bg-blue-100 text-blue-800' },
      'mobile-app': { label: 'Mobil Uygulama', className: 'bg-green-100 text-green-800' },
      'ui-ux-design': { label: 'UI/UX Tasarım', className: 'bg-purple-100 text-purple-800' },
      'consulting': { label: 'Danışmanlık', className: 'bg-orange-100 text-orange-800' },
      'maintenance': { label: 'Bakım', className: 'bg-gray-100 text-gray-800' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig];
    
    if (!config) {
      return <Badge className="bg-gray-100 text-gray-800">Bilinmeyen Kategori</Badge>;
    }
    
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatPrice = (price: number, currency: string) => {
    const validCurrency = currency && currency.length === 3 ? currency : 'USD';
    
    try {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: validCurrency
      }).format(price);
    } catch (error) {
      return `${price} ${validCurrency}`;
    }
  };

  const getStats = () => {
    const total = packages.length;
    const active = packages.filter(p => p.isActive).length;
    const popular = packages.filter(p => p.isPopular).length;
    const avgPrice = packages.length > 0 ? packages.reduce((sum, p) => sum + p.price, 0) / packages.length : 0;
    
    return { total, active, popular, avgPrice };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Hizmet paketleri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hizmet Paketleri</h1>
          <p className="text-muted-foreground">
            Hizmet tekliflerinizi ve fiyatlandırma planlarınızı yönetin
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Paket Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Paket</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Paketler</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popüler Paketler</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.popular}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Fiyat</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.avgPrice, 'USD')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Paket ara..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="web-development">Web Geliştirme</option>
              <option value="mobile-app">Mobil Uygulama</option>
              <option value="ui-ux-design">UI/UX Tasarım</option>
              <option value="consulting">Danışmanlık</option>
              <option value="maintenance">Bakım</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Paket bulunamadı</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className={`relative transition-all hover:shadow-lg ${
              pkg.isPopular ? 'ring-2 ring-yellow-400' : ''
            } ${!pkg.isActive ? 'opacity-60' : ''}`}>
              {pkg.isPopular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popüler
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryBadge(pkg.category)}
                      <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                        {pkg.isActive ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {pkg.shortDescription}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(pkg.price, pkg.currency)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Özellikler:</h4>
                    <ul className="space-y-1">
                      {Array.isArray(pkg.features) && pkg.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {Array.isArray(pkg.features) && pkg.features.length > 4 && (
                        <li className="text-sm text-gray-500">
                          +{pkg.features.length - 4} özellik daha
                        </li>
                      )}
                      {!Array.isArray(pkg.features) && (
                        <li className="text-sm text-gray-500">
                          Özellik bilgisi mevcut değil
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Dahil Edilen Ekstra Özellikler */}
                  {pkg.includedExtraFeatures && pkg.includedExtraFeatures.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-green-600">Dahil Edilen Ekstra Özellikler:</h4>
                      <ul className="space-y-1">
                        {pkg.includedExtraFeatures.map((featureId, index) => {
                          const feature = extraFeatures.find(f => f.id === featureId);
                          return feature ? (
                            <li key={index} className="flex items-center text-sm">
                              <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-green-600">{feature.name}</span>
                              <span className="text-xs text-gray-500 ml-2">(₺{feature.price.toLocaleString()} değerinde)</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Teslimat:</span>
                      <p className="text-gray-600">{pkg.deliveryTime}</p>
                    </div>
                    <div>
                      <span className="font-medium">Revizyon:</span>
                      <p className="text-gray-600">{pkg.maxRevisions}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(pkg.id)}
                    >
                      {pkg.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePopular(pkg.id)}
                    >
                      <Star className={`h-4 w-4 ${pkg.isPopular ? 'fill-current text-yellow-500' : ''}`} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal - Karanlık Tema */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {editingPackage ? 'Paket Düzenle' : 'Yeni Paket Ekle'}
              </h2>
              <Button variant="ghost" onClick={resetForm} className="text-white hover:bg-gray-800">
                ×
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Paket Adı</label>
                  <Input
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Paket adını girin"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, category: e.target.value as ServicePackage['category'] }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="web-development">Web Geliştirme</option>
                    <option value="mobile-app">Mobil Uygulama</option>
                    <option value="ui-ux-design">UI/UX Tasarım</option>
                    <option value="consulting">Danışmanlık</option>
                    <option value="maintenance">Bakım</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Kısa Açıklama</label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Kartlar için kısa açıklama"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Detaylı Açıklama</label>
                <Textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detaylı paket açıklaması"
                  rows={4}
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Fiyat</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Para Birimi</label>
                  <select
                    value={formData.currency}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="TRY">TRY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Süre</label>
                  <Input
                    value={formData.duration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="örn: Tek seferlik, Aylık"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Teslimat Süresi</label>
                  <Input
                    value={formData.deliveryTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                    placeholder="örn: 7-10 gün"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Maksimum Revizyon</label>
                  <Input
                    type="number"
                    value={formData.maxRevisions}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, maxRevisions: Number(e.target.value) }))}
                    min="0"
                    required
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Özellikler</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFeature(index, e.target.value)}
                        placeholder="Özellik girin"
                        className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="border-gray-700 text-white hover:bg-gray-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Özellik Ekle
                  </Button>
                </div>
              </div>

              {/* Yeni Bölüm: Dahil Edilen Ekstra Özellikler */}
              <div>
                <label className="block text-sm font-medium mb-3 text-white">Pakete Dahil Edilen Ekstra Özellikler</label>
                <p className="text-sm text-gray-400 mb-4">
                  Bu pakette zaten dahil olan ekstra özellikleri seçin. Seçilen özellikler müşteriler için ücretsiz olacak.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {extraFeatures.map((feature) => (
                    <label key={feature.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.includedExtraFeatures.includes(feature.id)}
                          onChange={() => toggleIncludedExtraFeature(feature.id)}
                          className="mr-3 w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400"
                        />
                        <span className="text-white">{feature.name}</span>
                      </div>
                      <span className="text-green-400 font-semibold text-sm">₺{feature.price.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
                {formData.includedExtraFeatures.length > 0 && (
                  <div className="mt-3 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <p className="text-green-400 text-sm">
                      <strong>Toplam Dahil Edilen Değer:</strong> ₺
                      {formData.includedExtraFeatures
                        .reduce((total, featureId) => {
                          const feature = extraFeatures.find(f => f.id === featureId);
                          return total + (feature ? feature.price : 0);
                        }, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="mr-2"
                  />
                  Popüler Olarak İşaretle
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  Aktif
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                <Button type="button" variant="outline" onClick={resetForm} className="border-gray-700 text-white hover:bg-gray-800">
                  İptal
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingPackage ? 'Paketi Güncelle' : 'Paket Oluştur'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackagesPage;