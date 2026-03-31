# RehberAI

# RehberAI - Yapay Zeka Eğitim Koçu

RehberAI, Türkiye'deki sınav öğrencileri (YKS, LGS, Üniversite) için geliştirilmiş, haftalık performans analizine dayalı bir Yapay Zeka Eğitim Koçudur.

## Problem
* Türkiye'de dershaneye veya özel derse erişimi olmayan milyonlarca öğrenci, tek başına çalışırken geri bildirim mekanizmasından mahrum kalmaktadır.
* Mevcut platformlar sadece içerik ve soru çözümüne odaklanmaktadır.
* Öğrencinin çalışma davranışındaki hataları, psikolojik bariyerleri ve geçmiş yıllardan gelen temel eksiklikleri ("sessiz kopuşları") analiz eden bir rehberlik sunulmamaktadır.

## Çözüm ve AI'ın Rolü
RehberAI, sıradan planlama uygulamalarının aksine öğrenciyi yargılamadan dinler. Uygulamanın merkezinde Gemini API yer alır ve şu temel görevleri üstlenir:
* **Doğal Dil Analizi:** Öğrencinin serbest metinle yazdığı haftalık raporlarını okuyarak çalışma davranışını ve zaman yönetimini analiz eder.
* **Sessiz Kopuş Teşhisi:** Mevcut başarısızlığın kökenini bulur.
* **Dinamik Planlama:** Öğrencinin hayat koşullarına uygun, suçluluk hissettirmeyen, esnek ve gerçekçi 7 günlük mini yol haritaları hazırlar.

## Canlı Demo
* **Yayın Linki:** https://rehberai.netlify.app
* **Demo Video:** [Loom video linkini buraya ekle]

## Kullanılan Teknolojiler
Projeyi geliştirmek için modern ve yapay zeka dostu aşağıdaki teknoloji yığını tercih edilmiştir:
* **Frontend (Arayüz):** React + Tailwind CSS.
* **Yapay Zeka Modeli:** Gemini 2.5 Flash (Google AI Studio üzerinden).
* **Geliştirme Ortamı:** Cursor AI.
* **Yayınlama (Deployment):** Netlify.
* **Versiyon Kontrol:** GitHub.

## Geliştiriciler İçin Local Kurulum (Nasıl Çalıştırılır?)
Bu projenin kaynak kodlarını kendi bilgisayarınızda (localhost) test etmek ve geliştirmek isterseniz aşağıdaki adımları izleyebilirsiniz:

1. Repoyu bilgisayarınıza klonlayın:
   git clone [github.com/adayigitagaoglu/RehberAI.git](https://github.com/adayigitagaoglu/RehberAI.git)
2. Proje klasörüne girin ve gerekli bağımlılıkları yükleyin:
   cd RehberAI
   npm install
3. Proje ana dizininde bir .env dosyası oluşturun ve kendi Gemini API anahtarınızı ekleyin:
   VITE_GEMINI_API_KEY=sizin_api_anahtariniz
4. Geliştirme sunucusunu başlatın:
   npm run dev
