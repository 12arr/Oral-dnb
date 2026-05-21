import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  Search,
  MessageSquare,
  Send,
  Loader2,
  ChevronRight,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Cpu,
  RefreshCw,
  CheckCircle2,
  ListRestart
} from "lucide-react";
import { SujetIntro } from "./components/SujetIntro";
import { AvantagesMetiers } from "./components/AvantagesMetiers";
import { ImpactsRisques } from "./components/ImpactsRisques";
import { InteractiveCharts } from "./components/InteractiveCharts";
import { CareerAnalysis, CoachMessage } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"fiches" | "graphs" | "simulator">("fiches");
  const [activeFicheSubtab, setActiveFicheSubtab] = useState<"intro" | "avantages" | "risques">("intro");

  // Job Simulator State
  const [simulatorInput, setSimulatorInput] = useState("");
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [simulatedJob, setSimulatedJob] = useState<CareerAnalysis | null>(null);
  const [simulatorError, setSimulatorError] = useState<string | null>(null);

  // Suggested Jobs for simulator
  const suggestedSimulatorJobs = [
    { name: "Développeur Web", preset: true },
    { name: "Surtout Chauffeur Routier", preset: true },
    { name: "Artisan Boulanger", preset: true },
    { name: "Radiologue (Médecin)", preset: true }
  ];

  // Coach/Jury AI State
  const [chatMessages, setChatMessages] = useState<CoachMessage[]>([]);
  const [currentJuryQuestion, setCurrentJuryQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);
  const [pointsClésAttendus, setPointsClésAttendus] = useState<string[]>([]);
  const [scoreMaitrise, setScoreMaitrise] = useState(25); // progress gauge
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize jury chat on load
  useEffect(() => {
    initiateCoachChat();
  }, []);

  // Scroll to bottom of jury conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const initiateCoachChat = async () => {
    setCoachLoading(true);
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: 0 })
      });
      const data = await response.json();
      if (response.ok) {
        setChatMessages([
          {
            id: "1",
            sender: "coach",
            text: data.scoreFeedback
          },
          {
            id: "2",
            sender: "coach",
            text: data.nextQuestion
          }
        ]);
        setCurrentJuryQuestion(data.nextQuestion);
        setPointsClésAttendus(data.pointsClés || []);
        setScoreMaitrise(25);
      } else {
        throw new Error(data.error || "Impossibe de démarrer le coach.");
      }
    } catch (err: any) {
      console.error(err);
      // Fallback greeting if no network or error
      const msg = "Bonjour Aurel ! Je suis ton coach de jury DNB. L'IA n'a pas pu s'initialiser mais nous pouvons nous entraîner. Choisis une question !";
      setChatMessages([
        {
          id: "err-1",
          sender: "coach",
          text: msg
        },
        {
          id: "err-2",
          sender: "coach",
          text: "Pourquoi as-tu choisi de présenter ce sujet de l'IA sur les métiers pour ton oral ?"
        }
      ]);
      setCurrentJuryQuestion("Pourquoi as-tu choisi de présenter ce sujet de l'IA sur les métiers pour ton oral ?");
      setPointsClésAttendus(["Intérêt personnel pour la technologie", "Sujet d'actualité fort", "Impact sur les futurs emplois"]);
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSendAnswer = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!studentAnswer.trim() || coachLoading) return;

    const userMessageText = studentAnswer;
    setStudentAnswer("");

    // Add student's response to list
    const userMsg: CoachMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userMessageText
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setCoachLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: 1,
          responseText: userMessageText,
          previousQuestion: currentJuryQuestion
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Increment score gauge on successful structured response
        setScoreMaitrise((prev) => Math.min(prev + 18, 100));

        // Add evaluation / new question messages
        const evalId = "eval-" + Date.now();
        setChatMessages((prev) => [
          ...prev,
          {
            id: evalId,
            sender: "coach",
            text: `📝 ÉVALUATION DU JURY :\n${data.scoreFeedback}`,
            scoreFeedback: data.scoreFeedback,
            idealResponse: data.idealResponse,
            pointsClés: data.pointsClés
          },
          {
            id: "q-" + Date.now(),
            sender: "coach",
            text: data.nextQuestion
          }
        ]);
        setCurrentJuryQuestion(data.nextQuestion);
        setPointsClésAttendus(data.pointsClés || []);
      } else {
        throw new Error(data.error || "Le jury a eu un petit problème technique.");
      }
    } catch (err: any) {
      console.error(err);
      // Fallback analysis in case of error
      setChatMessages((prev) => [
        ...prev,
        {
          id: "err-eval",
          sender: "coach",
          text: "Merci pour ta réponse. [Mode Simulation] : Tu as donné des arguments intéressants. Pense toujours à donner des exemples concrets pour illustrer tes citations.",
          scoreFeedback: "Fais des phrases courtes et garde un ton posé.",
          idealResponse: "L'IA réorganise la répartition des tâches en automatisant les activités répétitives mais amplifie les rôles centrés sur l'esprit d'équipe.",
          pointsClés: ["Réactivité", "Secteurs tertiaires", "Complémentarité"]
        },
        {
          id: "err-next-q",
          sender: "coach",
          text: "Selon toi, comment l'Éducation Nationale doit-elle réagir face à des outils d'IA comme ChatGPT pour les devoirs ?"
        }
      ]);
      setCurrentJuryQuestion("Selon toi, comment l'Éducation Nationale doit-elle réagir face à des outils d'IA comme ChatGPT pour les devoirs ?");
    } finally {
      setCoachLoading(false);
    }
  };

  const handleSimulateJob = async (jobNameInput: string) => {
    const query = jobNameInput.trim();
    if (!query) return;

    setSimulatorLoading(true);
    setSimulatorError(null);
    setSimulatedJob(null);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: query })
      });

      const data = await response.json();
      if (response.ok) {
        setSimulatedJob(data);
      } else {
        throw new Error(data.error || "Impossible d'analyser ce métier.");
      }
    } catch (err: any) {
      console.error(err);
      setSimulatorError(
        "Impossible d'interroger le simulateur IA. Voici un aperçu simulé d'erreur ou d'une fiche métier standard."
      );
      // Provide a nice fallback mock for user experience so the interface is never broken
      setSimulatedJob({
        job: query,
        automationChance: 65,
        impactLevel: "Moyen",
        automatableTasks: [
          "Saisie et classement de dossiers",
          "Calcul de prébilles standards",
          "Réponses automatiques aux courriels"
        ],
        humanSkillsSaved: [
          "L'écoute active et l'empathie face au stress",
          "Négociation de cas complexes",
          "Esprit de synthèse et intuition humaine"
        ],
        iaAdvantages: [
          "Recherche de documents 10 fois plus rapide",
          "Réduction des fautes d'inattention",
          "Prise de note automatique en réunion"
        ],
        reconversionAdvice:
          "Pour ce métier, il est capital d'apprendre à rédiger des invites (prompts) efficaces et de se spécialiser dans les relations humaines ou le service haut de gamme.",
        summary: `Le métier de ${query} va voir sa part de travail rébarbatif grandement allégée par l'intelligence artificielle. Cependant, l'expertise, la confiance humaine et le conseil de proximité resteront indispensables.`
      });
    } finally {
      setSimulatorLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 p-4 md:p-6 font-sans text-slate-900 leading-normal">
      {/* Upper header section strictly styled matching "Bento Grid" Design Theme */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4" id="bento-header">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-indigo-600 flex items-center gap-2">
            <Cpu className="w-6 h-6 animate-pulse text-indigo-500" />
            L'IA &amp; Le Futur du Travail
          </h1>
          <p className="text-slate-500 font-medium">
            Support Interactif Orale du DNB • Niveau 3ème d'Excellence
          </p>
        </div>
        
        {/* French Flag badge and student indicator */}
        <div className="flex items-center gap-4 text-left self-end md:self-auto">
          <div className="text-right">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-200 inline-block mb-1">
              Oral de Brevet
            </span>
            <p className="font-bold text-slate-800 text-sm">Épreuve d'Aurel Thiombiano</p>
            <p className="text-xs text-slate-400">Élève de 3e • Lycée Français</p>
          </div>
          <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 via-white to-red-600 p-0.5 rounded-full flex items-center justify-center shadow">
            <div className="h-full w-full bg-white rounded-full flex items-center justify-center font-black text-indigo-600 text-xs shadow-inner">
              DNB
            </div>
          </div>
        </div>
      </header>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
        
        {/* LEFT / MAIN WORKSPACE AREA (8 cols) */}
        <main className="lg:col-span-8 flex flex-col gap-6" id="main-bento-workspace">
          
          {/* Bento Navigation Bar for Tabs */}
          <div className="bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("fiches")}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "fiches"
                  ? "bg-slate-900 text-white shadow"
                  : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
              id="btn-tab-fiches"
            >
              <BookOpen className="w-4 h-4" />
              I/II. Fiches Révisions (Plan)
            </button>
            <button
              onClick={() => setActiveTab("graphs")}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "graphs"
                  ? "bg-slate-900 text-white shadow"
                  : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
              id="btn-tab-graphs"
            >
              <TrendingUp className="w-4 h-4" />
              III. Graphiques &amp; Productivité
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-slate-900 text-white shadow"
                  : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
              id="btn-tab-simulator"
            >
              <Sparkles className="w-4 h-4" />
              IV. Laboratoire / Simulateur
            </button>
          </div>

          {/* TAB 1: PRESENTATION OUTLINES & CHRONO */}
          {activeTab === "fiches" && (
            <div className="bg-white p-6 md:p-8 rounded-5xl border border-slate-200 shadow-sm space-y-6 flex-grow flex flex-col justify-between" id="bento-card-fiches">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      Fiches de soutenance
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                      Fiches Mémo : Présentation Orale DNB
                    </h2>
                  </div>

                  {/* Fiche specific fast-tabs */}
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                    <button
                      onClick={() => setActiveFicheSubtab("intro")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                        activeFicheSubtab === "intro" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Démarrage
                    </button>
                    <button
                      onClick={() => setActiveFicheSubtab("avantages")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                        activeFicheSubtab === "avantages" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Avantages
                    </button>
                    <button
                      onClick={() => setActiveFicheSubtab("risques")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                        activeFicheSubtab === "risques" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Risques &amp; Humain
                    </button>
                  </div>
                </div>

                {/* Subtab body content */}
                <div className="min-h-[300px]" id="memo-subtab-container">
                  {activeFicheSubtab === "intro" && <SujetIntro />}
                  {activeFicheSubtab === "avantages" && <AvantagesMetiers />}
                  {activeFicheSubtab === "risques" && <ImpactsRisques />}
                </div>
              </div>

              {/* Source attribution and quick tip footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between text-xs text-slate-400 gap-2">
                <span>💡 Conseil épreuve : Explique clairement tes transitions entre les parties au jury.</span>
                <span className="font-semibold text-slate-500">Source : Rapport WEF &amp; OCDE 2024</span>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHARTS & METRICS */}
          {activeTab === "graphs" && (
            <div className="bg-white p-6 md:p-8 rounded-5xl border border-slate-200 shadow-sm space-y-6 flex-grow flex flex-col justify-between" id="bento-card-graphs">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    Analyse des données
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                    Graphiques de Gains de Productivité &amp; Risque
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Ces graphiques interactifs sont d'excellentes ressources visuelles à citer lors de ta présentation pour appuyer tes arguments.
                  </p>
                </div>

                <div className="py-2">
                  <InteractiveCharts />
                </div>
              </div>

              {/* Key Bento Stats Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl text-white relative overflow-hidden shadow-sm">
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">
                    Chiffre Clé d'Examen
                  </p>
                  <p className="text-3xl font-black mt-1">97 Millions</p>
                  <p className="text-xs text-indigo-100 mt-2 opacity-90">
                    De nouveaux emplois créés d'ici 2030 grâce à la synergie Homme-Machine (World Economic Forum). L'IA remplace des tâches, pas des métiers entiers.
                  </p>
                </div>

                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-900 shadow-sm flex flex-col justify-center">
                  <p className="text-emerald-800 text-xs font-black uppercase tracking-wider mb-1">
                    Le Saviez-Vous ?
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    65% des enfants d'aujourd'hui en école primaire exerceront des métiers qui n'existent pas encore ! C'est pourquoi apprendre à apprendre est la compétence suprême.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI CAREER SIMULATOR */}
          {activeTab === "simulator" && (
            <div className="bg-white p-6 md:p-8 rounded-5xl border border-slate-200 shadow-sm space-y-6 flex-grow flex flex-col justify-between" id="bento-card-simulator">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                    IA Pratique (Temps réel)
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                    Simulateur de Transition des Métiers
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Écris n'importe quel métier ci-dessous. Notre modèle Gemini va analyser immédiatement son taux d'automatisation potentiel, ses atouts IA et la reconversion conseillée.
                  </p>
                </div>

                {/* Input bar */}
                <div className="space-y-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSimulateJob(simulatorInput);
                    }}
                    className="flex gap-2"
                  >
                    <div className="relative flex-grow">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={simulatorInput}
                        onChange={(e) => setSimulatorInput(e.target.value)}
                        placeholder="Ex : Électricien, Avocat, Chauffeur de Taxi, Designer..."
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white pl-9 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={simulatorLoading || !simulatorInput.trim()}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
                      id="predict-job-btn"
                    >
                      {simulatorLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Analyser
                    </button>
                  </form>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                    <span>Suggestions rapides :</span>
                    {suggestedSimulatorJobs.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSimulatorInput(suggestion.name);
                          handleSimulateJob(suggestion.name);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer transition-colors"
                      >
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulating Loading State */}
                {simulatorLoading && (
                  <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">Génération de l'analyse métier en cours...</p>
                      <p className="text-xs text-slate-500">Gemini évalue les compétences cognitives d'un élève de 3e.</p>
                    </div>
                  </div>
                )}

                {/* Simulated Output Error message displayed securely */}
                {simulatorError && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                    <p className="font-bold flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-4 h-4" /> Analyse assistée par secours local :
                    </p>
                    {simulatorError}
                  </div>
                )}

                {/* Output Analysis Content Grid */}
                {simulatedJob && !simulatorLoading && (
                  <div className="bg-slate-50 rounded-3xl p-5 md:p-6 border border-slate-200/60 shadow-sm space-y-6 animate-fade-in" id="simulator-output-panel">
                    {/* Header values */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Résultats d'évaluation
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                          Impact sur : {simulatedJob.job}
                        </h3>
                      </div>

                      {/* Score circle */}
                      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Automatisation</p>
                          <span className={`text-sm font-black ${
                            simulatedJob.automationChance > 60 ? "text-rose-600" : "text-emerald-600"
                          }`}>
                            {simulatedJob.automationChance}% ({simulatedJob.impactLevel})
                          </span>
                        </div>
                        <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full transition-all duration-700 ${
                              simulatedJob.automationChance > 60 ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${simulatedJob.automationChance}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-medium text-slate-800 leading-relaxed italic">
                      “ {simulatedJob.summary} ”
                    </div>

                    {/* Columns of logic */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Automatable Tasks */}
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700">
                          <AlertTriangle className="w-4 h-4" />
                          Tâches automatisables :
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                          {simulatedJob.automatableTasks.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Human Skills Saved */}
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          Atouts humains préservés :
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                          {simulatedJob.humanSkillsSaved.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      {/* IA Support Advantages */}
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Gains apportés par l'IA :
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                          {simulatedJob.iaAdvantages.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Upskilling Reconversion Advice */}
                    <div className="pt-4 border-t border-slate-200/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                        Conseil d'Adaptation :
                      </span>
                      <p className="text-xs text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200/70 font-medium">
                        {simulatedJob.reconversionAdvice}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips for Oral */}
              {!simulatedJob && !simulatorLoading && (
                <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                  <p className="text-sm text-slate-500">
                    Saisis un métier ci-dessus pour lancer la simulation et tester l’intelligence artificielle !
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR / INTERACTIVE COACH & TRAINER (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col" id="right-bento-sidebar">
          <div className="bg-white p-6 rounded-5xl border border-slate-200 shadow-sm flex flex-col justify-between h-full space-y-6">
            
            {/* Coach Header info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Simulateur de Jury IA
                </span>
                
                <button
                  onClick={initiateCoachChat}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                  title="Réinitialiser l'entretien"
                  id="reset-coach-chat"
                >
                  <ListRestart className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Le Grand Oral DNB : Teste ton entretien
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                Le jury te pose des questions pendant 10 minutes à la fin de ta présentation libre. Réponds à la question ci-dessous, et reçois des critiques constructives en temps réel !
              </p>

              {/* Performance Gauge widget */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Niveau de Maîtrise Jury :</span>
                  <span className="font-mono font-bold text-indigo-600">{scoreMaitrise}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${scoreMaitrise}%` }}
                  />
                </div>
                {scoreMaitrise >= 60 ? (
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    🎉 Excellent niveau ! Tu as de solides arguments pour le Brevet.
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Réponds à plus de questions pour augmenter ta jauge de confiance.
                  </p>
                )}
              </div>
            </div>

            {/* Conversation list box */}
            <div className="flex-grow bg-slate-50 border border-slate-200 rounded-3xl p-4 h-[340px] overflow-y-auto space-y-4 shadow-inner" id="coach-messages-scroller">
              {chatMessages.map((msg, idx) => {
                const isCoach = msg.sender === "coach";
                return (
                  <div key={idx} className={`space-y-1.5 flex flex-col ${isCoach ? "items-start" : "items-end"}`}>
                    
                    {/* Header author tag */}
                    <span className="text-[9px] font-bold text-slate-400 uppercase px-1">
                      {isCoach ? "Jurés d'Examen 3e" : "Ma Réponse"}
                    </span>

                    {/* Chat Bubble card */}
                    <div className={`p-3.5 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                      isCoach
                        ? "bg-white text-slate-800 border border-slate-200/80 shadow-sm"
                        : "bg-indigo-600 text-white shadow-md font-medium"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Nested ideal response box in coach evaluation */}
                      {msg.idealResponse && (
                        <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950 space-y-1.5 text-[11px] font-normal leading-relaxed">
                          <p className="font-bold text-indigo-900 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-indigo-600" />
                            Réponse recommandée (pour impressionner) :
                          </p>
                          <p className="italic">“ {msg.idealResponse} ”</p>
                        </div>
                      )}

                      {/* Inside coach evaluation - points clés à citer */}
                      {msg.pointsClés && msg.pointsClés.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] space-y-1">
                          <p className="font-bold text-slate-500">Mots clés ou arguments à retenir :</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {msg.pointsClés.map((keyword, kIdx) => (
                              <span key={kIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                                #{keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Waiting state with spinner inside conversational list */}
              {coachLoading && (
                <div className="flex items-center gap-2.5 text-slate-400 text-xs p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>Le jury consulte ses notes et réfléchit...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Response area form */}
            <div className="space-y-3 pt-2">
              <form onSubmit={handleSendAnswer} className="flex gap-2">
                <input
                  type="text"
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Écris ta réponse ici..."
                  disabled={coachLoading}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={coachLoading || !studentAnswer.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                  id="submit-student-answer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Suggestive Response Snippets for 3e level test */}
              {pointsClésAttendus.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Suis ces pistes d’arguments :
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {pointsClésAttendus.map((point, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setStudentAnswer((prev) =>
                            prev ? `${prev} De plus, il faut penser aux ${point.toLowerCase()}` : `Je pense que cela concerne ${point.toLowerCase()}`
                          );
                        }}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded text-[9px] font-medium transition-colors text-left"
                      >
                        + Citer : {point}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* Modern footer with French ministry/DNB touch */}
      <footer className="mt-8 text-center text-xs text-slate-400 border-t border-slate-200/50 pt-4">
        <p>© 2026 - Plateforme d'entraînement personnalisée DNB.</p>
        <p className="mt-1">
          Spécialement conçu pour l'évaluation orale d'Aurel T.
          • Dépôt de projet Lycée Français.
        </p>
      </footer>
    </div>
  );
}
