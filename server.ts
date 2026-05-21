import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const MODEL_NAME = "gemini-3.5-flash";

// 1. Career Impact Simulator API
app.post("/api/simulate", async (req, res) => {
  try {
    const { job } = req.body;
    if (!job || typeof job !== "string") {
      res.status(400).json({ error: "Le nom du métier est requis." });
      return;
    }

    const systemPrompt = `Tu es un expert en évolution du marché du travail et de l'intelligence artificielle pour les élèves de 3ème. 
Analyse l'impact de l'IA sur le métier demandé ("${job}"). Donne des informations précises, réelles et pédagogiques adaptées au niveau du Brevet des collèges. 
Réponds stricte en JSON en respectant le schéma demandé. Recommande des exemples concrets d'outils ou d'impacts.`;

    const userPrompt = `Fais l'analyse complète de l'impact de l'IA sur le métier de : "${job}".`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            job: { type: Type.STRING, description: "Nom du métier formaté" },
            automationChance: { type: Type.INTEGER, description: "Pourcentage de probabilité d'automatisation des tâches (0 à 100)" },
            impactLevel: { type: Type.STRING, description: "Niveau d'impact global: 'Faible', 'Moyen', 'Fort'" },
            automatableTasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 tâches répétitives ou administratives que l'IA peut faire à la place",
            },
            humanSkillsSaved: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 compétences typiquement humaines qui restent irremplaçables (empathie, habilité manuelle, créativité...)",
            },
            iaAdvantages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 avantages réels que l'IA apporte à ce professionnel pour l'aider au quotidien",
            },
            reconversionAdvice: {
              type: Type.STRING,
              description: "Conseil sur comment ce métier doit évoluer ou quelles compétences apprendre (upskilling)",
            },
            summary: {
              type: Type.STRING,
              description: "Une explication globale d'environ 3-4 de phrases, claire, engageante et accessible à un élève de 3e",
            },
          },
          required: [
            "job",
            "automationChance",
            "impactLevel",
            "automatableTasks",
            "humanSkillsSaved",
            "iaAdvantages",
            "reconversionAdvice",
            "summary",
          ],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Erreur simulateur:", error);
    res.status(500).json({
      error: "Impossible d'analyser ce métier.",
      details: error.message || error,
    });
  }
});

// 2. Interactive Oral DNB Coach API
app.post("/api/coach", async (req, res) => {
  try {
    const { responseText, previousQuestion, stage } = req.body;
    
    // stage is 0 for starting, 1 for continuing
    if (stage === 0) {
      // First initiation: setup welcome and first question
      const welcomeQuestion = {
        scoreFeedback: "Bonjour ! Je suis ton tuteur IA pour la préparation du Brevet des collèges. Je vais jouer le rôle du jury d'examen. Lors de la fin de ta présentation de 5 minutes, le jury te pose des questions pendant 10 minutes. Prêt ? Commençons par une première question d'échauffement !",
        nextQuestion: "Pourquoi as-tu choisi de présenter ce sujet sur l'impact de l'IA sur les métiers pour ton oral du Brevet ?",
        pointsClés: ["Parler de tes motivations personnelles", "Faire un lien rapide avec l'actualité", "Montrer que c'est un sujet d'avenir"],
        isFirst: true
      };
      res.json(welcomeQuestion);
      return;
    }

    if (!responseText || !previousQuestion) {
      res.status(400).json({ error: "La réponse de l'élève et la question précédente sont requises." });
      return;
    }

    const systemPrompt = `Tu es un jury d'examen bienveillant mais rigoureux du Diplôme National du Brevet (DNB) en France pour des élèves de 14-15 ans.
Le sujet présenté par l'élève est : "L'impact de l'intelligence artificielle sur les métiers : impacts et avantages".
Tu as posé la question précédente : "${previousQuestion}".
L'élève vient de te répondre : "${responseText}".

Tu dois analyser sa réponse de manière pédagogique et valorisante, puis lui poser la question suivante du jury (choisis parmi des questions réalistes sur l'impact de l'IA, l'éthique, la disparition des métiers, les avantages, l'apparition de nouveaux métiers, etc.).

Réponds rigoureusement en JSON sous le schéma fourni. Ton feedback doit comporter des compliments sincères sur les bons points, des conseils précis de formulation ou d'arguments pour gagner des points à l'oral (conseils d'élocution, structure, exemples), et une correction/complément si nécessaire.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyse la réponse de l'élève et pose la question suivante du jury.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoreFeedback: {
              type: Type.STRING,
              description: "Appréciation pédagologique constructive sur la réponse de l'élève (points forts et conseils de formulation pour l'oral de 3e, max 4-5 phrases)",
            },
            idealResponse: {
              type: Type.STRING,
              description: "Une version de réponse modèle, concise et structurée, que l'élève aurait pu donner pour impressionner le jury",
            },
            nextQuestion: {
              type: Type.STRING,
              description: "La question suivante posée par le jury de brevet de manière naturelle",
            },
            pointsClés: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 mots ou arguments clés à citer absolument dans la réponse à la nouvelle question",
            },
          },
          required: ["scoreFeedback", "idealResponse", "nextQuestion", "pointsClés"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Erreur coach:", error);
    res.status(500).json({
      error: "Oups, le jury s'est accordé une courte pause ! Essaie de reformuler ou de relancer.",
      details: error.message || error,
    });
  }
});

// Configure Vite or Static Middleware
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`);
  });
}

startServer();
