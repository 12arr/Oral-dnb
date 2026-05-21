import { useState } from "react";
import { Sparkles, Brain, Briefcase, ChevronRight, UserCheck, Stethoscope, PencilRuler, GraduationCap } from "lucide-react";

export function AvantagesMetiers() {
  const [activeTab, setActiveTab] = useState<string>("medecine");

  const caseStudies = [
    {
      id: "medecine",
      title: "La Santé & Médecine",
      subtitle: "Le médecin augmenté",
      icon: <Stethoscope className="w-5 h-5 text-rose-500" />,
      color: "border-rose-200 bg-rose-50/50",
      textColor: "text-rose-800",
      description: "L'IA analyse des milliers de radiographies en quelques secondes pour détecter des anomalies invisibles à l'œil humain (comme des tumeurs très précoces).",
      quote: "L'IA ne remplace pas le radiologue, mais le radiologue qui utilise l'IA remplace celui qui ne l'utilise pas.",
      keyStat: "Diagnostic 30% plus rapide et précis"
    },
    {
      id: "architecture",
      title: "Design & Construction",
      subtitle: "Créativité accélérée",
      icon: <PencilRuler className="w-5 h-5 text-amber-500" />,
      color: "border-amber-200 bg-amber-50/50",
      textColor: "text-amber-800",
      description: "Les architectes utilisent l'IA générative pour tester des centaines de designs de bâtiments écologiques en fonction du climat et des matériaux disponibles en quelques minutes.",
      quote: "Nous passons moins de temps sur les tâches de dessin technique répétitif et plus sur la créativité pure.",
      keyStat: "Génération de maquettes 3D instantanée"
    },
    {
      id: "education",
      title: "Éducation & Formation",
      subtitle: "Tuteur personnalisé",
      icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
      color: "border-indigo-200 bg-indigo-50/50",
      textColor: "text-indigo-800",
      description: "Des assistants IA analysent les points forts et les lacunes d'un élève pour lui concocter des exercices sur mesure, l'aidant à progresser sans se décourager.",
      quote: "L'IA épaule le professeur en faisant de l'aide individualisée, libérant du temps pour l'écoute humaine.",
      keyStat: "Exercices adaptés au rythme de 100% des élèves"
    }
  ];

  const activeStudy = caseStudies.find(study => study.id === activeTab) || caseStudies[0];

  const newJobs = [
    {
      title: "Ingénieur de Prompt (Prompt Engineer)",
      role: "L'art de parler aux machines",
      desc: "Spécialiste qui conçoit et rédige des instructions (prompts) ultra-précises pour obtenir le meilleur résultat possible des modèles d'IA générative."
    },
    {
      title: "Consultant / Éthicien en IA",
      role: "Garantir le respect des valeurs humaines",
      desc: "Veille à ce que les algorithmes d'IA utilisés en entreprise soient justes, n'aient pas de préjugés racistes ou sexistes, et respectent la vie privée."
    },
    {
      title: "Entraîneur de Modèles d'IA (AI Trainer)",
      role: "Le professeur des algorithmes",
      desc: "Fournit et labellise des données d'entraînement de haute qualité pour apprendre à l'ordinateur à reconnaître des objets, du texte ou des émotions."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="advantages-panel">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Gain de temps précieux</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            L'IA prend en charge les tâches administratives ou répétitives complexes (tri de fichiers, rédaction de mails standards, synthèses). Le travailleur peut se concentrer sur l'essentiel.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">2. Humain Augmenté</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Grâce à l'analyse de données géantes par l'IA, les professionnels décident mieux et plus vite. L'IA agit comme un super-assistant qui ne dort jamais et connaît toute la base théorique mondiale.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">3. Nouveaux Métiers</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Chaque révolution industrielle détruit des emplois mais en crée d'autres. L'IA donne naissance à des spécialités passionnantes liées au numérique, à la logique et à la philosophie critique.
          </p>
        </div>
      </div>

      {/* Case studies interactive section */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          Études de cas : L'IA au cœur de la pratique professionnelle
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Selector Tabs (left) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {caseStudies.map((study) => (
              <button
                key={study.id}
                onClick={() => setActiveTab(study.id)}
                className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  activeTab === study.id
                    ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                    : "bg-transparent border-slate-200 hover:bg-white"
                }`}
                id={`tab-study-${study.id}`}
              >
                <div className="p-2 bg-slate-100 rounded-xl">{study.icon}</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{study.title}</h4>
                  <span className="text-xs text-slate-500">{study.subtitle}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Content Card (right) */}
          <div className="lg:col-span-8">
            <div className={`p-6 md:p-8 rounded-2xl border h-full flex flex-col justify-between ${activeStudy.color}`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase tracking-wider ${activeStudy.textColor}`}>
                    {activeStudy.subtitle}
                  </span>
                  <span className="text-xs font-semibold bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
                    {activeStudy.keyStat}
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-slate-900">{activeStudy.title}</h4>
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                  {activeStudy.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200/50 italic text-slate-600 text-xs md:text-sm flex items-start gap-2">
                <span className="text-2xl text-slate-400 font-serif leading-none">“</span>
                <p>{activeStudy.quote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Jobs Showcase */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Les Métiers de l'avenir générés par l'IA
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newJobs.map((job, idx) => (
            <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-indigo-400 transition-colors">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full pointer-events-none" />
              <div className="space-y-2">
                <span className="text-xs font-bold font-mono text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                  Futur Métier {idx + 1}
                </span>
                <h4 className="text-lg font-bold text-slate-900 pt-1 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h4>
                <p className="text-xs font-medium text-slate-500 italic">
                  {job.role}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  {job.desc}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-4 pt-4 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                Compétence : Créativité et Logique <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
