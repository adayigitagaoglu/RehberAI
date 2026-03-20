# RehberAI - Görev Listesi (Adım Adım)

Bu dosya, `prd.md`’deki hedefe ulaşmak için uygulanabilir bir geliştirme sırasını tarif eder. Öncelik: **MVP çalışır hale getirmek** (rapor girişi -> AI analiz -> 7 günlük plan) ve ardından **akıllı hafıza + sessiz kopuş** mantığını güçlendirmek.

## MVP (v0) - Uçtan Uca Akış

1. [ ] Proje iskeletini kur (React + Tailwind) ve temel sayfa/routing yapısını oluştur (`/input`, `/analysis`, `/plan`).
2. [ ] UI temel tasarımını uygula (pastel mavi/yeşil tema, şefkatli koç dili bileşenleri, buton/ kart stilleri).
3. [ ] “Giriş Ekranı” geliştir: serbest metin + yönlendirici sorular + gönder butonu.
4. [ ] Basit backend/API kur (rapor al -> analiz iste -> yanıt döndür) ve ilk entegrasyon uçlarını oluştur.
5. [ ] Gemini entegrasyonunu kur (Gemini 1.5 Flash için API anahtar env’leri + istem/yanıt akışı).
6. [ ] AI için çıkış şemasını tanımla (ör. `mental_state_summary`, `silent_gaps[]`, `daily_plan[]`, `score`, vb.) ve “kesin JSON” istemi ekle.
7. [ ] JSON doğrulama/parsing uygula (şema uymazsa yeniden deneme / hata bildirimi).
8. [ ] “Analiz Paneli” ekranını uygula: mental durum özeti + sessiz kopuşlar + davranışsal tespitler.
9. [ ] “7 Günlük Esnek Plan” ekranını uygula: 7 kart, her kartın açıklaması ve tamamlandı durumu.
10. [ ] Analiz sırasında süreç mesajları göster (örn. “geçmiş veriler taranıyor…”, “hiyerarşik analiz ediliyor…”).
11. [ ] Analiz sonuçlarını veritabanına kaydet (Reports + Insights).
12. [ ] Günlük görevleri veritabanına kaydet (Daily_Tasks) ve ekrandan tamamlanma bilgisini güncelle.

## Veri Modeli ve Veritabanı (v0+)

13. [ ] Database seçimi yap (örn. PostgreSQL + Prisma/ORM) ve geliştirme ortamını kur.
14. [ ] Şemayı `prd.md` ile birebir uygula:
    - `Users (id, name, target_exam)`
    - `Reports (id, user_id, content, created_at)`
    - `Insights (id, report_id, mental_state_summary, silent_gaps, score)`
    - `Daily_Tasks (id, user_id, task_description, day_index, is_completed)`
15. [ ] Migration/seeding stratejisi oluştur (ilk kullanıcı/örn. örnek curriculum kayıtları için).
16. [ ] Uygulama seviyesinde “rapor/insight ilişkisi” tutarlılığını garanti altına al (backend transaction veya idempotency).

## Akıllı Hafıza (Memory) (v1)

17. [ ] Hafıza context kurgusunu uygula:
    - Kullanıcının **son 4 hafta rapor özeti**
    - Sıklıkla tekrarlanan hatalar ve mental bariyerler
    - Kullanıcının tercih ettiği çalışma saatleri
18. [ ] “Rapor özeti” üretimini tanımla: her yeni rapordan sonra bir özet çıkarıp sakla (örn. `reports_summaries` benzeri ek tablo veya existing mekanizma).
19. [ ] Prompt builder geliştir:
    - Kullanıcı raporu + memory context + sistem rolü
    - Çıktı JSON şemasına uygun formatlama
20. [ ] Memory yoksa (ilk hafta) güvenli fallback davranışı tanımla.

## Sessiz Kopuş (Silent Gap) Algoritması (v1+)

21. [ ] MEB müfredat hiyerarşisini/öncül-öğrenme bağımlılıklarını temsil edecek bir bilgi kaynağı oluştur (veri seti veya DB tabloları).
22. [ ] Silent gap tespiti için konsept->prerequisite sorgu mantığını uygula.
23. [ ] AI çıktısındaki `silent_gaps` elementleri ile prerequisite tablosu arasında bağ kur (eşleştirme stratejisi + fallback).
24. [ ] “Geçmişe dönük nokta atışı” tavsiyesini üret: sadece eksik konuyu değil, kısa tedavi adımlarını da günlük görevlere dönüştür.

## Plan Üretimi ve Dinamik Davranış (v2)

25. [ ] 7 günlük kartların üretim mantığını netleştir:
    - Tamamlanma durumuna göre geri bildirim (suçluluk yok)
    - Daha önce yapılamayan kritik konuların plana dahil edilmesi
26. [ ] Günlük görev tamamlama olayını event olarak ele al (örn. “day_index tamamlandı”).
27. [ ] Haftalık yeniden planlama kuralını tasarla (kullanıcı yeni rapor verdiğinde planı revize et).

## KPI ve Geri Bildirim Mekanizmaları (v2+)

28. [ ] KPI metriklerini ölçümleyebilmek için event/audit altyapısı ekle:
    - Retention (2. hafta rapor yazma dönüşü)
    - Aha! Moment (silent gap teşhisini onaylama oranı)
    - Task Completion (haftalık tamamlanma yüzdesi)
29. [ ] UI’da “Aha!” onay akışını ekle (beğen/geri bildirim).

## Deployment ve Kalite (v2++)

30. [ ] Lovable deployment hazırlığını yap (env’ler, build ayarları, gerekli servis bağlantıları).
31. [ ] Üretim için güvenlik/sağlamlık kontrolleri:
    - Gemini çağrılarında rate limit
    - Hata durumlarında kullanıcıya şeffaf mesaj
    - PII loglamama prensibi
32. [ ] Testleri ekle:
    - Prompt builder + JSON parser birim testleri
    - Backend endpoint entegrasyon testleri (Gemini mock’la)
    - UI smoke testleri (opsiyonel Playwright)

## Çalışma Sırası Notu

- Önce “uçtan uca” çalışsın diye **v0**’ı tamamla (AI JSON çıkışı + plan ekranı).
- Sonra **memory (v1)** ve **silent gap (v1+)** detaylarını güçlendir.
- En son dinamik davranış ve KPI’ları genişlet.

