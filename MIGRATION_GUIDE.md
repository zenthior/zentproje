# 🛡️ Güvenli Migration Kılavuzu

Bu kılavuz, yeni özellik eklerken veritabanı verilerinizi kaybetmemeniz için oluşturulmuştur.

## 🚨 Problem

Yeni özellik eklerken `npx prisma migrate reset --force` komutunu kullanmak zorunda kalıyorsunuz ve bu durumda:
- Tüm kullanıcı kayıtları
- Eklenen projeler
- Hizmet paketleri
- Siparişler
- Hikayeler
- Diğer tüm veriler **SİLİNİYOR**

## ✅ Çözüm

Artık güvenli migration komutları kullanabilirsiniz:

### 🔄 Yeni Özellik Eklerken (Güvenli Migration)

```bash
# Eski yöntem (VERİLER SİLİNİR) ❌
npx prisma migrate reset --force

# Yeni güvenli yöntem (VERİLER KORUNUR) ✅
npm run db:migrate:safe
```

### 📦 Manuel Yedekleme/Geri Yükleme

```bash
# Veritabanını yedekle
npm run db:backup

# En son yedeği geri yükle
npm run db:restore

# Güvenli reset (yedekle + sıfırla + geri yükle)
npm run db:reset:safe
```

## 🔧 Nasıl Çalışır?

1. **Yedekleme**: Tüm tablolardan veriler JSON formatında yedeklenir
2. **Migration**: Prisma migration işlemi gerçekleştirilir
3. **Geri Yükleme**: Yedeklenen veriler yeni şemaya uygun şekilde geri yüklenir

## 📁 Yedek Dosyaları

- Yedekler `backups/` klasöründe saklanır
- Dosya adı formatı: `backup-YYYY-MM-DDTHH-mm-ss-sssZ.json`
- Her yedek dosyası timestamp içerir

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Alan Ekleme
```bash
# schema.prisma'da yeni alan eklediniz
npm run db:migrate:safe
# Verileriniz korunur! ✅
```

### Senaryo 2: Tablo İlişkisi Değiştirme
```bash
# İlişkileri değiştirdiniz
npm run db:migrate:safe
# Verileriniz korunur! ✅
```

### Senaryo 3: Acil Durum Geri Yükleme
```bash
# Bir şeyler ters gitti, en son yedeği geri yükle
npm run db:restore
```

## ⚠️ Önemli Notlar

1. **İlk Kullanım**: İlk kez kullanmadan önce mevcut verilerinizi yedekleyin
2. **Foreign Key**: Geri yükleme sırasında foreign key kısıtlamaları dikkate alınır
3. **Yedek Boyutu**: Büyük veritabanları için yedek dosyaları büyük olabilir
4. **Test Ortamı**: Önce test ortamında deneyin

## 🚀 Hızlı Başlangıç

```bash
# 1. Mevcut verileri yedekle
npm run db:backup

# 2. Artık güvenle migration yapabilirsiniz
npm run db:migrate:safe

# 3. Her şey yolunda! Verileriniz korundu ✅
```

---

**Artık yeni özellik eklerken verilerinizi kaybetme korkusu yaşamayacaksınız!** 🎉