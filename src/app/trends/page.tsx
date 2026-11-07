'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  Flame, 
  Search, 
  TrendingUp, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  Crown, 
  GlassWater, 
  SunMedium,
  Check,
  Zap,
  Plus
} from 'lucide-react';
import { ViralTrend, TrendRecommendation } from '@/types';

export default function TrendsPage() {
  const { 
    viralTrends, 
    personas, 
    addViralTrend, 
    convertTrendToContent, 
    selectedPersonaId, 
    setSelectedPersonaId 
  } = useApp();

  const [category, setCategory] = useState<'all' | 'vegas_nightlife' | 'luxury_hospitality' | 'dayclub_lifestyle' | 'competitor_formats'>('all');
  const [platform, setPlatform] = useState<'all' | 'tiktok' | 'instagram'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredTrends = viralTrends.filter((trend) => {
    if (selectedPersonaId !== 'all' && trend.recommended_persona_id !== selectedPersonaId) return false;
    if (platform !== 'all' && trend.platform !== 'general' && trend.platform !== platform) return false;
    return true;
  });

  const handleRunAIResearch = async () => {
    setIsScanning(true);
    setNotification(null);

    try {
      const res = await fetch('/api/ai/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, platform }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        json.data.forEach((trend: Partial<ViralTrend>) => {
          addViralTrend(trend);
        });
        setNotification(`Discovered and synthesized ${json.data.length} viral content opportunities!`);
      }
    } catch (err) {
      console.error(err);
      setNotification('Failed to fetch viral trends');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConvert = (trendId: string) => {
    const newItem = convertTrendToContent(trendId);
    if (newItem) {
      setNotification(`Converted into pipeline draft: "${newItem.title}"!`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Short-Form Trend Intelligence Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" />
            Viral Research & Opportunity Scout
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Detecting algorithm shifts, viral pacing structures, and Las Vegas hospitality trends across TikTok and Instagram Reels.
          </p>
        </div>

        <button
          onClick={handleRunAIResearch}
          disabled={isScanning}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-900/30 transition self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          {isScanning ? 'Scouting Social Algorithms...' : 'Run Live AI Trend Scout'}
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Filter and Categorization Bar */}
      <div className="bg-[#0D1220] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Category:
          </span>
          {[
            { id: 'all', label: 'All Sectors' },
            { id: 'vegas_nightlife', label: 'Vegas Nightlife & Speakeasies' },
            { id: 'luxury_hospitality', label: 'Casino & High-Roller VIP' },
            { id: 'dayclub_lifestyle', label: 'Pool Parties & Dayclubs' },
            { id: 'competitor_formats', label: 'Competitor Formats' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                category === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-medium">Platform:</span>
          {(['all', 'tiktok', 'instagram'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                platform === p
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrends.map((trend) => {
          const persona = personas.find((p) => p.id === trend.recommended_persona_id);
          const isRookie = persona?.archetype === 'rookie' || persona?.name.toLowerCase().includes('ava');
          const isInsider = persona?.archetype === 'insider' || persona?.name.toLowerCase().includes('jackie');

          let personaTheme = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
          let Icon = Crown;
          if (isInsider) {
            personaTheme = 'text-purple-400 bg-purple-500/10 border-purple-500/30';
            Icon = GlassWater;
          } else if (!isRookie) {
            personaTheme = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
            Icon = SunMedium;
          }

          const isPursue = trend.recommendation === 'pursue';
          const isMonitor = trend.recommendation === 'monitor';

          return (
            <div
              key={trend.id}
              className="bg-[#0C101D] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition"
            >
              <div className="space-y-3">
                {/* Header row: Recommendation & Score Gauge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${
                          isPursue
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isMonitor
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Recommendation: {trend.recommendation}
                      </span>

                      {/* Verified vs Hypothesis Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                          trend.is_verified_observation
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {trend.is_verified_observation ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Observation
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-3 h-3" />
                            Strategic AI Hypothesis
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-tight">
                      {trend.title}
                    </h3>
                  </div>

                  {/* Viral Potential Gauge */}
                  <div className="text-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shrink-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Viral Score</div>
                    <div className="text-lg font-black text-rose-400">
                      {trend.viral_potential_score}
                      <span className="text-xs font-normal text-slate-500">/100</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {trend.trend_description}
                </p>

                {/* Evidence & Why it gains attention */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#111626] p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Evidence of Popularity:
                    </span>
                    <p className="text-slate-300 text-[11px]">{trend.evidence_of_popularity}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Why it Gains Attention:
                    </span>
                    <p className="text-slate-300 text-[11px]">{trend.why_it_gains_attention}</p>
                  </div>
                </div>

                {/* Persona Match & Suggested Hook */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400 font-semibold text-[11px]">Best Fit Persona:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border flex items-center gap-1 ${personaTheme}`}>
                      <Icon className="w-3 h-3" />
                      {persona?.name}
                    </span>
                    <span className="text-slate-500 uppercase text-[10px]">({trend.platform})</span>
                  </div>

                  <div className="bg-[#13192B] border-l-2 border-rose-500 p-2.5 rounded-r-lg">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                      Suggested Opening Hook:
                    </span>
                    <p className="text-xs font-medium text-white italic">
                      "{trend.suggested_opening_hook}"
                    </p>
                  </div>
                </div>

                {/* 3 Adaptation Ideas */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Three Concrete Adaptation Ideas:
                  </span>
                  <div className="space-y-1.5">
                    {trend.adaptation_ideas.map((idea, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-[11px] flex items-start gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-200">{idea.title}</span>
                          <span className="text-slate-500 text-[10px] uppercase ml-1.5">({idea.target_format})</span>
                          <p className="text-slate-400 text-[10px] mt-0.5">{idea.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                {trend.source_url ? (
                  <a
                    href={trend.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                  >
                    <span>Inspect Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-600">No external source URL</span>
                )}

                <button
                  onClick={() => handleConvert(trend.id)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-purple-900/30"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Convert into Content Draft
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
