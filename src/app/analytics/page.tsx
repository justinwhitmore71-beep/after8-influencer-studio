'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Users, 
  Clock, 
  Sparkles, 
  Filter, 
  Plus, 
  Layers,
  Crown,
  GlassWater,
  SunMedium
} from 'lucide-react';

export default function AnalyticsPage() {
  const { 
    personas, 
    socialAccounts, 
    contentItems, 
    selectedPersonaId, 
    setSelectedPersonaId,
    platformFilter, 
    setPlatformFilter 
  } = useApp();

  const [metricTab, setMetricTab] = useState<'overview' | 'pillars' | 'formats' | 'hooks' | 'timing'>('overview');

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return socialAccounts.filter((acc) => {
      if (selectedPersonaId !== 'all' && acc.persona_id !== selectedPersonaId) return false;
      if (platformFilter !== 'all' && acc.platform !== platformFilter) return false;
      return true;
    });
  }, [socialAccounts, selectedPersonaId, platformFilter]);

  // Aggregate stats
  const totals = useMemo(() => {
    const followers = filteredAccounts.reduce((acc, c) => acc + c.follower_count, 0);
    const growth = filteredAccounts.reduce((acc, c) => acc + c.weekly_follower_growth, 0);
    const views = filteredAccounts.reduce((acc, c) => acc + c.total_views, 0);
    const avgEr = filteredAccounts.length > 0 
      ? (filteredAccounts.reduce((acc, c) => acc + c.avg_engagement_rate, 0) / filteredAccounts.length).toFixed(2)
      : '0.00';

    return { followers, growth, views, avgEr };
  }, [filteredAccounts]);

  // Account Comparison Chart Data
  const accountComparisonData = useMemo(() => {
    return filteredAccounts.map((acc) => {
      const p = personas.find((per) => per.id === acc.persona_id);
      return {
        name: `${p?.name.split(' ')[0]} (${acc.platform === 'instagram' ? 'IG' : 'TT'})`,
        followers: acc.follower_count,
        views: acc.total_views / 1000000,
        er: acc.avg_engagement_rate,
      };
    });
  }, [filteredAccounts, personas]);

  // Pillar Performance Breakdown
  const pillarPerformanceData = useMemo(() => {
    const map: Record<string, { pillar: string; postsCount: number; totalViews: number; totalSaves: number; avgER: number }> = {};

    contentItems.forEach((item) => {
      if (selectedPersonaId !== 'all' && item.persona_id !== selectedPersonaId) return;
      const pillar = item.content_pillar || 'General';
      if (!map[pillar]) {
        map[pillar] = { pillar, postsCount: 0, totalViews: 0, totalSaves: 0, avgER: 0 };
      }
      map[pillar].postsCount += 1;
      if (item.metrics) {
        map[pillar].totalViews += item.metrics.views || 0;
        map[pillar].totalSaves += item.metrics.saves || 0;
        map[pillar].avgER = item.metrics.engagement_rate || 5.0;
      }
    });

    return Object.values(map);
  }, [contentItems, selectedPersonaId]);

  // Format Performance Breakdown (Reels vs TikTok vs Carousels)
  const formatPerformanceData = [
    { format: 'TikTok Videos', views: 32.4, saves: 58.2, er: 7.45, fill: '#06B6D4' },
    { format: 'Instagram Reels', views: 24.8, saves: 42.6, er: 6.82, fill: '#8B5CF6' },
    { format: 'IG Carousels', views: 8.5, saves: 48.9, er: 8.20, fill: '#F59E0B' },
    { format: 'Stories & Static', views: 3.2, saves: 4.1, er: 3.40, fill: '#EC4899' },
  ];

  // Hook Type Comparative Analysis
  const hookStyleData = [
    { style: 'Dollar Amount Shock ($45K Suite)', avgViews: '850K', retention3s: '74%', saveRate: '4.8%' },
    { style: 'Secret Door / Unmarked Entrance', avgViews: '920K', retention3s: '81%', saveRate: '5.2%' },
    { style: 'Unwritten Rules / Host Warning', avgViews: '640K', retention3s: '68%', saveRate: '4.1%' },
    { style: 'Daybed Math Breakdown', avgViews: '510K', retention3s: '62%', saveRate: '3.9%' },
    { style: 'Generic Luxury Scenic (No Hook)', avgViews: '120K', retention3s: '26%', saveRate: '0.8%' },
  ];

  // Best Posting Times (PST)
  const postingTimesData = [
    { time: '12 PM PST', engagement: 3.2 },
    { time: '3 PM PST', engagement: 4.6 },
    { time: '6 PM PST', engagement: 7.8 },
    { time: '7:30 PM PST', engagement: 9.4 },
    { time: '9:00 PM PST', engagement: 8.9 },
    { time: '11:00 PM PST', engagement: 6.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Empirical Social Performance Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Performance Analytics & Comparisons
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Granular evaluation of views, engagement rates, saves, formats, hooks, and optimal posting timeframes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'pillars', label: 'Content Pillars' },
            { id: 'formats', label: 'Video Formats' },
            { id: 'hooks', label: 'Hook Analysis' },
            { id: 'timing', label: 'Posting Times' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMetricTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                metricTab === tab.id ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Audience Reach</span>
          <div className="text-2xl font-extrabold text-white">{totals.followers.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            +{totals.growth.toLocaleString()} weekly growth
          </div>
        </div>

        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Video Impressions</span>
          <div className="text-2xl font-extrabold text-white">{(totals.views / 1000000).toFixed(2)}M</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 6 managed channels</div>
        </div>

        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Portfolio Engagement Rate</span>
          <div className="text-2xl font-extrabold text-amber-400">{totals.avgEr}%</div>
          <div className="text-[11px] text-slate-400 mt-1">High save-to-like velocity</div>
        </div>

        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">API Integration Readiness</span>
          <div className="text-sm font-bold text-emerald-400 mt-1">Schema V2 Connected</div>
          <div className="text-[11px] text-slate-400 mt-1">Graph API & TikTok Sync Ready</div>
        </div>
      </div>

      {/* Overview Tab: Channel Comparisons */}
      {metricTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Follower Count & Total Views by Channel (in Millions)
                </h3>
                <p className="text-xs text-slate-400">
                  Performance across Instagram and TikTok for Ava Montcrief, Jackie Quintera, and Sienna Torneu
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accountComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="views" name="Views (M)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="er" name="Engagement Rate (%)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Content Pillars Tab */}
      {metricTab === 'pillars' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Content Pillar Efficacy Matrix</h3>
            <p className="text-xs text-slate-400">
              Identifying which topical pillars produce the highest algorithmic distribution and audience retention
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {pillarPerformanceData.map((item, idx) => (
              <div key={idx} className="bg-[#111728] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">{item.pillar}</h4>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                    {item.postsCount} Posts
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Views</span>
                    <span className="font-bold text-cyan-400">
                      {(item.totalViews / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Saves</span>
                    <span className="font-bold text-amber-400">
                      {item.totalSaves.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Avg ER</span>
                    <span className="font-bold text-emerald-400">{item.avgER}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Formats Tab */}
      {metricTab === 'formats' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Format Breakdown: Short-Form Video vs Carousels</h3>
            <p className="text-xs text-slate-400">
              Observing performance variances between TikToks, Reels, Carousels, and Stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formatPerformanceData}
                    dataKey="views"
                    nameKey="format"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {formatPerformanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {formatPerformanceData.map((f, i) => (
                <div key={i} className="bg-[#111728] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: f.fill }} />
                    <span className="font-bold text-white">{f.format}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>{f.views}M Views</span>
                    <span className="text-amber-400 font-semibold">{f.er}% ER</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hook Analysis Tab */}
      {metricTab === 'hooks' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Opening Hook Retention & Save Velocity</h3>
            <p className="text-xs text-slate-400">
              Direct comparison of retention benchmarks across hook categories
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#12182B] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Hook Archetype</th>
                  <th className="px-4 py-3">Average Views</th>
                  <th className="px-4 py-3">3-Second Retention Benchmark</th>
                  <th className="px-4 py-3">Save Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {hookStyleData.map((h, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition">
                    <td className="px-4 py-3 font-semibold text-white">{h.style}</td>
                    <td className="px-4 py-3 text-cyan-400 font-bold">{h.avgViews}</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">{h.retention3s}</td>
                    <td className="px-4 py-3 text-amber-400 font-bold">{h.saveRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timing Tab */}
      {metricTab === 'timing' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Best Posting Times (Pacific Standard Time)</h3>
            <p className="text-xs text-slate-400">
              Audience activity correlation: Nightlife & luxury peak between 6:30 PM and 9:30 PM PST
            </p>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={postingTimesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="engagement" stroke="#06B6D4" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
