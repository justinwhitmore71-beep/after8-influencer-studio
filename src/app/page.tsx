'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Users, 
  Crown, 
  GlassWater, 
  SunMedium, 
  TrendingUp, 
  Eye, 
  Heart, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  ArrowUpRight, 
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
  Plus
} from 'lucide-react';

export default function Dashboard() {
  const { 
    personas, 
    socialAccounts, 
    contentItems, 
    tasks, 
    selectedPersonaId, 
    setSelectedPersonaId,
    platformFilter, 
    setPlatformFilter,
    dateRangeFilter, 
    setDateRangeFilter,
    transitionContentStatus,
    updateTask,
    currentUser
  } = useApp();

  // Filter content items based on selected filters
  const filteredContent = useMemo(() => {
    return contentItems.filter((item) => {
      if (selectedPersonaId !== 'all' && item.persona_id !== selectedPersonaId) return false;
      if (platformFilter !== 'all') {
        if (item.platform !== 'both' && item.platform !== platformFilter) return false;
      }
      return !item.is_archived;
    });
  }, [contentItems, selectedPersonaId, platformFilter]);

  // Filter social accounts based on selected persona and platform
  const filteredAccounts = useMemo(() => {
    return socialAccounts.filter((acc) => {
      if (selectedPersonaId !== 'all' && acc.persona_id !== selectedPersonaId) return false;
      if (platformFilter !== 'all' && acc.platform !== platformFilter) return false;
      return true;
    });
  }, [socialAccounts, selectedPersonaId, platformFilter]);

  // Aggregate Metrics across the filtered accounts
  const metrics = useMemo(() => {
    const totalFollowers = filteredAccounts.reduce((acc, curr) => acc + curr.follower_count, 0);
    const weeklyGrowth = filteredAccounts.reduce((acc, curr) => acc + curr.weekly_follower_growth, 0);
    const totalViews = filteredAccounts.reduce((acc, curr) => acc + curr.total_views, 0);
    const avgER = filteredAccounts.length > 0 
      ? (filteredAccounts.reduce((acc, curr) => acc + curr.avg_engagement_rate, 0) / filteredAccounts.length).toFixed(2)
      : '0.00';

    return { totalFollowers, weeklyGrowth, totalViews, avgER };
  }, [filteredAccounts]);

  // Pipeline Queues
  const scheduledPosts = useMemo(() => {
    return filteredContent.filter((c) => c.status === 'scheduled');
  }, [filteredContent]);

  const pendingReviewPosts = useMemo(() => {
    return filteredContent.filter((c) => c.status === 'review');
  }, [filteredContent]);

  const publishedRecent = useMemo(() => {
    return filteredContent
      .filter((c) => (c.status === 'published' || c.status === 'analyzed') && c.metrics)
      .sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0))
      .slice(0, 4);
  }, [filteredContent]);

  const pendingTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedPersonaId !== 'all' && t.persona_id && t.persona_id !== selectedPersonaId) return false;
      return t.status !== 'completed';
    });
  }, [tasks, selectedPersonaId]);

  return (
    <div className="space-y-8">
      {/* Top Banner: Greeting, Mode & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#101426] to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 tracking-wider uppercase mb-1">
            <span>Operational Talent Headquarters</span>
            <span>•</span>
            <span className="text-slate-400">Collaborating as {currentUser.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {selectedPersonaId === 'all' 
              ? 'Multi-Persona Executive Command Center' 
              : `${personas.find(p => p.id === selectedPersonaId)?.name} Workspace`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Managing 3 independent AI identities, 6 social accounts, content pipelines, viral research, and weekly audience intelligence.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Filter */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Filter className="w-3 h-3 text-cyan-400" />
              Platform:
            </span>
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                platformFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setPlatformFilter('instagram')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                platformFilter === 'instagram' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Instagram (3)
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                platformFilter === 'tiktok' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              TikTok (3)
            </button>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400 px-2 font-medium">Range:</span>
            {(['7d', '14d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRangeFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-medium transition uppercase ${
                  dateRangeFilter === r ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Personas Strip */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            The Three Independent AI Personas
          </h2>
          <span className="text-xs text-slate-500">Each persona has isolated voice, positioning & metrics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personas.map((persona) => {
            const isRookie = persona.archetype === 'rookie' || persona.name.toLowerCase().includes('ava');
            const isInsider = persona.archetype === 'insider' || persona.name.toLowerCase().includes('jackie');
            const isWildcard = persona.archetype === 'wildcard' || persona.name.toLowerCase().includes('sienna');

            // Persona-specific social accounts
            const personaAccounts = socialAccounts.filter((a) => a.persona_id === persona.id);
            const personaFollowers = personaAccounts.reduce((acc, c) => acc + c.follower_count, 0);
            const personaViews = personaAccounts.reduce((acc, c) => acc + c.total_views, 0);

            let accentBorder = 'border-amber-500/30 hover:border-amber-500/60';
            let bgGlow = 'from-amber-950/20 via-slate-900 to-[#0C101D]';
            let badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            let roleLabel = 'THE ROOKIE';
            let Icon = Crown;

            if (isInsider) {
              accentBorder = 'border-purple-500/30 hover:border-purple-500/60';
              bgGlow = 'from-purple-950/20 via-slate-900 to-[#0C101D]';
              badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
              roleLabel = 'THE INSIDER';
              Icon = GlassWater;
            } else if (isWildcard) {
              accentBorder = 'border-cyan-500/30 hover:border-cyan-500/60';
              bgGlow = 'from-cyan-950/20 via-slate-900 to-[#0C101D]';
              badgeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
              roleLabel = 'THE WILDCARD';
              Icon = SunMedium;
            }

            const isSelected = selectedPersonaId === persona.id;

            return (
              <div
                key={persona.id}
                className={`rounded-2xl border ${accentBorder} bg-gradient-to-b ${bgGlow} p-5 transition shadow-lg relative overflow-hidden flex flex-col justify-between ${
                  isSelected ? 'ring-2 ring-purple-500/80 shadow-purple-500/10' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={persona.avatar_url}
                          alt={persona.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-[#0C101D] border border-slate-700">
                          <Icon className="w-3 h-3 text-slate-300" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">{persona.name}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badgeBg}`}>
                          {roleLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPersonaId(isSelected ? 'all' : persona.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                        isSelected 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Viewing' : 'Filter'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mt-3 leading-relaxed">
                    "{persona.tagline}"
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {persona.bio}
                  </p>

                  {/* Core Pillars */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                      Core Content Pillars:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {persona.core_pillars.slice(0, 3).map((pillar, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800/60 text-[10px] text-slate-300 border border-slate-700/40"
                        >
                          {pillar}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Persona stats footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Followers</div>
                    <div className="text-sm font-bold text-white">
                      {personaFollowers.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Total Views</div>
                    <div className="text-sm font-bold text-white">
                      {personaViews.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Aggregate Metric Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E1322] border border-slate-800/90 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Total Followers</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {metrics.totalFollowers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            {metrics.weeklyGrowth > 0 ? `+${metrics.weeklyGrowth.toLocaleString()} this week` : 'Pre-release baseline (0)'}
          </div>
        </div>

        <div className="bg-[#0E1322] border border-slate-800/90 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {metrics.totalViews > 0 ? `${(metrics.totalViews / 1000000).toFixed(2)}M` : '0'}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across {filteredAccounts.length} managed social channels
          </div>
        </div>

        <div className="bg-[#0E1322] border border-slate-800/90 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Avg Engagement</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {metrics.avgER}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            {metrics.avgER !== '0.00' ? '+1.4% vs industry standard' : 'Awaiting published content'}
          </div>
        </div>

        <div className="bg-[#0E1322] border border-slate-800/90 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Scheduled Content</span>
            <CalendarIcon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {scheduledPosts.length} Posts
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {pendingReviewPosts.length} posts pending partner review
          </div>
        </div>
      </section>

      {/* Six Social Accounts Overview */}
      <section className="bg-[#0D1220] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              All Six Connected Social Accounts
            </h2>
            <p className="text-xs text-slate-400">
              Direct telemetry across Instagram Reels and TikTok channels
            </p>
          </div>
          <Link
            href="/analytics"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Deep Dive Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAccounts.map((account) => {
            const persona = personas.find((p) => p.id === account.persona_id);
            const isInstagram = account.platform === 'instagram';

            return (
              <div
                key={account.id}
                className="bg-[#111728] border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 truncate max-w-[160px]">
                      {persona?.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${
                        isInstagram
                          ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {account.platform}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {account.handle}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {account.display_name}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Followers</span>
                    <span className="font-bold text-slate-200">
                      {account.follower_count.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Weekly</span>
                    <span className="font-bold text-emerald-400">
                      +{account.weekly_follower_growth.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Engagement</span>
                    <span className="font-bold text-amber-300">
                      {account.avg_engagement_rate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Pending Approvals & Scheduled Pipeline & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Actionable Content Queues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Review Queue (Requires Partner/Admin Approval) */}
          <div className="bg-[#0D1220] border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Content Pending Approval ({pendingReviewPosts.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dual-administrator review protocol: confirm compliance, voice & AI disclosure
                  </p>
                </div>
              </div>
              <Link
                href="/content"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                View Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingReviewPosts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No content items currently awaiting review. All clear!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviewPosts.map((post) => {
                  const persona = personas.find((p) => p.id === post.persona_id);
                  return (
                    <div
                      key={post.id}
                      className="bg-[#12182B] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="font-bold text-amber-400">{persona?.name}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 uppercase text-[10px]">{post.platform} ({post.content_format})</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[10px]">Created by {post.created_by_name || 'Admin'}</span>
                        </div>
                        <h4 className="font-semibold text-white text-sm">{post.title}</h4>
                        <p className="text-xs text-slate-300 italic">"{post.hook}"</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => transitionContentStatus(post.id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-md shadow-emerald-900/20"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <Link
                          href="/content"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
                        >
                          Review Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scheduled Publishing Queue */}
          <div className="bg-[#0D1220] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-cyan-400" />
                  Upcoming Scheduled Publishing
                </h3>
                <p className="text-xs text-slate-400">
                  Automated release schedule across Instagram Reels & TikTok
                </p>
              </div>
              <Link
                href="/calendar"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Calendar View <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {scheduledPosts.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No posts scheduled. Plan new content from AI Studio or Content Pipeline.
              </div>
            ) : (
              <div className="space-y-3">
                {scheduledPosts.map((post) => {
                  const persona = personas.find((p) => p.id === post.persona_id);
                  const scheduledTime = post.scheduled_at 
                    ? new Date(post.scheduled_at).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZone: 'America/Los_Angeles'
                      })
                    : 'Unspecified time';

                  return (
                    <div
                      key={post.id}
                      className="bg-[#12182B] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="font-bold text-cyan-400">{persona?.name}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 uppercase text-[10px]">{post.platform}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-300 text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {scheduledTime} PST
                          </span>
                        </div>
                        <h4 className="font-semibold text-white text-sm">{post.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{post.hook}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => transitionContentStatus(post.id, 'published')}
                          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Published
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent High-Performance Content */}
          <div className="bg-[#0D1220] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Recent High-Performing Posts (Historical Proof)
            </h3>

            {publishedRecent.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No public posts published yet. Accounts start at 0 baseline in pre-release development.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {publishedRecent.map((post) => {
                  const persona = personas.find((p) => p.id === post.persona_id);
                  return (
                    <div
                      key={post.id}
                      className="bg-[#12182B] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-300">{persona?.name}</span>
                          <span className="text-slate-400 uppercase font-semibold">{post.platform}</span>
                        </div>
                        <h5 className="font-semibold text-white text-xs line-clamp-2">{post.title}</h5>
                      </div>

                      <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-900/80 rounded p-1">
                          <span className="text-[10px] text-slate-500 block">Views</span>
                          <span className="font-bold text-cyan-400">
                            {post.metrics?.views?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="bg-slate-900/80 rounded p-1">
                          <span className="text-[10px] text-slate-500 block">Saves</span>
                          <span className="font-bold text-amber-400">
                            {post.metrics?.saves?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="bg-slate-900/80 rounded p-1">
                          <span className="text-[10px] text-slate-500 block">ER</span>
                          <span className="font-bold text-emerald-400">
                            {post.metrics?.engagement_rate || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Shared Tasks & Quick Operations */}
        <div className="space-y-6">
          {/* Shared Team Tasks */}
          <div className="bg-[#0D1220] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Team Tasks ({pendingTasks.length})
              </h3>
              <span className="text-[11px] text-slate-400">Collaborative</span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No active tasks. Clean launch slate ready for real production!
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.map((task) => {
                const isUrgent = task.priority === 'urgent';
                const isHigh = task.priority === 'high';

                return (
                  <div
                    key={task.id}
                    className="p-3 bg-[#12182B] border border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-slate-200">{task.title}</h4>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isUrgent
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">{task.description}</p>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-purple-300 font-medium">
                        Assignee: {task.assigned_to_name}
                      </span>
                      <button
                        onClick={() => updateTask(task.id, { status: 'completed' })}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        ✓ Mark Done
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>

          {/* Quick Production Actions */}
          <div className="bg-gradient-to-br from-purple-950/40 via-[#0D1220] to-[#0A0D17] border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Production Quick Actions
            </h3>
            <p className="text-xs text-slate-400">
              Accelerate daily multi-channel posting operations
            </p>

            <div className="space-y-2 pt-1">
              <Link
                href="/content?action=new"
                className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-md shadow-purple-900/30"
              >
                <Plus className="w-4 h-4" />
                Draft New Persona Content
              </Link>
              <Link
                href="/generator"
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Open AI Persona Studio
              </Link>
              <Link
                href="/trends"
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700"
              >
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                Run Viral Trend Scout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
