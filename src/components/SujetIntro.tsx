import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Clock, BookOpen, AlertTriangle, Lightbulb, GraduationCap } from "lucide-react";

export function SujetIntro() {
  const [seconds, setSeconds] = useState(300); // 5 minutes (300 seconds)
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(300);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Timeline check for highlighted part based on elapsed time (300s total, counted down)
  const elapsedTime = 300 - seconds;
  const getActivePhase = () => {
    if (elapsedTime <= 60) return "intro";      // 0-60s (Introduction)
    if (elapsedTime <= 180) return "avantages"; // 61-180s (I. Avantages & opportunités)
    if (elapsedTime <= 270) return "risques";   // 181-270s (II. Impacts et risques)
    return "concl";                             // 271-300s (Conclusion)
  };

  const activePhase = getActivePhase();

  return (
    <div className="space-y-8 animate-fade-in" id="sujet-intro-panel">
      {/* Intro Banner */}
      <div className="p-8 rounded-3xl bg-slate-100 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
              <GraduationCap className="w-3.5 h-3.5" id="grad-icon" />
              Sujet d'Oral - Diplôme National du Brevet (DNB)
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              L'impact de l'IA sur les Métiers : Impacts &amp; Avantages
            </h2>
            <p className="text-slate-600 max-w-2xl leading-relaxed">
              Prépare ton exposé oral de 15 minutes (5 min de présentation libre et 10 min d'entretien avec le jury) grâce à ce support numérique structuré et nos outils interactifs.
            </p>
          </div>
          
          {/* Timeline Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center min-w-[200px]">
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600" /> Chronomètre d'exposé (5 min)
            </span>
            <span className="text-3xl font-mono font-bold text-slate-900 mt-1">
              {formatTime(seconds)}
            </span>
            <div className="flex gap-2 mt-3">
              <button
                onClick={toggleTimer}
                className={`p-2 rounded-lg text-white font-medium text-xs transition-colors cursor-pointer ${
                  isActive ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
                id="timer-toggle-btn"
              >
                {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors cursor-pointer"
                id="timer-reset-btn"
                title="Réinitialiser"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Problématique box */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
          <h3 className="text-sm font-bold text-blue-900 tracking-wider uppercase mb-1">
            Ma Problématique centrale de soutenance :
          </h3>
          <p className="text-lg italic font-medium text-slate-800 leading-relaxed">
            « En quoi l’intelligence artificielle transforme-t-elle profondément la nature des métiers aujourd’hui, et comment l'humain peut-il s'adapter pour en faire un levier d'évolution plutôt qu'une menace ? »
          </p>
        </div>
      </div>

      {/* Guide structure d'exposé */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Déroulé recommandé pour tes 5 minutes de parole
        </h3>
        <p className="text-sm text-slate-500">
          Utilise le chronomètre ci-dessus. Le bloc en vert s'allume automatiquement en fonction du temps écoulé !
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Phase 1 */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              activePhase === "intro"
                ? "bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-400/20"
                : "bg-white border-slate-200 opacity-75"
            }`}
            id="phase-intro"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded">
                0:00 - 1:00
              </span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Introduction</h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-3">
              <li><strong>Accroche :</strong> Parle d'un outil populaire (ex: ChatGPT, générateurs d'images) pour capter l'attention.</li>
              <li><strong>Définition :</strong> Définir simplement l'IA (programme capable d'imiter l'intelligence humaine).</li>
              <li><strong>Annonce de la problématique et du plan.</strong></li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              activePhase === "avantages"
                ? "bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-400/20"
                : "bg-white border-slate-200 opacity-75"
            }`}
            id="phase-avantages"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded">
                1:00 - 3:00
              </span>
              <Lightbulb className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">I. Avantages &amp; Gains</h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-3">
              <li><strong>Automatisation :</strong> Décharger des tâches pénibles ou répétitives (saisie de données, tri).</li>
              <li><strong>Augmentation de l'humain :</strong> L'IA aide à analyser plus vite (ex : diagnostics médicaux).</li>
              <li><strong>Nouveaux Métiers :</strong> Prompt engineer, superviseurs éthiques, experts de la donnée.</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              activePhase === "risques"
                ? "bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-400/20"
                : "bg-white border-slate-200 opacity-75"
            }`}
            id="phase-risques"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded">
                3:00 - 4:30
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">II. Impacts &amp; Risques</h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-3">
              <li><strong>Métiers menacés :</strong> Métiers basés sur des règles prévisibles (secrétariat, traduction simple).</li>
              <li><strong>Fossé numérique :</strong> Ceux qui ne maîtrisent pas l'IA risquent de perdre en productivité.</li>
              <li><strong>Biais &amp; Éthique :</strong> Les erreurs des modèles et le manque de contact critique ou humain.</li>
            </ul>
          </div>

          {/* Phase 4 */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              activePhase === "concl"
                ? "bg-indigo-50 border-indigo-400 shadow-md ring-2 ring-indigo-400/20"
                : "bg-white border-slate-200 opacity-75"
            }`}
            id="phase-concl"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded">
                4:30 - 5:00
              </span>
              <GraduationCap className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Conclusion</h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-3">
              <li><strong>Bilan synthétique :</strong> L'IA ne remplace pas l'humain mais remplace « l'humain qui n'utilise pas l'IA ».</li>
              <li><strong>Ouverture :</strong> Quel rôle doit jouer l'école de demain pour nous former à ces technologies ?</li>
              <li>Remerciement poli au jury.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
