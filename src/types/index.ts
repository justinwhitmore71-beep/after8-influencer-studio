export type PersonaArchetype = 'rookie' | 'insider' | 'wildcard';
export type SocialPlatform = 'instagram' | 'tiktok';
export type ContentPlatform = 'instagram' | 'tiktok' | 'both';

export type ContentStatus = 
  | 'idea'
  | 'planned'
  | 'in_production'
  | 'review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'analyzed';

export type ContentFormat = 'reel' | 'tiktok_video' | 'carousel' | 'story' | 'static_photo';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type UserRole = 'owner' | 'admin' | 'partner' | 'editor' | 'viewer';
export type TrendRecommendation = 'pursue' | 'monitor' | 'ignore';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings: {
    timezone: string;
    require_approval: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Persona {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  soul_id?: string;
  dramatic_role?: string;
  archetype: PersonaArchetype;
  tagline: string;
  bio: string;
  voice_and_tone: {
    style: string;
    pacing: string;
    lexicon: string[];
    boundaries: string[];
  };
  target_audience: string;
  core_pillars: string[];
  visual_guidelines: {
    lighting: string;
    aesthetic: string;
    wardrobe: string;
  };
  color_theme: {
    primary: string;
    accent: string;
    badge: string;
    border: string;
    bgGradient: string;
  };
  avatar_url: string;
  banner_url: string;
  is_ai_disclosed: boolean;
  ai_disclosure_statement: string;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  workspace_id: string;
  persona_id: string;
  platform: SocialPlatform;
  handle: string;
  display_name: string;
  profile_url: string;
  follower_count: number;
  weekly_follower_growth: number;
  total_views: number;
  avg_engagement_rate: number;
  status: 'active' | 'review' | 'paused';
  auth_connected: boolean;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaAttachment {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  title?: string;
}

export interface ContentMetric {
  id: string;
  content_id: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  engagement_rate: number;
  profile_visits: number;
  attributed_follows: number;
  recorded_at: string;
  recorded_by?: string;
  source: 'manual' | 'official_api' | 'simulated_batch';
}

export interface ContentItem {
  id: string;
  workspace_id: string;
  persona_id: string;
  social_account_id?: string;
  platform: ContentPlatform;
  title: string;
  description?: string;
  content_pillar: string;
  content_format: ContentFormat;
  hook: string;
  caption: string;
  hashtags: string[];
  media_attachments: MediaAttachment[];
  production_notes?: string;
  status: ContentStatus;
  scheduled_at?: string;
  published_at?: string;
  published_url?: string;
  created_by?: string;
  created_by_name?: string;
  updated_by?: string;
  updated_by_name?: string;
  approved_by?: string;
  approved_by_name?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  is_archived: boolean;
  version: number;
  metrics?: ContentMetric;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  content_id?: string;
  persona_id?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ViralTrend {
  id: string;
  workspace_id: string;
  title: string;
  trend_description: string;
  source_url?: string;
  platform: 'tiktok' | 'instagram' | 'general';
  evidence_of_popularity: string;
  why_it_gains_attention: string;
  recommended_persona_id?: string;
  adaptation_ideas: {
    title: string;
    description: string;
    target_format: ContentFormat;
  }[];
  suggested_opening_hook: string;
  viral_potential_score: number;
  recommendation: TrendRecommendation;
  is_verified_observation: boolean;
  tags: string[];
  created_at: string;
}

export interface WeeklyStrategyReport {
  id: string;
  workspace_id: string;
  persona_id?: string;
  week_start_date: string;
  week_end_date: string;
  what_worked: { topic: string; metric: string; insight: string }[];
  what_failed: { topic: string; reason: string; corrective_action: string }[];
  improving_formats: { format: string; growth_rate: string; notes: string }[];
  topics_to_expand: { topic: string; potential: string }[];
  what_to_stop: { practice: string; rationale: string }[];
  recommended_experiments: { title: string; hypothesis: string; target_persona: string; kpi: string }[];
  proposed_content_calendar: {
    day: string;
    persona: string;
    platform: ContentPlatform;
    format: ContentFormat;
    hook: string;
    concept: string;
  }[];
  evidence_summary: string;
  generated_by_ai: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  user_id?: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  created_at: string;
}
