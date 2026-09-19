import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Empathetic reproductive health AI consultation endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, cycleContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Pesan tidak boleh kosong." });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback response when API key is not configured
      const userLastMessage = messages[messages.length - 1]?.content || "";
      const lower = userLastMessage.toLowerCase();

      let fallbackText = "Halo, saya di sini siap mendengarkan dan mendukungmu. ";
      if (lower.includes("sakit") || lower.includes("kram") || lower.includes("nyeri")) {
        fallbackText += "Untuk meredakan kram atau nyeri haid, kamu bisa mencoba kompres hangat di perut bagian bawah, mandi air hangat, minum teh chamomile/jahe hangat, dan istirahat yang cukup. Jika nyeri sangat hebat dan mengganggu aktivitas, jangan ragu untuk berkonsultasi dengan dokter.";
      } else if (lower.includes("subur") || lower.includes("ovulasi")) {
        fallbackText += "Masa subur biasanya terjadi sekitar 5 hari sebelum ovulasi hingga 1 hari setelah ovulasi. Ovulasi umumnya terjadi sekitar 14 hari sebelum hari pertama haid berikutnya.";
      } else if (lower.includes("telat") || lower.includes("terlambat")) {
        fallbackText += "Keterlambatan haid bisa dipengaruhi oleh stres, perubahan berat badan, kelelahan, ketidakseimbangan hormon, atau kehamilan. Cobalah tetap tenang dan perhatikan kondisi tubuhmu.";
      } else {
        fallbackText += "Setiap fase dalam siklus kewanitaan membawa perubahan hormonal alami. Dengarkan tubuhmu dan berikan waktu istirahat yang cukup.";
      }
      fallbackText += "\n\nCatatan Edukatif: Informasi ini bersifat perkiraan dan edukasi umum, serta tidak menggantikan pemeriksaan atau saran medis resmi dari dokter.";

      res.json({ reply: fallbackText });
      return;
    }

    // Prepare system instructions with cycle context if available
    let contextPrompt = "Kamu adalah asisten kesehatan reproduksi wanita yang sangat suportif, ramah, dan penuh empati. ";
    contextPrompt += "Tugasmu adalah membantu pengguna memahami siklus haid, ovulasi, masa subur, fase folikular, fase luteal, dan kesehatan reproduksi secara umum. ";
    contextPrompt += "Berikan jawaban yang ringkas, menenangkan, jelas, mudah dipahami, dan gunakan bahasa Indonesia yang hangat. ";
    contextPrompt += "Di akhir jawaban atau bagian yang relevan, sertakan catatan edukatif singkat bahwa saran ini bersifat perkiraan/informasi umum dan tidak menggantikan konsultasi medis resmi dengan dokter atau tenaga kesehatan.";

    if (cycleContext) {
      contextPrompt += `\n\nData Siklus Pengguna Saat Ini:\n- Hari Pertama Haid Terakhir: ${cycleContext.lmpDate || "Belum diisi"}\n- Rata-rata Durasi Siklus: ${cycleContext.cycleLength || 28} hari\n- Durasi Haid: ${cycleContext.periodLength || 5} hari\n- Fase Siklus Saat Ini: ${cycleContext.currentPhase || "Tidak diketahui"}\n- Hari menuju haid berikutnya: ${cycleContext.daysUntilPeriod !== undefined ? cycleContext.daysUntilPeriod + " hari" : "Tidak diketahui"}`;
    }

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.6,
        maxOutputTokens: 1000,
      },
    });

    const reply = response.text || "Terima kasih telah berbagi. Saya siap mendengarkan dan membantu menjawab pertanyaanmu.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Terjadi kendala saat memproses jawaban. Silakan coba lagi sebentar lagi.",
      details: error?.message,
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

startServer();
