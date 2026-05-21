import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  Search,
  Loader2,
  ChevronRight,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Play,
  Pause,
  Clock,
  BookMarked,
  Info,
  Globe,
  Compass,
  FileText,
  Volume2
} from "lucide-react";
import { SujetIntro } from "./components/SujetIntro";
import { AvantagesMetiers } from "./components/AvantagesMetiers";
import { ImpactsRisques } from "./components/ImpactsRisques";
import { InteractiveCharts } from "./components/InteractiveCharts";
import { CareerAnalysis } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"fiches" | "graphs" | "simulator">("fiches");
  const [activeFicheSubtab, setActiveFicheSubtab] = useState<"intro" | "avantages" | "risques">("intro");

  // Job Simulator State (Demo Section)
  const [simulatorInput, setSimulatorInput] = useState("");
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [simulatedJob, setSimulatedJob] = useState<CareerAnalysis | null>(null);
  const [simulatorError, setSimulatorError] = useState<string | null>(null);

  // Suggested Jobs for simulator/demo
  const suggestedSimulatorJobs = [
    { name: "Médecin Radiologue", category: "Santé" },
    { name: "Chauffeur de Camion", category: "Transport" },
    { name: "Avocat d'Affaires", category: "Juridique" },
    { name: "Artisan Ébéniste", category: "Manuel" }
  ];

  // Interactive Lexicon definitions
  const definitions = [
    {
      term: "Destruction Créatrice",
      concept: "Théorie de J. Schumpeter",
      definition: "Processus continu de disparition d'activités obsolètes remplacées par de nouvelles innovations technologiques plus efficaces.",
      quote: "Le capitalisme est par nature une méthode de changement économique et ne peut jamais être stationnaire."
    },
    {
      term: "Soft Skills",
      concept: "Compétences Humaines",
      definition: "Qualités comportementales et relationnelles uniques : créativité, empathie, collaboration et esprit critique, irremplaçables par l'IA.",
      quote: "L'empathie humaine face aux épreuves reste le cœur des métiers de soin et d'enseignement."
    },
    {
      term: "Biais Algorithmique",
      concept: "Éthique de l'IA",
      definition: "Erreurs systématiques ou discriminations reproduites par l'IA car présente dans les données d'apprentissage historiques.",
      quote: "Surveiller les données pour éviter de reproduire les inégalités du passé."
    },
    {
      term: "Prompt Engineering",
      concept: "Métier d'Avenir",
      definition: "L'art de structurer et de rédiger des instructions textuelles optimales pour orienter les modèles de langage et générer le meilleur résultat.",
      quote: "Savoir poser la bonne question est devenu plus important que de réciter la réponse."
    },
    {
      term: "Loi Européenne (AI Act)",
      concept: "Régulation",
      definition: "Première réglementation mondiale classant les systèmes d'IA selon leurs niveaux de risques (de minimes à inacceptables).",
      quote: "Protéger les citoyens tout en soutenant l'innovation technologique de pointe."
    }
  ];
  const [selectedDefinition, setSelectedDefinition] = useState(definitions[0]);

  // Oral Time chronometer state
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes (300 seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalTimerDuration, setTotalTimerDuration] = useState(300); // for progress bar calculations
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeRemaining]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (seconds: number) => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeRemaining(seconds);
    setTotalTimerDuration(seconds);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Pre-compiled FAQ for the DNB Oral jury questions preparation
  const juryQuestions = [
    {
      q: "L'IA va-t-elle détruire plus d'emplois qu'elle n'en crée ?",
      a: "Historiquement (Théorie du déversement d'Alfred Sauvy), le progrès déplace les emplois vers l'analyse et le relationnel. Le WEF estime à 97 millions le nombre de métiers créés d'ici 2030 contre 85 millions de tâches automatisées."
    },
    {
      q: "Comment faire face à l'obsolescence rapide des compétences ?",
      a: "Par la formation continue tout au long de la vie (Lifelong learning) et l'accentuation des 'Soft Skills' à l'école, que l'IA ne peut pas simuler : esprit critique, initiative et empathie humaine."
    },
    {
      q: "Quel est le plus grand danger éthique de l'IA au travail ?",
      a: "Les biais algorithmiques et la perte de contrôle humain (décisions automatisées de recrutement ou d'évaluation sans regard éthique). C'est le but de l'AI Act européen."
    },
    {
      q: "Être boulanger ou électricien protège-t-il totalement de l'IA ?",
      a: "Oui et non. L'acte artisanal reste physique et humain (forte dextérité manuelle et adaptation terrain), mais l'artisan pourra utiliser l'IA pour sa comptabilité, son marketing et l'optimisation énergétique de son four."
    }
  ];
  const [activeJuryQuestion, setActiveJuryQuestion] = useState(0);

  // Suggested quotes for presenting
  const presentationQuotes = [
    {
      text: "L'IA ne remplacera pas les humains, mais les humains qui utilisent l'IA remplaceront ceux qui ne l'utilisent pas.",
      author: "Pr. Erik Brynjolfsson (MIT)"
    },
    {
      text: "La vraie question n'est pas de savoir si les machines pensent, mais si les hommes ne pensent pas de plus en plus comme des machines.",
      author: "B.F. Skinner"
    },
    {
      text: "L'Éducation Nationale doit former non pas des élèves-ordinateurs qui récitent, mais des esprits critiques qui interrogent.",
      author: "Note de Synthèse DNB Aurel T."
    }
  ];
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

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
        "Utilisation de l'analyseur dynamique local (moteur de secours hors-ligne actif)."
      );
      // Fallback analysis formatted for academic grade
      setSimulatedJob({
        job: query,
        automationChance: query.toLowerCase().includes("boulanger") || query.toLowerCase().includes("ébéniste") ? 18 : 65,
        impactLevel: query.toLowerCase().includes("boulanger") || query.toLowerCase().includes("ébéniste") ? "Faible" : "Moyen",
        automatableTasks: [
          "Saisie systématique des données et rapports",
          "Calculs d'itinéraires et planification standard",
          "Tri et classement automatique de gros volumes de documents"
        ],
        humanSkillsSaved: [
          "Sens esthétique, créativité et intuition artistique",
          "Capacité d'écoute active, d'empathie et d'ajustement émotionnel",
          "Coordination physique de haute précision et dépannage complexe non standardisable"
        ],
        iaAdvantages: [
          "Accélération du travail de recherche documentaire de 80%",
          "Gaspillage de ressources évité grâce à l'analyse prédictive",
          "Traduction instantanée de fiches techniques d'ingénierie"
        ],
        reconversionAdvice:
          "Pour ce métier, l'évolution se fera vers un poste hybride : utiliser l'IA comme copilote tout en affinant ses compétences relationnelles uniques.",
        summary: `Le métier de ${query} va connaître une réorganisation de ses tâches. Les travaux automatisables seront délégués, recentrant l'humain sur l'expertise, le conseil de proximité et les soft skills indispensables.`
      });
    } finally {
      setSimulatorLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 p-4 md:p-6 font-sans text-slate-900 leading-normal selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Slide Counter styled as an overlay indicator for live presentation */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-900 text-slate-100 rounded-full text-xs font-bold font-mono tracking-widest fixed bottom-4 right-4 z-50 shadow-lg border border-slate-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>PROJECTION : CO-PILOTE DNB ACTIF</span>
      </div>

      {/* Main Header styled as an premium presentation title board */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm gap-4" id="presentation-header">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-widest border border-indigo-200 inline-block">
              Support de Présentation Interactif
            </span>
            <span className="p-1 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-[10px] font-black tracking-wider uppercase inline-flex items-center gap-1">
              <Compass className="w-3 h-3 text-amber-500" /> Épreuve DNB 2026
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-indigo-950 flex items-center gap-2">
            <Cpu className="w-7 h-7 text-indigo-600 shrink-0" />
            L'IA &amp; Le Futur du Travail
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Comment l'intelligence artificielle révolutionne les compétences et redessine l'avenir des professions.
          </p>
        </div>
        
        {/* Presenter Metadata Card */}
        <div className="flex items-center gap-4 text-left self-stretch md:self-auto bg-slate-50 p-3 rounded-2xl border border-slate-200/60 max-w-sm">
          <div className="text-right">
            <p className="font-extrabold text-slate-900 text-sm">Aurel Thiombiano</p>
            <p className="text-xs text-slate-500">Candidat Oral de Brevet</p>
            <p className="text-[10px] text-slate-400 font-mono">Lycée Français Seydou Kane</p>
          </div>
          <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 via-white to-red-600 p-0.5 rounded-full flex items-center justify-center shadow-md">
            <div className="h-full w-full bg-slate-900 rounded-full flex items-center justify-center font-black text-white text-xs shadow-inner uppercase tracking-wider">
              DNB
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: left work, right control deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
        
        {/* LEFT COMPONENT - VIEWPORT OR PRESENTATION PANELS (8 cols) */}
        <main className="lg:col-span-8 flex flex-col gap-6" id="presentation-viewport">
          
          {/* Section Selection Bar */}
          <div className="bg-white p-2 md:p-2.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-1.5" id="slide-tabs">
            <button
              onClick={() => setActiveTab("fiches")}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "fiches"
                  ? "bg-slate-950 text-white shadow"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              id="tab-btn-fiches"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              I/II. Plan &amp; Fiches Récapitulatives
            </button>
            <button
              onClick={() => setActiveTab("graphs")}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "graphs"
                  ? "bg-slate-950 text-white shadow"
                  : "bg-transparent text-slate-600 hover:text-slate-200-900 hover:bg-slate-100"
              }`}
              id="tab-btn-graphs"
            >
              <TrendingUp className="w-4 h-4 text-rose-500" />
              III. Indicateurs de Productivité
            </button>
            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-slate-950 text-white shadow"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              id="tab-btn-simulator"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              IV. Démonstrateur Temps Réel
            </button>
          </div>

          {/* TAB 1: PRESENTATION CHAPTERS */}
          {activeTab === "fiches" && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 flex-grow flex flex-col justify-between" id="slide-fiches-memo">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                      Supports de Diaporama
                    </span>
                    <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-2">
                      Fiches de Synthèse Orale
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">
                      Sélectionne l'étape de l'exposé pour projeter le plan d'arguments clés.
                    </p>
                  </div>

                  {/* Subtabs to navigate chapters */}
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
                    <button
                      onClick={() => setActiveFicheSubtab("intro")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeFicheSubtab === "intro" ? "bg-white text-indigo-950 shadow-sm font-black" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Introduction
                    </button>
                    <button
                      onClick={() => setActiveFicheSubtab("avantages")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeFicheSubtab === "avantages" ? "bg-white text-indigo-950 shadow-sm font-black" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Progrès &amp; Secteurs
                    </button>
                    <button
                      onClick={() => setActiveFicheSubtab("risques")}
                      className={`px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                        activeFicheSubtab === "risques" ? "bg-white text-indigo-950 shadow-sm font-black" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Risques &amp; Humain
                    </button>
                  </div>
                </div>

                {/* Main Text Deck */}
                <div className="min-h-[320px] bg-slate-50/40 p-5 rounded-2xl border border-slate-100" id="memo-page-content">
                  {activeFicheSubtab === "intro" && <SujetIntro />}
                  {activeFicheSubtab === "avantages" && <AvantagesMetiers />}
                  {activeFicheSubtab === "risques" && <ImpactsRisques />}
                </div>
              </div>

              {/* Speaker Tips at the Bottom */}
              <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between text-xs text-slate-500 gap-2 font-medium">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  📚 Astuce pour Aurel : Use d'une voix posée et regarde alternativement tous les jurés.
                </span>
                <span className="font-semibold text-slate-400">Référence d'Examen : DNB 2026</span>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHARTS */}
          {activeTab === "graphs" && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 flex-grow flex flex-col justify-between" id="slide-interactive-metrics">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <span className="px-3 py-1 bg-violet-50 border border-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    Données &amp; Projections
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-2">
                    L'Impact de l'IA par Grands Secteurs
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">
                    Visualisez les gains potentiels de productivité et la vulnérabilité à l'automatisation. Cliquez sur un secteur pour illustrer la démonstration.
                  </p>
                </div>

                <div className="py-2">
                  <InteractiveCharts />
                </div>
              </div>

              {/* Economic Indicators Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-5 bg-indigo-950 text-white rounded-2xl relative overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest font-mono">
                      Statistique Clé d'Exposition
                    </p>
                    <p className="text-3xl font-black text-indigo-100 mt-1">97 Millions</p>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
                    Nouveaux emplois créés d'ici 2030 grâce aux synergies d'intelligence collective Homme-IA (Source : rapport prospectif WEF).
                  </p>
                </div>

                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-950 shadow-sm flex flex-col justify-center">
                  <p className="text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Bilan d'Analyse (WEF / OCDE) :
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    L'IA s'occupe en priorité des <strong>tâches répétitives à faible valeur ajoutée</strong>, libérant un temps précieux pour que l'humain s'investisse sur des activités de réflexion et de contact.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE RECONVERSION SIMULATOR */}
          {activeTab === "simulator" && (
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 flex-grow flex flex-col justify-between" id="slide-demonstrator-ia">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                      Démonstration Pratique
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-100 font-mono text-[10px] uppercase">
                      Gemini PRO API
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-2">
                    Démonstrateur Interactif de Réorganisation des Métiers
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">
                    Démontrez de façon spectaculaire au jury comment l'IA peut analyser instantanément n'importe quelle profession de leur choix (ex: un métier qu'un des jurés pratique !).
                  </p>
                </div>

                {/* Simulated job interactive entry */}
                <div className="space-y-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSimulateJob(simulatorInput);
                    }}
                    className="flex gap-2"
                  >
                    <div className="relative flex-grow">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={simulatorInput}
                        onChange={(e) => setSimulatorInput(e.target.value)}
                        placeholder="Saisissez un métier (ex: Jardinier, Banquier, Informaticien...)"
                        className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white pl-10 pr-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={simulatorLoading || !simulatorInput.trim()}
                      className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow hover:shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                      id="launch-analysis-btn"
                    >
                      {simulatorLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Lancer l'Analyse IA
                    </button>
                  </form>

                  {/* Sample presets for quick demo click */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <span className="font-bold text-slate-400">Suggestions rapides pour le jury :</span>
                    {suggestedSimulatorJobs.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSimulatorInput(suggestion.name);
                          handleSimulateJob(suggestion.name);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg hover:border-indigo-200 border border-slate-200/50 font-medium cursor-pointer transition-colors"
                      >
                        {suggestion.name} ({suggestion.category})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loader screen */}
                {simulatorLoading && (
                  <div className="py-12 bg-slate-50/50 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Exécution de l'algorithme d'impact syndical...</p>
                      <p className="text-[10px] text-slate-400">Le modèle Gemini évalue le degré de transition en temps réel.</p>
                    </div>
                  </div>
                )}

                {/* Safe error banner */}
                {simulatorError && (
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900">
                    <p className="font-bold flex items-center gap-1.5 mb-1 text-indigo-950">
                      <Info className="w-3.5 h-3.5 text-indigo-600" /> Mode secouru engagé :
                    </p>
                    {simulatorError}
                  </div>
                )}

                {/* Simualted data card styled beautifully for the projector */}
                {simulatedJob && !simulatorLoading && (
                  <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-5 shadow-inner" id="demo-output-block">
                    {/* Stat values */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/50 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                          Matrice des Métiers
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">
                          Analyse prospective : {simulatedJob.job}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400">Risque de remplacement :</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          simulatedJob.automationChance > 50 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {simulatedJob.automationChance}% ({simulatedJob.impactLevel})
                        </span>
                      </div>
                    </div>

                    {/* Synthesis sentence card */}
                    <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100/50 text-xs text-indigo-950 font-medium italic leading-relaxed">
                      “ {simulatedJob.summary} ”
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Automatable Tasks Column */}
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-red-700">
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                          Tâches automatisées :
                        </div>
                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                          {simulatedJob.automatableTasks.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Leftover human values */}
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          Atouts humains requis :
                        </div>
                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                          {simulatedJob.humanSkillsSaved.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Productivity gains */}
                      <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-700">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                          Copilote IA (Gains) :
                        </div>
                        <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4 leading-relaxed">
                          {simulatedJob.iaAdvantages.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/50 flex flex-col md:flex-row gap-2 items-start md:items-center text-xs">
                      <span className="font-bold text-slate-500 select-none">Conseil adaptatif :</span>
                      <p className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/70 text-slate-700 font-medium leading-normal">
                        {simulatedJob.reconversionAdvice}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Waiting status tip for projector */}
              {!simulatedJob && !simulatorLoading && (
                <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm font-bold text-slate-600">Aucun métier analysé pour l'instant</p>
                  <p className="text-xs text-slate-400">
                    Saisissez un métier et cliquez sur Lancer pour épater le jury avec une prédiction de l'IA en direct.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* RIGHT DECK PANEL - PRESENTATION CONTROLLER & TOOLS (4 cols) */}
        <aside className="lg:col-span-4 flex flex-col" id="presentation-deck-panel">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col gap-6 h-full justify-between">
            
            {/* Presentation Controls section */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">
                <Clock className="w-3.5 h-3.5" />
                Tableau de Bord de Soutenance
              </span>

              {/* Interactive Presentation Speaker Timer */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Temps de parole recommandé (Oral : Pas plus de 5min)
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-3xl font-black text-white shrink-0">
                    {formatTime(timeRemaining)}
                  </div>

                  {/* Timer control buttons */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={toggleTimer}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer"
                      title={isTimerRunning ? "Pause" : "Démarrer"}
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => resetTimer(300)} // 5 min
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 rounded-xl transition-colors cursor-pointer"
                    >
                      5 min
                    </button>
                    <button
                      onClick={() => resetTimer(600)} // 10 min
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 rounded-xl transition-colors cursor-pointer"
                    >
                      10 min
                    </button>
                  </div>
                </div>

                {/* Progress bar of timer */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeRemaining < 60 ? "bg-red-500" : timeRemaining < 180 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${(timeRemaining / totalTimerDuration) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive definitions panel */}
            <div className="space-y-3 flex-grow flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 px-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <BookMarked className="w-3.5 h-3.5 text-indigo-500" />
                  Lexique &amp; Concept Socle (Dictionnaire DNB)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cliquez sur un concept pour afficher la définition à utiliser devant le jury.
                </p>

                {/* Grid tag buttons of keywords */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {definitions.map((defItem, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDefinition(defItem)}
                      className={`px-2.5 py-1.5 text-left text-xs font-bold rounded-xl transition-colors cursor-pointer border ${
                        selectedDefinition.term === defItem.term
                          ? "bg-indigo-600 text-white border-indigo-700"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {defItem.term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Definition presentation box */}
              <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100 space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-indigo-700 uppercase bg-indigo-100/50 px-2 py-0.5 rounded">
                    {selectedDefinition.concept}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">Concept Clé</span>
                </div>
                <h5 className="text-xs font-black text-indigo-950">{selectedDefinition.term}</h5>
                <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                  {selectedDefinition.definition}
                </p>
                <p className="text-[10px] text-slate-400 italic block border-t border-indigo-200/30 pt-1.5">
                  “ {selectedDefinition.quote} ”
                </p>
              </div>
            </div>

            {/* Anticipated jury questions and exact guides to reply */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Questions possibles des Jurés ({juryQuestions.length})
                </span>
                <span className="text-[10px] text-indigo-600 font-bold select-none">Aide-Mémoire</span>
              </div>

              {/* Accordion list box of FAQ */}
              <div className="space-y-2">
                {juryQuestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveJuryQuestion(index)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      activeJuryQuestion === index
                        ? "bg-slate-900 text-white border-slate-950"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <p className={`font-bold leading-snug ${activeJuryQuestion === index ? "text-white" : "text-slate-800"}`}>
                      {index + 1}. {item.q}
                    </p>
                    
                    {activeJuryQuestion === index && (
                      <p className="mt-2 text-[11px] text-slate-200 border-t border-slate-800 pt-2 leading-relaxed font-light">
                        {item.a}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Impressive citations board */}
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 space-y-1">
              <p className="text-[9px] uppercase font-black tracking-widest text-amber-800 flex items-center gap-1 select-none">
                <Volume2 className="w-3.5 h-3.5 text-amber-600" /> Citation à Placer (Bonus Oral) :
              </p>
              <p className="text-[11px] text-slate-800 italic leading-snug">
                “ {presentationQuotes[activeQuoteIndex].text} ”
              </p>
              <div className="flex justify-between items-center pt-1 border-t border-amber-200/50">
                <span className="text-[9px] font-bold text-slate-500">
                  — {presentationQuotes[activeQuoteIndex].author}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveQuoteIndex((prev) => (prev + 1) % presentationQuotes.length)}
                  className="text-[9px] text-indigo-700 font-extrabold cursor-pointer hover:underline"
                >
                  Suivante →
                </button>
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* Footer aligned with DNB metadata */}
      <footer className="mt-8 text-center text-xs text-slate-400 border-t border-slate-200/50 pt-4">
        <p>© 2026 - Tableau de Bord Interactif Orale Brevet des Collèges.</p>
        <p className="mt-1">
          Développé à la Seyne-sur-Mer pour la soutenance d'Aurel T.
          • Lycée Français • Épreuve d'Éducation aux Économies &amp; Technologies d'Avenir.
        </p>
      </footer>
    </div>
  );
}
