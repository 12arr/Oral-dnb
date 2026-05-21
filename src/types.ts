/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CareerAnalysis {
  job: string;
  automationChance: number;
  impactLevel: "Faible" | "Moyen" | "Fort";
  automatableTasks: string[];
  humanSkillsSaved: string[];
  iaAdvantages: string[];
  reconversionAdvice: string;
  summary: string;
}

export interface CoachMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  scoreFeedback?: string; // Appréciation ou conseils
  idealResponse?: string; // Réponse idéale suggérée
  pointsClés?: string[]; // Mots-clés à retenir
}

export interface IndustryStat {
  industry: string;
  automatableRatio: number; // 0 à 100
  dominantAIUsed: string;
  examples: string[];
  textColor: string;
  bgColor: string;
}
