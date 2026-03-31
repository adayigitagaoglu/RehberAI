# RehberAI - Kullanıcı Akışı (User Flow)

Bu belge, Türkiye'deki öğrenciler için geliştirilmiş yapay zeka destekli bir eğitim koçu olan RehberAI uygulamasını kullanan bir öğrencinin adım adım yaşadığı deneyimi tanımlar.

## 1. Karşılama ve Giriş (Onboarding)
* **Kullanıcı Eylemi:** Öğrenci uygulamayı tarayıcı üzerinden açar (rehberai.netlify.app).
* **Ekran:** Modern, motivasyon artırıcı ve estetik bir tema ile hazırlanmış ana sayfa görüntülenir. Bütün başlık ve metin hiyerarşisi (fontlar ve büyüklükler) birbiriyle uyumlu ve düzenlidir. Tüm metinler tam Türkçe karakter uyumluluğuna sahiptir.
* **Sistem Yanıtı:** Kullanıcıyı RehberAI'ın ne olduğu hakkında bilgilendiren kısa bir karşılama metni ve yönlendirme sunulur.

## 2. Öğrenci Bilgisi ve Hedef Belirleme
* **Kullanıcı Eylemi:** Öğrenci, mevcut eğitim durumunu, çalışmak istediği dersleri veya hedefini (örneğin günlük plan oluşturma, motivasyon sağlama) giriş alanına yazar.
* **Ekran:** Kullanıcı dostu, sade bir metin kutusu alanı.
* **Sistem Yanıtı:** Sistem, kullanıcının girdiği bu veriyi yapay zeka analizi için hazırlamaya başlar.

## 3. Yapay Zeka Analizi (İşlem Adımı)
* **Kullanıcı Eylemi:** Öğrenci, değerlendirme butonuna basarak sürecini başlatır.
* **Ekran:** Ekranda uygulamanın arka planda çalıştığını gösteren şık bir "Yükleniyor..." animasyonu belirir. 
* **Sistem Yanıtı:** Sistem, girilen öğrenci bilgilerini Gemini API'ye gönderir ve öğrenciye özel, doğrudan hedefe yönelik eğitim koçluğu tavsiyelerini üretir. 

## 4. Sonuçların Görüntülenmesi (Koçluk Raporu)
* **Kullanıcı Eylemi:** Öğrenci, RehberAI tarafından saniyeler içinde hazırlanan kişiselleştirilmiş çalışma planını ve motivasyon tavsiyelerini okur.
* **Ekran:** Üretilen koçluk raporu; estetik bir renk paletiyle, okunması kolay ve düzenli bilgi kartları/başlıklar halinde sayfada gösterilir. Karmaşık puanlamalar veya gereksiz değerlendirme metinleri olmadan doğrudan net, eyleme geçirilebilir bir plan sunulur.
* **Sistem Yanıtı:** Çıktılar ekrana yansıtılır ve öğrencinin kullanımına hazır hale getirilir.

## 5. İterasyon / Yeni Hedef
* **Kullanıcı Eylemi:** Öğrenci dilerse üretilen bu planı uygulayabilir veya yepyeni bir hedef girerek kendine farklı bir rota çizilmesini isteyebilir.
* **Ekran:** Ekranın altında süreci sıfırlayan veya yeni analiz başlatan net bir buton yer alır.
