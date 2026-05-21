import { AlertTriangle, ShieldCheck, ZapOff, Users, Compass, Fingerprint, EyeOff } from "lucide-react";

export function ImpactsRisques() {
  const risksList = [
    {
      title: "1. Bais algorithmiques & Injustices",
      icon: <EyeOff className="w-5 h-5 text-amber-600" />,
      desc: "L'IA apprend à partir de données créées par les humains. Si ces données du passé comportent des discriminations (racisme, sexisme dans le recrutement), l'IA va reproduire et généraliser ces préjugés."
    },
    {
      title: "2. Perte de savoir-faire & Dépendance",
      icon: <ZapOff className="w-5 h-5 text-amber-600" />,
      desc: "À force de déléguer l'écriture, le calcul et les tâches complexes à la machine, l'être humain risque de perdre certaines de ses compétences fondamentales et de devenir totalement dépendant des pannes réseau."
    },
    {
      title: "3. Sécurités & Informations déformées",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      desc: "L'IA permet de fabriquer de fausses images (deepfakes) ou de faux textes extrêmement réalistes, rendant la fraude et la manipulation de l'opinion très faciles."
    }
  ];

  const humanSkills = [
    {
      name: "Intelligence Émotive & Empathie",
      benefit: "Savoir écouter, réconforter et comprendre les émotions sincères (ex: infirmiers, psychologues, enseignants). L'IA n'a pas de conscience ni de vrais sentiments.",
      icon: <Users className="w-5 h-5 text-emerald-600" />
    },
    {
      name: "Esprit Critique & Discernement",
      benefit: "Savoir vérifier les informations, douter d'un résultat et faire un choix éthique complexe en fonction des valeurs humaines (ex: juges, journalistes).",
      icon: <Compass className="w-5 h-5 text-indigo-600" />
    },
    {
      name: "Habileté Manuelle & Adaptation",
      benefit: "Réaliser des mouvements complexes non prévisibles dans des environnements changeants (ex: plombier réparant une fuite cachée, ébéniste créateur). Un robot est rigide.",
      icon: <Fingerprint className="w-5 h-5 text-amber-600" />
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="risks-panel">
      {/* Banner on Job transition */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col md:flex-row gap-4 items-start">
        <div className="p-3 bg-amber-100 rounded-2xl text-amber-800">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 text-lg">La Transition des Métiers : Les métiers en danger</h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            Les métiers les plus à risque d'automatisation sont ceux qui reposent sur des <strong>tâches répétitives, prévisibles et informatiques</strong>. Par exemple : les standardistes téléphoniques, les traducteurs de textes simples d'instructions, certains employés de saisie de comptes, ou encore les guichetiers de banques. Ils ne vont pas tous disparaître mais leurs effectifs vont s'adapter drastiquement.
          </p>
        </div>
      </div>

      {/* The 3 key Ethical challenges */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Les 3 grands risques éthiques et sociétaux de l'IA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {risksList.map((risk, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  {risk.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{risk.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {risk.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Human skills / Shield */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> L'humain reste irremplaçable
          </span>
          <h3 className="text-xl font-bold text-slate-900">
            Notre Bouclier : Les « Soft Skills » du 21ème siècle
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            De quoi devons-nous nous armer pour travailler harmonieusement avec l'IA ? Ce sont les compétences spécifiquement humaines que la logique d'un ordinateur ne pourra jamais reproduire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {humanSkills.map((skill, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 rounded-xl">
                  {skill.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {skill.name}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {skill.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
