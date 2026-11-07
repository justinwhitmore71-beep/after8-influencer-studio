'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { 
  ContentItem, 
  ContentStatus, 
  ContentFormat, 
  ContentPlatform,
  PersonaArchetype 
} from '@/types';
import { 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Edit3, 
  Check, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Share2, 
  BarChart2, 
  Filter, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Archive,
  Eye,
  Wand2,
  ExternalLink
} from 'lucide-react';

const PIPELINE_STAGES: { key: ContentStatus; label: string; color: string; bg: string }[] = [
  { key: 'idea', label: 'Idea', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-700/50' },
  { key: 'planned', label: 'Planned', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  { key: 'in_production', label: 'In Production', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { key: 'review', label: 'Review', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { key: 'approved', label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { key: 'scheduled', label: 'Scheduled', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  { key: 'published', label: 'Published', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  { key: 'analyzed', label: 'Analyzed', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
];

function ContentPageContent() {
  const searchParams = useSearchParams();
  const initialNewModal = searchParams.get('action') === 'new';

  const {
    personas,
    contentItems,
    currentUser,
    members,
    selectedPersonaId,
    setSelectedPersonaId,
    platformFilter,
    setPlatformFilter,
    createContentItem,
    updateContentItem,
    deleteContentItem,
    duplicateContentItem,
    transitionContentStatus,
    recordContentMetrics
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | ContentStatus>('all');
  const [modalOpen, setModalOpen] = useState(initialNewModal);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [metricModalItem, setMetricModalItem] = useState<ContentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ContentItem>>({
    persona_id: selectedPersonaId !== 'all' ? selectedPersonaId : personas[0].id,
    platform: 'instagram',
    title: '',
    description: '',
    content_pillar: personas[0].core_pillars[0],
    content_format: 'reel',
    hook: '',
    caption: '',
    hashtags: [],
    production_notes: '',
    status: 'idea',
    scheduled_at: '',
    assigned_to: currentUser.user_id,
    assigned_to_name: currentUser.full_name,
  });

  const [hashtagsInput, setHashtagsInput] = useState('');
  const [isGeneratingHook, setIsGeneratingHook] = useState(false);

  // Manual Metrics Form
  const [metricForm, setMetricForm] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    reach: 0,
    profile_visits: 0,
    attributed_follows: 0,
  });

  // Filter items
  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      if (item.is_archived) return false;
      if (selectedPersonaId !== 'all' && item.persona_id !== selectedPersonaId) return false;
      if (platformFilter !== 'all' && item.platform !== 'both' && item.platform !== platformFilter) return false;
      if (stageFilter !== 'all' && item.status !== stageFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesHook = item.hook.toLowerCase().includes(query);
        const matchesPillar = item.content_pillar.toLowerCase().includes(query);
        if (!matchesTitle && !matchesHook && !matchesPillar) return false;
      }
      return true;
    });
  }, [contentItems, selectedPersonaId, platformFilter, stageFilter, searchQuery]);

  const openCreateModal = () => {
    const targetPersonaId = selectedPersonaId !== 'all' ? selectedPersonaId : personas[0].id;
    const persona = personas.find(p => p.id === targetPersonaId) || personas[0];

    setFormData({
      persona_id: persona.id,
      platform: 'instagram',
      title: '',
      description: '',
      content_pillar: persona.core_pillars[0],
      content_format: 'reel',
      hook: '',
      caption: '',
      hashtags: [],
      production_notes: '',
      status: 'idea',
      scheduled_at: '',
      assigned_to: currentUser.user_id,
      assigned_to_name: currentUser.full_name,
    });
    setHashtagsInput('');
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setHashtagsInput(item.hashtags.join(' '));
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = hashtagsInput
      .split(/[\s,]+/)
      .map((t) => (t.startsWith('#') ? t : `#${t}`))
      .filter((t) => t.length > 1);

    const payload = {
      ...formData,
      hashtags: tags,
    };

    if (editingItem) {
      updateContentItem(editingItem.id, payload);
    } else {
      createContentItem(payload);
    }
    setModalOpen(false);
  };

  const handleQuickAIAssist = async () => {
    const persona = personas.find((p) => p.id === formData.persona_id) || personas[0];
    setIsGeneratingHook(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona,
          requestType: 'concept',
          topicOrPillar: formData.content_pillar || formData.title,
          platform: formData.platform === 'both' ? 'instagram' : formData.platform,
          format: formData.content_format,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setFormData((prev) => ({
          ...prev,
          title: prev.title || json.data.title,
          hook: json.data.selected_hook || json.data.hooks?.[0] || prev.hook,
          caption: json.data.caption || prev.caption,
          production_notes: json.data.production_notes || prev.production_notes,
        }));
        if (json.data.hashtags) {
          setHashtagsInput(json.data.hashtags.join(' '));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingHook(false);
    }
  };

  const openMetricsModal = (item: ContentItem) => {
    setMetricModalItem(item);
    if (item.metrics) {
      setMetricForm({
        views: item.metrics.views || 0,
        likes: item.metrics.likes || 0,
        comments: item.metrics.comments || 0,
        shares: item.metrics.shares || 0,
        saves: item.metrics.saves || 0,
        reach: item.metrics.reach || 0,
        profile_visits: item.metrics.profile_visits || 0,
        attributed_follows: item.metrics.attributed_follows || 0,
      });
    } else {
      setMetricForm({
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        reach: 0,
        profile_visits: 0,
        attributed_follows: 0,
      });
    }
  };

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricModalItem) return;
    recordContentMetrics(metricModalItem.id, metricForm);
    setMetricModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Content Pipeline & Management System
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end 8-stage lifecycle from Idea to Analyzed across all 3 personas and 6 social channels
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition"
          >
            <Plus className="w-4 h-4" />
            Create Content
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D1220] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, opening hook, or content pillar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Stages (8)</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Persona quick filter */}
          <select
            value={selectedPersonaId}
            onChange={(e) => setSelectedPersonaId(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-300 text-xs focus:outline-none"
          >
            <option value="all">All Personas</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="flex space-x-4 overflow-x-auto pb-6 pt-2">
          {PIPELINE_STAGES.map((stage) => {
            const stageItems = filteredItems.filter((i) => i.status === stage.key);

            return (
              <div
                key={stage.key}
                className="w-80 shrink-0 bg-[#0C101D] border border-slate-800/90 rounded-2xl flex flex-col max-h-[750px]"
              >
                {/* Stage Header */}
                <div className={`p-3.5 border-b border-slate-800/80 rounded-t-2xl flex items-center justify-between ${stage.bg}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                      {stage.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-[11px] font-bold text-slate-300">
                    {stageItems.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1">
                  {stageItems.length === 0 ? (
                    <div className="py-8 text-center text-slate-600 text-xs border border-dashed border-slate-800/80 rounded-xl">
                      Empty stage
                    </div>
                  ) : (
                    stageItems.map((item) => {
                      const persona = personas.find((p) => p.id === item.persona_id);
                      const isHighRoller = persona?.archetype === 'high_roller';
                      const isNightlife = persona?.archetype === 'nightlife_insider';
                      const badgeColor = isHighRoller
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                        : isNightlife
                        ? 'text-purple-400 bg-purple-500/10 border-purple-500/30'
                        : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';

                      return (
                        <div
                          key={item.id}
                          className="bg-[#12182B] border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 space-y-2.5 shadow-md transition group"
                        >
                          {/* Persona & Platform Badges */}
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${badgeColor}`}>
                              {persona?.name.split(' ')[0]}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              {item.platform} • {item.content_format}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-xs leading-snug line-clamp-2">
                            {item.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/50">
                            "{item.hook}"
                          </p>

                          {/* Content Pillar */}
                          <div className="text-[10px] text-slate-400 font-medium">
                            <span className="text-slate-500 uppercase">Pillar:</span> {item.content_pillar}
                          </div>

                          {/* Scheduling & Attribution footer */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                            <span>Assignee: {item.assigned_to_name?.split(' ')[0] || 'Team'}</span>
                            {item.scheduled_at && (
                              <span className="text-cyan-400 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                {new Date(item.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>

                          {/* Quick Actions Bar */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => openEditModal(item)}
                                title="Edit Content"
                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => duplicateContentItem(item.id)}
                                title="Duplicate"
                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openMetricsModal(item)}
                                title="Log Metrics"
                                className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded"
                              >
                                <BarChart2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteContentItem(item.id)}
                                title="Delete"
                                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Status Stepper Button */}
                            {stage.key !== 'analyzed' && (
                              <button
                                onClick={() => {
                                  const currentIndex = PIPELINE_STAGES.findIndex((s) => s.key === stage.key);
                                  if (currentIndex < PIPELINE_STAGES.length - 1) {
                                    transitionContentStatus(item.id, PIPELINE_STAGES[currentIndex + 1].key);
                                  }
                                }}
                                className="text-[10px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-0.5 px-2 py-1 bg-purple-950/40 border border-purple-500/20 rounded-md"
                              >
                                Advance <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#0D1220] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#12182B] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Persona</th>
                  <th className="px-4 py-3">Title & Hook</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Pillar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredItems.map((item) => {
                  const persona = personas.find((p) => p.id === item.persona_id);
                  const stageObj = PIPELINE_STAGES.find((s) => s.key === item.status);

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition">
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        {persona?.name}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-bold text-white text-xs truncate">{item.title}</div>
                        <div className="text-[11px] text-slate-400 truncate italic">"{item.hook}"</div>
                      </td>
                      <td className="px-4 py-3 uppercase text-[10px] font-semibold">
                        {item.platform} ({item.content_format})
                      </td>
                      <td className="px-4 py-3 text-slate-400">{item.content_pillar}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${stageObj?.bg} ${stageObj?.color}`}>
                          {stageObj?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.scheduled_at 
                          ? new Date(item.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {item.assigned_to_name}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => duplicateContentItem(item.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          onClick={() => openMetricsModal(item)}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          <BarChart2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Creation / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#101524] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {editingItem ? 'Edit Persona Content' : 'Create New Persona Content'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Persona and Platform Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Persona *</label>
                  <select
                    value={formData.persona_id}
                    onChange={(e) => {
                      const p = personas.find(per => per.id === e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        persona_id: e.target.value,
                        content_pillar: p?.core_pillars[0] || prev.content_pillar
                      }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  >
                    {personas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.archetype.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Platform & Format *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value as any }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="both">Both Platforms</option>
                    </select>

                    <select
                      value={formData.content_format}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_format: e.target.value as any }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                    >
                      <option value="reel">Reel</option>
                      <option value="tiktok_video">TikTok Video</option>
                      <option value="carousel">Carousel</option>
                      <option value="story">Story</option>
                      <option value="static_photo">Static Photo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Title & Content Pillar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Content Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inside the $45K Penthouse Suite"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Content Pillar *</label>
                  <select
                    value={formData.content_pillar}
                    onChange={(e) => setFormData(prev => ({ ...prev, content_pillar: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  >
                    {personas.find(p => p.id === formData.persona_id)?.core_pillars.map((pill, idx) => (
                      <option key={idx} value={pill}>
                        {pill}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Opening Hook with AI Assist Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">Opening Hook (First 3 Seconds) *</label>
                  <button
                    type="button"
                    onClick={handleQuickAIAssist}
                    disabled={isGeneratingHook}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    {isGeneratingHook ? 'Brainstorming...' : 'Generate with Gemini AI'}
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Provocative, high-retention hook that stops the scroll..."
                  value={formData.hook}
                  onChange={(e) => setFormData(prev => ({ ...prev, hook: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Caption *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Caption written in persona's distinctive voice and style..."
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono text-[11px]"
                />
              </div>

              {/* Hashtags & Scheduled Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hashtags (Space separated)</label>
                  <input
                    type="text"
                    placeholder="#VegasVIP #LuxuryHotel #SalonPrive"
                    value={hashtagsInput}
                    onChange={(e) => setHashtagsInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Scheduled Publication Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_at ? formData.scheduled_at.slice(0, 16) : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  />
                </div>
              </div>

              {/* Production Notes & Status & Assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Production Notes & Avatar Prompts</label>
                  <input
                    type="text"
                    placeholder="Lighting notes, wardrobe, audio timing, render instructions..."
                    value={formData.production_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, production_notes: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Workflow Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Collaborator: <span className="text-white font-semibold">{currentUser.full_name}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold shadow-md shadow-purple-900/30 hover:opacity-95"
                  >
                    {editingItem ? 'Save Updates' : 'Add to Pipeline'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Metrics Recording Modal */}
      {metricModalItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#101524] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  Record Performance Metrics
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-sm mt-0.5">
                  {metricModalItem.title}
                </p>
              </div>
              <button
                onClick={() => setMetricModalItem(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMetrics} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Views</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.views}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total Reach</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.reach}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, reach: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Likes</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.likes}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Comments</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.comments}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Shares</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.shares}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, shares: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Saves</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.saves}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, saves: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Profile Visits</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.profile_visits}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, profile_visits: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Attributed Follows</label>
                  <input
                    type="number"
                    min="0"
                    value={metricForm.attributed_follows}
                    onChange={(e) => setMetricForm(prev => ({ ...prev, attributed_follows: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setMetricModalItem(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
                >
                  Save Metrics & Recompute ER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500 text-xs">Loading Content Pipeline...</div>}>
      <ContentPageContent />
    </Suspense>
  );
}
