import { GoogleGenAI } from '@google/genai';

export function getGeminiClient(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export interface GeneratePersonaContentParams {
  persona: {
    name: string;
    archetype: string;
    tagline: string;
    bio: string;
    voice_and_tone: {
      style: string;
      pacing: string;
      lexicon: string[];
      boundaries: string[];
    };
    core_pillars: string[];
    ai_disclosure_statement: string;
  };
  requestType: 'concept' | 'hook' | 'script' | 'caption' | 'weekly_plan';
  topicOrPillar?: string;
  platform: 'instagram' | 'tiktok' | 'both';
  format: 'reel' | 'tiktok_video' | 'carousel' | 'story';
  targetAudience?: string;
}

export interface ResearchViralTrendsParams {
  category: 'vegas_nightlife' | 'luxury_hospitality' | 'dayclub_lifestyle' | 'competitor_formats' | 'all';
  platform?: 'tiktok' | 'instagram' | 'all';
}

export interface WeeklyStrategistParams {
  weekDates: { start: string; end: string };
  historicalData: {
    topPosts: { title: string; persona: string; views: number; engagementRate: number; hook: string; format: string }[];
    lowPosts: { title: string; persona: string; views: number; engagementRate: number; hook: string; format: string }[];
    metricsByFormat: Record<string, { avgViews: number; avgER: number }>;
    metricsByPillar: Record<string, { avgViews: number; avgER: number }>;
    postingTimes: Record<string, number>;
  };
}
