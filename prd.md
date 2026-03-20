# 📄 Product Requirement Document (PRD): RehberAI


## 1. Ürün Vizyonu ve Özeti
**RehberAI**, Türkiye'deki sınav öğrencileri (YKS, LGS, Üniversite) için geliştirilmiş, haftalık performans analizine dayalı bir **Yapay Zeka Eğitim Koçu**dur. 

Sıradan planlama uygulamalarından farkı; öğrenciyi yargılamadan dinlemesi, geçmiş haftaları hatırlayarak gelişim takibi yapması ve başarısızlığın kök nedenini geçmiş yıllardaki **"sessiz kopuşlara"** (temel eksikliklere) bağlayarak tedavi edici bir plan sunmasıdır.

---

## 2. Kullanıcı Deneyimi (User Journey)

### 2.1. Giriş ve Raporlama (Input Screen)
* **Açıklama:** Kullanıcının haftasını "döktüğü" minimal arayüz.
* **Özellikler:** * Serbest metin giriş alanı (Haftalık çalışma raporu).
    * Yönlendirici sorular: "Bu hafta seni en çok ne zorladı?", "Hangi konularda odaklanma sorunu yaşadın?"
* **Mantık:** Kullanıcı ne kadar doğal anlatırsa, AI o kadar derin analiz yapar.

### 2.2. Analiz ve Teşhis Paneli (Analysis Dashboard)
* **Açıklama:** Yapay zekanın "röntgen" çektiği ekran. Plan kalitesi için derin düşünme (Deep Reasoning) süreci burada gerçekleşir.
* **Çıktılar:**
    * **Mental Durum Analizi:** Kullanıcının kaygı seviyesi ve motivasyon takibi.
    * **Sessiz Kopuş Teşhisi:** (Örn: "Logaritma yapamıyorsun çünkü 9. Sınıf Üslü Sayılar temelin eksik.")
    * **Davranışsal Tespitler:** Zaman yönetimi hataları ve odaklanma paternleri.

### 2.3. 7 Günlük Esnek Plan (Action Plan)
* **Açıklama:** Suçluluk hissettirmeyen, öğrencinin hayat ritmine uygun dinamik liste.
* **Özellikler:** * 7 adet günlük kart.
    * "Esnek Yapı": Günlük görevlerin tamamlanma durumuna göre dinamik geri bildirim.
    * Önceki haftalarda yapılamayan kritik konuların plana dahil edilmesi.

---

## 3. Teknik Gereksinimler & Stack

| **Frontend** React + Tailwind CSS
| **Yapay Zeka** Gemini 1.5 Flash 
| **Geliştirme** Cursor 
| **Deployment** Lovable 
| **Versiyon Kontrol** GitHub

---

## 4. Akıllı Hafıza ve Analiz Mantığı

### 4.1. Uzun Süreli Hafıza (Memory)
Uygulama her seferinde sıfırdan başlamaz. Gemini 1.5 Flash modeline her analizde şu veriler "Context" olarak verilir:
* Kullanıcının önceki 4 haftalık rapor özeti.
* Sıklıkla tekrarlanan hatalar ve mental bariyerler.
* Kullanıcının tercih ettiği çalışma saatleri.

### 4.2. Sessiz Kopuş (Silent Gap) Algoritması
Yapay zeka, MEB müfredat hiyerarşisine hakim bir "Sistem Rolü" ile çalışır. Bir konuda başarısızlık tespit edildiğinde, o konunun öncülü olan (prerequisite) alt konuları veritabanından sorgular ve öğrenciye "geçmişe dönük" nokta atışı tavsiye verir.

---

## 5. Veri Şeması (Database Schema)

* **Users Table:** `id`, `name`, `target_exam` (YKS/LGS/Uni).
* **Reports Table:** `id`, `user_id`, `content` (Metin), `created_at`.
* **Insights Table:** `id`, `report_id`, `mental_state_summary`, `silent_gaps` (JSON), `score`.
* **Daily_Tasks Table:** `id`, `user_id`, `task_description`, `day_index`, `is_completed`.

---

## 6. Tasarım İlkeleri (UI/UX)
* **Dil:** Yargılamayan, şefkatli ve profesyonel bir koç dili.
* **Renk Paleti:** Odaklanmayı artıran soft tonlar (Pastel mavi/yeşil).
* **Geri Bildirim:** Analiz sırasında kullanıcıya "Geçmiş verilerin taranıyor...", "Eksiklerin hiyerarşik olarak analiz ediliyor..." gibi süreç bilgisi verilmelidir.

---

## 7. Başarı Metrikleri (KPI)
* **Retention:** Kullanıcının 2. haftada rapor yazmak için geri dönme oranı.
* **Aha! Moment:** Kullanıcının "Sessiz Kopuş" teşhisini onaylama (beğenme) oranı.
* **Task Completion:** Planlanan görevlerin haftalık tamamlanma yüzdesi.