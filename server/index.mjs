import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(
  cors({
    origin: true
  }),
);
app.use(express.json({ limit: "1mb" }));

const PERSONA_SYSTEM = `Sen yargılamayan, öğrenciye suçluluk hissettirmeyen, Türkiye'deki sınav sistemine (YKS/LGS/Üniversite) hakim bir eğitim koçusun.`;

function buildPrompt({ target_exam, reportText }) {
  return `
${PERSONA_SYSTEM}

Görev:
Kullanıcının haftalık serbest metnini analiz et; mental durumunu değerlendir, davranışsal tespitler çıkar ve başarısızlığın kökenini "sessiz kopuşlar" (temel eksiklikler) olarak teşhis et. Her sessiz kopuş için kısa, nokta atışı öneriler ve 7 günlük esnek bir plan üret.

Kapsam:
- "Sessiz kopuşlar" için önce ilgili kavramı (ör. Üslü Sayılar) sonra prerequisite (ör. 9. sınıf Üslü Sayılar temeli / alt önkoşul) belirt.
- Planı suçluluk yaratmadan ve gerçekçi günlük mini adımlarla yaz.
- 7 günün tamamı kullanılabilir olmalı; eğer kullanıcı çok yoğunsa her güne "hafif bir seçenek" de eklemeyi düşün.

Zorunlu çıktı:
Yalnızca geçerli JSON döndür. Markdown code block kullanma. JSON dışında hiçbir şey yazma.
Schema:
{
  "mental_state_summary": string,
  "behavioral_findings": string[],
  "silent_gaps": [
    {
      "concept": string,
      "prerequisite": string,
      "diagnosis": string,
      "evidence": string,
      "recommendedNextSteps": string[]
    }
  ],
  "daily_plan": [
    {
      "day_index": number,
      "title": string,
      "guidance": string,
      "tasks": [
        {
          "task_description": string,
          "estimated_minutes": number,
          "silent_gap_link": string
        }
      ]
    }
  ],
  "score": number
}

Girdiler:
- target_exam: ${target_exam}
- weekly_report: ${JSON.stringify(reportText)}
`;
}

function extractJson(text) {
  const trimmed = String(text ?? "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Model yanıtından JSON çıkarılamadı.");
    }
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    return JSON.parse(candidate);
  }
}

function validateResult(value) {
  if (!value || typeof value !== "object") {
    throw new Error("Geçersiz analiz çıktısı: nesne bekleniyor.");
  }

  if (
    typeof value.mental_state_summary !== "string" ||
    !Array.isArray(value.behavioral_findings) ||
    !Array.isArray(value.silent_gaps) ||
    !Array.isArray(value.daily_plan) ||
    typeof value.score !== "number"
  ) {
    throw new Error("Geçersiz analiz çıktısı: şema alanları eksik.");
  }

  return value;
}

async function analyzeWeeklyReportServer({ target_exam, reportText }) {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key bulunamadı (VITE_GEMINI_API_KEY eksik).");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildPrompt({ target_exam, reportText });

  // Prefer requested model first, then gracefully fall back if endpoint/model availability changes.
  const modelCandidates = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let lastError = null;
  let text = "";

  for (const candidate of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: candidate });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!text) {
    throw new Error(
      lastError?.message ??
        "Gemini yanıtı alınamadı. Lütfen model erişimini ve API anahtarını kontrol edin.",
    );
  }

  const parsed = extractJson(text);
  return validateResult(parsed);
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { target_exam, reportText } = req.body ?? {};
    if (typeof target_exam !== "string" || typeof reportText !== "string") {
      return res.status(400).json({ message: "target_exam ve reportText zorunlu." });
    }
    if (reportText.trim().length < 20) {
      return res.status(400).json({ message: "Rapor metni en az 20 karakter olmalı." });
    }

    const analysisResult = await analyzeWeeklyReportServer({ target_exam, reportText });
    return res.json(analysisResult);
  } catch (err) {
    const message = err?.message ?? "Beklenmeyen bir hata oluştu.";
    return res.status(500).json({ message });
  }
});

const port = 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] API listening on http://localhost:${port}`);
});

