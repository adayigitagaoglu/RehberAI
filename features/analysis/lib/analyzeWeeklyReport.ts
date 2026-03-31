import type { AnalysisResult } from "../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

type AnalyzeInput = {
  target_exam: string;
  reportText: string;
};

const PERSONA_SYSTEM =
  "Sen yargılamayan, ogrenciye sucluluk hissettirmeyen, Turkiye'deki sinav sistemine (YKS/LGS/Universite) hakim bir egitim kocusun.";

function buildPrompt({ target_exam, reportText }: AnalyzeInput) {
  return `
${PERSONA_SYSTEM}

Gorev:
Kullanicinin haftalik serbest metnini analiz et; mental durumunu degerlendir, davranissal tespitler cikar ve basarisizligin kokenini "sessiz kopuslar" (temel eksiklikler) olarak teshis et. Her sessiz kopus icin kisa, nokta atisi oneriler ve 7 gunluk esnek bir plan uret.

Kapsam:
- "Sessiz kopuslar" icin once ilgili kavrami (or. Uslu Sayilar) sonra prerequisite (or. 9. sinif Uslu Sayilar temeli / alt onkosul) belirt.
- Her sessiz kopusu mutlaka bir ders alanina bagla (or. Matematik, Fizik, Turkce, Biyoloji).
- Plani sucluluk yaratmadan ve gercekci gunluk mini adimlarla yaz.
- 7 gunun tamami kullanilabilir olmali; eger kullanici cok yogunsa her gune "hafif bir secenek" de eklemeyi dusun.

Zorunlu cikti:
Yalnizca gecerli JSON dondur. Markdown code block kullanma. JSON disinda hicbir sey yazma.
Schema:
{
  "mental_state_summary": string,
  "behavioral_findings": string[],
  "silent_gaps": [
    {
      "subject": string,
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
  ]
}

Girdiler:
- target_exam: ${target_exam}
- weekly_report: ${JSON.stringify(reportText)}
YANITI SADECE VE SADECE GECERLI BIR JSON FORMATINDA VER. BASINA, SONUNA VEYA ICINE \`\`\`json GIBI HICBIR MARKDOWN ISARETI VEYA ACIKLAMA METNI EKLEME.
`;
  }

function sanitizeModelResponse(text: string) {
  return String(text ?? "")
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .replace(/```(?:json)?/gi, "")
    .trim();
}

function extractJson(text: string) {
  const trimmed = sanitizeModelResponse(text);
  try {
    return JSON.parse(trimmed);
  } catch {
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("Model yanitindan JSON cikarilamadi.");
    }
    const candidate = trimmed.slice(firstBrace, lastBrace + 1);
    return JSON.parse(candidate);
  }
}

function validateResult(value: unknown): AnalysisResult {
  if (!value || typeof value !== "object") {
    throw new Error("Gecersiz analiz cikti formati.");
  }

  const result = value as Record<string, unknown>;
  if (
    typeof result.mental_state_summary !== "string" ||
    !Array.isArray(result.behavioral_findings) ||
    !Array.isArray(result.silent_gaps) ||
    !Array.isArray(result.daily_plan)
  ) {
    throw new Error("Gecersiz analiz cikti: schema alanlari eksik.");
  }

  return result as unknown as AnalysisResult;
}

export async function analyzeWeeklyReport(input: AnalyzeInput): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("Gemini API key bulunamadi (VITE_GEMINI_API_KEY eksik).");
  }

  const prompt = buildPrompt(input);
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelCandidates = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let text = "";
  let lastError: unknown = null;

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
    const message =
      lastError instanceof Error
        ? lastError.message
        : "Gemini yaniti alinamadi. Lutfen API anahtarinizi kontrol edin.";
    throw new Error(message);
  }

  return validateResult(extractJson(text));
}

