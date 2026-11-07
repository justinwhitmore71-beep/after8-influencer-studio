'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  BrainCircuit, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Calendar as CalendarIcon, 
  CalendarPlus, 
  ArrowRight, 
  AlertTriangle,
  RefreshCw,
  Check,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { WeeklyStrategyReport } from '@/types';

export default function StrategistPage() {
  const { 
    strategyReports, 
    saveStrategyReport, 
    createContentItem, 
    contentItems, 
    personas 
  } = useApp();

  const currentReport = strategyReports[0];
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleRunStrategist = async () => {
    setIsSynthesizing(true);
    setNotification(null);

    const weekDates = {
      start: '2026-11-01',
      end: '2026-11-07',
    };

    const historicalData = {
      topPosts: contentItems
        .filter((c) => c.metrics)
        .sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0))
        .slice(0, 3)
        .map((p) => ({
          title: p.title,
          persona: personas.find((per) => per.id === p.persona_id)?.name || 'Persona',
          views: p.metrics?.views || 0,
          engagementRate: p.metrics?.engagement_rate || 0,
          hook: p.hook,
          format: p.content_format,
        })),
      lowPosts: contentItems
        .filter((c) => c.metrics)
        .sort((a, b) => (a.metrics?.views || 0) - (b.metrics?.views || 0))
        .slice(0, 2)
        .map((p) => ({
          title: p.title,
          persona: personas.find((per) => per.id === p.persona_id)?.name || 'Persona',
          views: p.metrics?.views || 0,
          engagementRate: p.metrics?.engagement_rate || 0,
          hook: p.hook,
          format: p.content_format,
        })),
      metricsByFormat: {
        reel: { avgViews: 485000, avgER: 7.84 },
        tiktok_video: { avgViews: 920000, avgER: 9.35 },
      },
      metricsByPillar: {
        'Speakeasies & Hidden Entrances': { avgViews: 920000, avgER: 9.35 },
        'Penthouse Suites': { avgViews: 485000, avgER: 7.84 },
      },
      postingTimes: {
        '7:30 PM PST': 9.4,
        '9:00 PM PST': 8.9,
      },
    };

    try {
      const res = await fetch('/api/ai/strategist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekDates, historicalData }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        saveStrategyReport(json.data);
        setNotification('Generated comprehensive new AI Weekly Strategy Report!');
      }
    } catch (err) {
      console.error(err);
      setNotification('Failed to generate weekly strategy review');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleApplyCalendar = () => {
    if (!currentReport || !currentReport.proposed_content_calendar) return;

    let count = 0;
    currentReport.proposed_content_calendar.forEach((slot, index) => {
      const persona = personas.find((p) => p.name.toLowerCase().includes(slot.persona.toLowerCase())) || personas[0];
      const scheduledDate = new Date(Date.now() + 86400000 * (index + 1)).toISOString();

      createContentItem({
        persona_id: persona.id,
        platform: slot.platform,
        content_format: slot.format,
        title: `${slot.day}: ${slot.concept.slice(0, 40)}`,
        description: slot.concept,
        hook: slot.hook,
        caption: `Planned by AI Weekly Strategist.\n\n${slot.concept}\n\n${persona.ai_disclosure_statement}`,
        content_pillar: persona.core_pillars[0],
        status: 'scheduled',
        scheduled_at: scheduledDate,
      });
      count++;
    });

    setNotification(`Successfully scheduled ${count} posts from Proposed Calendar into Pipeline!`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Executive Performance Audit & Strategy</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Weekly Strategist
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mathematical review of the previous 7 days: what worked, what failed, improving formats, 5 testable experiments, and next week's calendar.
          </p>
        </div>

        <button
          onClick={handleRunStrategist}
          disabled={isSynthesizing}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 transition"
        >
          {isSynthesizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Algorithmic Audit...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run Weekly Strategy Review
            </>
          )}
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* Audit Period Header Card */}
      <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Audit Review Window:</span>
          <h3 className="text-lg font-bold text-white">
            Week of {currentReport?.week_start_date} to {currentReport?.week_end_date}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentReport?.evidence_summary}
          </p>
        </div>

        <button
          onClick={handleApplyCalendar}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition shrink-0"
        >
          <CalendarPlus className="w-4 h-4" />
          Apply Proposed Calendar to Pipeline
        </button>
      </div>

      {/* 7 Core Strategic Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: What Worked */}
        <div className="bg-[#0C101D] border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            1. What Worked (Backed by Metrics)
          </h3>
          <div className="space-y-3 pt-1">
            {currentReport?.what_worked.map((item, idx) => (
              <div key={idx} className="bg-[#101726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-white text-xs">{item.topic}</div>
                <div className="text-emerald-400 font-semibold text-[11px]">{item.metric}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed pt-1">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: What Failed */}
        <div className="bg-[#0C101D] border border-rose-500/30 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            2. What Failed (Root Cause Analysis)
          </h3>
          <div className="space-y-3 pt-1">
            {currentReport?.what_failed.map((item, idx) => (
              <div key={idx} className="bg-[#101726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-white text-xs">{item.topic}</div>
                <div className="text-rose-400 font-semibold text-[11px]">{item.reason}</div>
                <div className="text-slate-300 text-[11px] pt-1">
                  <span className="font-semibold text-slate-200">Corrective Action:</span> {item.corrective_action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Improving Formats */}
        <div className="bg-[#0C101D] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            3. Which Content Formats Are Improving
          </h3>
          <div className="space-y-3 pt-1">
            {currentReport?.improving_formats.map((item, idx) => (
              <div key={idx} className="bg-[#101726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.format}</span>
                  <span className="text-emerald-400 font-bold">{item.growth_rate}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Topics to Expand */}
        <div className="bg-[#0C101D] border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            4. Topics Deserving More Attention
          </h3>
          <div className="space-y-3 pt-1">
            {currentReport?.topics_to_expand.map((item, idx) => (
              <div key={idx} className="bg-[#101726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-white">{item.topic}</div>
                <p className="text-slate-300 text-[11px]">{item.potential}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: What to Stop */}
        <div className="md:col-span-2 bg-[#0C101D] border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            5. Practices to Stop Immediately (Brand Safety & Efficiency)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {currentReport?.what_to_stop.map((item, idx) => (
              <div key={idx} className="bg-[#101726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-rose-300">{item.practice}</div>
                <p className="text-slate-400 text-[11px]">{item.rationale}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Five Recommended Experiments */}
        <div className="md:col-span-2 bg-[#0C101D] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              6. Five Empirical Experiments Recommended for Next Week
            </h3>
            <p className="text-xs text-slate-400">
              Structured A/B tests with verifiable hypotheses, targeted personas, and measurable KPIs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentReport?.recommended_experiments.map((exp, idx) => (
              <div key={idx} className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-purple-400 font-bold mb-1">
                    <span>Experiment {idx + 1}</span>
                    <span className="text-slate-400">{exp.target_persona}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs leading-snug">{exp.title}</h4>
                  <p className="text-slate-300 text-[11px] mt-1.5 leading-relaxed">{exp.hypothesis}</p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold">
                  KPI: {exp.kpi}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7: Next Week's Proposed Content Calendar */}
        <div className="md:col-span-2 bg-[#0C101D] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-cyan-400" />
                7. Next Week's Proposed 7-Day Multi-Persona Calendar
              </h3>
              <p className="text-xs text-slate-400">
                Balanced distribution across Ava, Jackie, and Sienna designed around peak engagement windows
              </p>
            </div>

            <button
              onClick={handleApplyCalendar}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Apply to CMS Pipeline
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {currentReport?.proposed_content_calendar.map((item, idx) => (
              <div key={idx} className="bg-[#111728] border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 text-xs">{item.day}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{item.platform}</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">{item.persona}</div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 italic">
                  "{item.hook}"
                </div>
                <p className="text-[10px] text-slate-400">{item.concept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
