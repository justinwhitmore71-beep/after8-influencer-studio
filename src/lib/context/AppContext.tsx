'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Workspace, 
  WorkspaceMember, 
  Persona, 
  SocialAccount, 
  ContentItem, 
  ContentStatus,
  ContentMetric,
  Task, 
  ViralTrend, 
  WeeklyStrategyReport,
  AuditLog,
  SocialPlatform,
  ContentPlatform
} from '@/types';
import { 
  INITIAL_WORKSPACE, 
  INITIAL_MEMBERS, 
  INITIAL_PERSONAS, 
  INITIAL_SOCIAL_ACCOUNTS, 
  INITIAL_CONTENT_ITEMS, 
  INITIAL_TASKS, 
  INITIAL_TRENDS, 
  INITIAL_STRATEGY_REPORT 
} from '@/lib/data/initialData';

interface AppContextType {
  workspace: Workspace;
  members: WorkspaceMember[];
  currentUser: WorkspaceMember;
  setCurrentUser: (member: WorkspaceMember) => void;
  personas: Persona[];
  selectedPersonaId: string | 'all';
  setSelectedPersonaId: (id: string | 'all') => void;
  socialAccounts: SocialAccount[];
  contentItems: ContentItem[];
  tasks: Task[];
  viralTrends: ViralTrend[];
  strategyReports: WeeklyStrategyReport[];
  auditLogs: AuditLog[];
  
  // Filters
  platformFilter: 'all' | SocialPlatform;
  setPlatformFilter: (platform: 'all' | SocialPlatform) => void;
  dateRangeFilter: '7d' | '14d' | '30d' | 'all';
  setDateRangeFilter: (range: '7d' | '14d' | '30d' | 'all') => void;

  // Actions
  createContentItem: (item: Partial<ContentItem>) => ContentItem;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  duplicateContentItem: (id: string) => ContentItem | null;
  deleteContentItem: (id: string) => void;
  transitionContentStatus: (id: string, newStatus: ContentStatus) => void;
  recordContentMetrics: (contentId: string, metrics: Partial<ContentMetric>) => void;
  
  createTask: (task: Partial<Task>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  addViralTrend: (trend: Partial<ViralTrend>) => ViralTrend;
  convertTrendToContent: (trendId: string, personaId?: string) => ContentItem | null;
  
  saveStrategyReport: (report: WeeklyStrategyReport) => void;
  inviteTeamMember: (email: string, full_name: string, role: WorkspaceMember['role']) => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'after8_talent_ops_v8_clean_start_';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [workspace] = useState<Workspace>(INITIAL_WORKSPACE);
  const [members, setMembers] = useState<WorkspaceMember[]>(INITIAL_MEMBERS);
  const [currentUser, setCurrentUser] = useState<WorkspaceMember>(INITIAL_MEMBERS[0]);
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [contentItems, setContentItems] = useState<ContentItem[]>(INITIAL_CONTENT_ITEMS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viralTrends, setViralTrends] = useState<ViralTrend[]>(INITIAL_TRENDS);
  const [strategyReports, setStrategyReports] = useState<WeeklyStrategyReport[]>([INITIAL_STRATEGY_REPORT]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Filters
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | SocialPlatform>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'7d' | '14d' | '30d' | 'all'>('30d');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(`${STORAGE_KEY_PREFIX}content`);
      if (savedContent) setContentItems(JSON.parse(savedContent));

      const savedTasks = localStorage.getItem(`${STORAGE_KEY_PREFIX}tasks`);
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedTrends = localStorage.getItem(`${STORAGE_KEY_PREFIX}trends`);
      if (savedTrends) setViralTrends(JSON.parse(savedTrends));

      const savedReports = localStorage.getItem(`${STORAGE_KEY_PREFIX}reports`);
      if (savedReports) setStrategyReports(JSON.parse(savedReports));

      const savedAccounts = localStorage.getItem(`${STORAGE_KEY_PREFIX}accounts`);
      if (savedAccounts) setSocialAccounts(JSON.parse(savedAccounts));

      const savedLogs = localStorage.getItem(`${STORAGE_KEY_PREFIX}logs`);
      if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

      const savedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}currentUser`);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn('Could not read from local storage', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}content`, JSON.stringify(contentItems));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}trends`, JSON.stringify(viralTrends));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reports`, JSON.stringify(strategyReports));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}accounts`, JSON.stringify(socialAccounts));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}logs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}currentUser`, JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not persist to local storage', e);
    }
  }, [contentItems, tasks, viralTrends, strategyReports, socialAccounts, auditLogs, currentUser]);

  const logAudit = (action: string, entity_type: string, entity_id: string, details: Record<string, unknown> = {}) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workspace_id: workspace.id,
      user_id: currentUser.user_id,
      user_name: currentUser.full_name,
      action,
      entity_type,
      entity_id,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  const createContentItem = (data: Partial<ContentItem>): ContentItem => {
    const persona = personas.find(p => p.id === data.persona_id) || personas[0];
    const platform = data.platform || 'instagram';
    
    // Find matching social account
    const matchedAccount = socialAccounts.find(
      acc => acc.persona_id === persona.id && (platform === 'both' ? acc.platform === 'instagram' : acc.platform === platform)
    );

    const newItem: ContentItem = {
      id: `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workspace_id: workspace.id,
      persona_id: persona.id,
      social_account_id: matchedAccount?.id,
      platform: platform as ContentPlatform,
      title: data.title || 'Untitled Post',
      description: data.description || '',
      content_pillar: data.content_pillar || persona.core_pillars[0] || 'General',
      content_format: data.content_format || 'reel',
      hook: data.hook || '',
      caption: data.caption || '',
      hashtags: data.hashtags || [],
      media_attachments: data.media_attachments || [],
      production_notes: data.production_notes || '',
      status: data.status || 'idea',
      scheduled_at: data.scheduled_at,
      published_at: data.published_at,
      published_url: data.published_url,
      created_by: currentUser.user_id,
      created_by_name: currentUser.full_name,
      assigned_to: data.assigned_to || currentUser.user_id,
      assigned_to_name: data.assigned_to_name || currentUser.full_name,
      is_archived: false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setContentItems((prev) => [newItem, ...prev]);
    logAudit('Created content item', 'content_item', newItem.id, { title: newItem.title, persona: persona.name });
    return newItem;
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = {
          ...item,
          ...updates,
          version: item.version + 1,
          updated_by: currentUser.user_id,
          updated_by_name: currentUser.full_name,
          updated_at: new Date().toISOString(),
        };
        logAudit('Updated content item', 'content_item', id, { title: updated.title, updates: Object.keys(updates) });
        return updated;
      })
    );
  };

  const duplicateContentItem = (id: string): ContentItem | null => {
    const original = contentItems.find((c) => c.id === id);
    if (!original) return null;

    const duplicated: ContentItem = {
      ...original,
      id: `cnt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${original.title} (Copy)`,
      status: 'idea',
      scheduled_at: undefined,
      published_at: undefined,
      published_url: undefined,
      metrics: undefined,
      created_by: currentUser.user_id,
      created_by_name: currentUser.full_name,
      updated_by: undefined,
      updated_by_name: undefined,
      approved_by: undefined,
      approved_by_name: undefined,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setContentItems((prev) => [duplicated, ...prev]);
    logAudit('Duplicated content item', 'content_item', duplicated.id, { from: original.title });
    return duplicated;
  };

  const deleteContentItem = (id: string) => {
    const target = contentItems.find(c => c.id === id);
    setContentItems((prev) => prev.filter((item) => item.id !== id));
    logAudit('Deleted content item', 'content_item', id, { title: target?.title });
  };

  const transitionContentStatus = (id: string, newStatus: ContentStatus) => {
    setContentItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updates: Partial<ContentItem> = {
          status: newStatus,
          updated_by: currentUser.user_id,
          updated_by_name: currentUser.full_name,
          updated_at: new Date().toISOString(),
        };

        if (newStatus === 'approved') {
          updates.approved_by = currentUser.user_id;
          updates.approved_by_name = currentUser.full_name;
        }

        if (newStatus === 'published' && !item.published_at) {
          updates.published_at = new Date().toISOString();
        }

        logAudit(`Moved to ${newStatus.toUpperCase()}`, 'content_item', id, { title: item.title, from: item.status, to: newStatus });
        return { ...item, ...updates };
      })
    );
  };

  const recordContentMetrics = (contentId: string, metrics: Partial<ContentMetric>) => {
    setContentItems((prev) =>
      prev.map((item) => {
        if (item.id !== contentId) return item;

        const currentMetrics = item.metrics || {
          id: `met-${Date.now()}`,
          content_id: contentId,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          saves: 0,
          reach: 0,
          engagement_rate: 0,
          profile_visits: 0,
          attributed_follows: 0,
          recorded_at: new Date().toISOString(),
          source: 'manual',
        };

        const updatedMetrics: ContentMetric = {
          ...currentMetrics,
          ...metrics,
          recorded_at: new Date().toISOString(),
          recorded_by: currentUser.user_id,
        };

        // Recalculate engagement rate if views > 0
        if (updatedMetrics.views > 0) {
          const totalEngagements = 
            (updatedMetrics.likes || 0) + 
            (updatedMetrics.comments || 0) + 
            (updatedMetrics.shares || 0) + 
            (updatedMetrics.saves || 0);
          updatedMetrics.engagement_rate = Number(((totalEngagements / updatedMetrics.views) * 100).toFixed(2));
        }

        logAudit('Recorded performance metrics', 'content_metric', contentId, { views: updatedMetrics.views, er: updatedMetrics.engagement_rate });

        return {
          ...item,
          status: item.status === 'published' ? 'analyzed' : item.status,
          metrics: updatedMetrics,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const createTask = (data: Partial<Task>): Task => {
    const newTask: Task = {
      id: `tsk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workspace_id: workspace.id,
      content_id: data.content_id,
      persona_id: data.persona_id,
      title: data.title || 'New Task',
      description: data.description || '',
      priority: data.priority || 'medium',
      status: data.status || 'todo',
      due_date: data.due_date || new Date(Date.now() + 86400000 * 2).toISOString(),
      assigned_to: data.assigned_to || currentUser.user_id,
      assigned_to_name: data.assigned_to_name || currentUser.full_name,
      created_by: currentUser.user_id,
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    logAudit('Created task', 'task', newTask.id, { title: newTask.title, assigned_to: newTask.assigned_to_name });
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
    logAudit('Updated task', 'task', id, updates);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    logAudit('Deleted task', 'task', id);
  };

  const addViralTrend = (data: Partial<ViralTrend>): ViralTrend => {
    const newTrend: ViralTrend = {
      id: `trd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      workspace_id: workspace.id,
      title: data.title || 'Emerging Short-Form Trend',
      trend_description: data.trend_description || '',
      source_url: data.source_url || '',
      platform: data.platform || 'tiktok',
      evidence_of_popularity: data.evidence_of_popularity || '',
      why_it_gains_attention: data.why_it_gains_attention || '',
      recommended_persona_id: data.recommended_persona_id || personas[0].id,
      adaptation_ideas: data.adaptation_ideas || [],
      suggested_opening_hook: data.suggested_opening_hook || '',
      viral_potential_score: data.viral_potential_score || 80,
      recommendation: data.recommendation || 'pursue',
      is_verified_observation: data.is_verified_observation !== undefined ? data.is_verified_observation : true,
      tags: data.tags || ['trending', 'viral', 'vegas'],
      created_at: new Date().toISOString(),
    };

    setViralTrends((prev) => [newTrend, ...prev]);
    logAudit('Logged viral trend discovery', 'viral_trend', newTrend.id, { title: newTrend.title, score: newTrend.viral_potential_score });
    return newTrend;
  };

  const convertTrendToContent = (trendId: string, customPersonaId?: string): ContentItem | null => {
    const trend = viralTrends.find((t) => t.id === trendId);
    if (!trend) return null;

    const personaId = customPersonaId || trend.recommended_persona_id || personas[0].id;
    const persona = personas.find((p) => p.id === personaId) || personas[0];
    const topIdea = trend.adaptation_ideas[0];

    const newContent = createContentItem({
      persona_id: persona.id,
      platform: trend.platform === 'general' ? 'both' : (trend.platform as ContentPlatform),
      title: topIdea ? topIdea.title : `Trend Adaptation: ${trend.title}`,
      description: topIdea ? topIdea.description : trend.trend_description,
      content_pillar: persona.core_pillars[0],
      content_format: topIdea?.target_format || 'reel',
      hook: trend.suggested_opening_hook,
      caption: `Adapted from viral trend "${trend.title}".\n\n${persona.bio}`,
      hashtags: trend.tags.map((t) => `#${t.replace(/\s+/g, '')}`),
      status: 'idea',
      production_notes: `Originated from Viral Research Engine (Score: ${trend.viral_potential_score}/100).\nWhy it works: ${trend.why_it_gains_attention}`,
    });

    logAudit('Converted trend to pipeline content', 'content_item', newContent.id, { trend: trend.title });
    return newContent;
  };

  const saveStrategyReport = (report: WeeklyStrategyReport) => {
    setStrategyReports((prev) => [report, ...prev]);
    logAudit('Generated and saved Weekly Strategy Report', 'strategy_report', report.id, {
      dates: `${report.week_start_date} to ${report.week_end_date}`,
    });
  };

  const inviteTeamMember = (email: string, full_name: string, role: WorkspaceMember['role']) => {
    const newMember: WorkspaceMember = {
      id: `mem-${Date.now()}`,
      workspace_id: workspace.id,
      user_id: `usr-${Date.now()}`,
      email,
      full_name,
      role,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
      created_at: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    logAudit('Invited new workspace collaborator', 'workspace_member', newMember.id, { email, role });
  };

  const resetToInitialData = () => {
    setContentItems(INITIAL_CONTENT_ITEMS);
    setTasks(INITIAL_TASKS);
    setViralTrends(INITIAL_TRENDS);
    setStrategyReports([INITIAL_STRATEGY_REPORT]);
    setSocialAccounts(INITIAL_SOCIAL_ACCOUNTS);
    setMembers(INITIAL_MEMBERS);
    setAuditLogs([]);
    logAudit('Reset database to initial seed state', 'workspace', workspace.id);
  };

  return (
    <AppContext.Provider
      value={{
        workspace,
        members,
        currentUser,
        setCurrentUser,
        personas,
        selectedPersonaId,
        setSelectedPersonaId,
        socialAccounts,
        contentItems,
        tasks,
        viralTrends,
        strategyReports,
        auditLogs,
        platformFilter,
        setPlatformFilter,
        dateRangeFilter,
        setDateRangeFilter,
        createContentItem,
        updateContentItem,
        duplicateContentItem,
        deleteContentItem,
        transitionContentStatus,
        recordContentMetrics,
        createTask,
        updateTask,
        deleteTask,
        addViralTrend,
        convertTrendToContent,
        saveStrategyReport,
        inviteTeamMember,
        resetToInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
