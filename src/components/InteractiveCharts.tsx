import { useState } from "react";
import { TrendingUp, Percent, ShieldAlert, Award } from "lucide-react";

export function InteractiveCharts() {
  const [selectedSector, setSelectedSector] = useState<string>("services");

  const sectorData = [
    {
      id: "services",
      name: "Services & Administration",
      productivity: 85,
      risk: 70,
      description: "Saisie de données, gestion d'agendas, et tâches de bureau de routine hautement automatisables par des agents IA.",
      highlight: "Changement de rôle vers la coordination relationnelle humaine.",
      color: "bg-indigo-600",
      lightColor: "bg-indigo-100",
      textColor: "text-indigo-800"
    },
    {
      id: "sante",
      name: "Santé & Diagnostic",
      productivity: 60,
      risk: 25,
      description: "L'IA aide à lire les scanners urinaires, sanguins ou d'imagerie. L'acte de soin et d'empathie reste 100% humain.",
      highlight: "Diagnostics précoces multipliés pour sauver plus de vies.",
      color: "bg-rose-500",
      lightColor: "bg-rose-100",
      textColor: "text-rose-800"
    },
    {
      id: "industrie",
      name: "Industrie & Logistique",
      productivity: 45,
      risk: 55,
      description: "Optimisation de chaînes logistiques, prévision de pannes d'usines et robotique adaptative assistée par IA.",
      highlight: "Moins d'accidents du travail et de gâchis de ressources.",
      color: "bg-amber-500",
      lightColor: "bg-amber-100",
      textColor: "text-amber-800"
    },
    {
      id: "education",
      name: "Éducation & Recherche",
      productivity: 70,
      risk: 15,
      description: "Adaptation individualisée des exercices à chaque élève. Le professeur se recentre sur le tutorat et le lien social.",
      highlight: "Compenser le décrochage scolaire grâce aux tuteurs IA 24h/24.",
      color: "bg-sky-500",
      lightColor: "bg-sky-100",
      textColor: "text-sky-800"
    }
  ];

  const currentSector = sectorData.find(s => s.id === selectedSector) || sectorData[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="interactive-charts-layout">
      {/* Visual Chart - Left/Top */}
      <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            Indicateurs d'impact par grands secteurs
          </h3>
          <p className="text-slate-500 text-xs mb-6">
            Clique sur un secteur pour faire varier l'analyse comparative de l'automatisation.
          </p>
        </div>

        {/* Dynamic Bars Block */}
        <div className="flex-grow flex items-end gap-4 md:gap-8 h-48 pb-2">
          {sectorData.map((sector) => (
            <button
              key={sector.id}
              onClick={() => setSelectedSector(sector.id)}
              className="flex flex-col items-center flex-1 gap-2 group cursor-pointer focus:outline-none"
              id={`sector-bar-${sector.id}`}
            >
              {/* Tooltip on top of bar */}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1 ${
                selectedSector === sector.id ? "opacity-100 bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
              }`}>
                {sector.productivity}% Prod.
              </span>
              
              {/* Stacked bar structure */}
              <div className="w-full bg-slate-100 rounded-2xl relative h-36 overflow-hidden border border-slate-200/50">
                {/* Background active pulse background */}
                {selectedSector === sector.id && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-indigo-500 animate-pulse" />
                )}
                <div
                  className={`absolute bottom-0 w-full transition-all duration-500 rounded-b-xl ${
                    selectedSector === sector.id ? sector.color : "bg-slate-300 group-hover:bg-slate-400"
                  }`}
                  style={{ height: `${sector.productivity}%` }}
                />
              </div>

              {/* Tag below */}
              <span className={`text-[10px] font-bold uppercase tracking-wider text-center line-clamp-1 transition-colors ${
                selectedSector === sector.id ? sector.textColor : "text-slate-400"
              }`}>
                {sector.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-2.5 h-2.5 bg-indigo-600 rounded-sm"></span> Sélectionné
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></span> Autres secteurs
            </span>
          </div>
          <span className="text-indigo-600 font-bold tracking-tight">
            Indice de Gains : +32%
          </span>
        </div>
      </div>

      {/* Sector Insight Card - Right/Bottom */}
      <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-700`}>
              Zoom Secteur
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono flex items-center gap-1">
              {currentSector.id === "services" ? "📌 " : ""}DNB Fiches
            </span>
          </div>

          <h4 className="text-lg font-bold text-slate-900 leading-snug">
            {currentSector.name}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentSector.description}
          </p>

          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Productivité IA :
              </span>
              <span className="font-bold text-slate-900">+{currentSector.productivity}%</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Vulnérabilité automatisation :
              </span>
              <span className="font-bold text-slate-900">{currentSector.risk}%</span>
            </div>
          </div>
        </div>

        <div className={`mt-4 p-3.5 rounded-xl border border-dashed flex gap-2 items-start bg-white border-slate-200`}>
          <Award className="w-4 h-4 text-emerald-600 mt-0.5" />
          <div className="text-[11px] text-slate-700">
            <strong className="font-bold text-emerald-800">Conclusion clé :</strong> {currentSector.highlight}
          </div>
        </div>
      </div>
    </div>
  );
}
