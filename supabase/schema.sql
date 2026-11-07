-- ==============================================================================
-- AI INFLUENCER MANAGEMENT STUDIO - DATABASE SCHEMA
-- Multi-Tenant Workspace Architecture with PostgreSQL & Supabase RLS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WORKSPACES (Shared Organization / Workspace)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    settings JSONB DEFAULT '{"timezone": "America/Los_Angeles", "require_approval": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. WORKSPACE MEMBERS (Team Collaboration: Admins, Partners, Content Strategists)
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'partner', 'editor', 'viewer')) DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(workspace_id, email)
);

-- 3. PERSONAS (The 3 Independent AI Influencer Identities)
CREATE TABLE IF NOT EXISTS public.personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    soul_id TEXT,
    dramatic_role TEXT,
    archetype TEXT NOT NULL CHECK (archetype IN ('high_roller', 'nightlife_insider', 'poolside_specialist')),
    tagline TEXT NOT NULL,
    bio TEXT NOT NULL,
    voice_and_tone JSONB NOT NULL DEFAULT '{"style": "Opulent & Exclusive", "pacing": "Fast & High energy", "lexicon": ["VIP", "High Roller", "Bespoke"]}'::jsonb,
    target_audience TEXT NOT NULL,
    core_pillars JSONB NOT NULL DEFAULT '["VIP Casino", "High Roller Suites", "Bespoke Hospitality", "Luxury Fashion"]'::jsonb,
    visual_guidelines JSONB NOT NULL DEFAULT '{"lighting": "Dramatic golden-hour & velvet night", "aesthetic": "Ultra-luxury, sleek high fashion"}'::jsonb,
    color_theme JSONB NOT NULL DEFAULT '{"primary": "#F59E0B", "accent": "#D97706", "badge": "amber"}'::jsonb,
    avatar_url TEXT,
    banner_url TEXT,
    is_ai_disclosed BOOLEAN NOT NULL DEFAULT true,
    ai_disclosure_statement TEXT NOT NULL DEFAULT 'Created with AI. Virtual Host & Digital Creator based in Las Vegas.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(workspace_id, slug)
);

-- 4. SOCIAL ACCOUNTS (The 6 Social Accounts: 2 per Persona)
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
    handle TEXT NOT NULL,
    display_name TEXT NOT NULL,
    profile_url TEXT,
    follower_count INTEGER NOT NULL DEFAULT 0,
    weekly_follower_growth INTEGER NOT NULL DEFAULT 0,
    total_views BIGINT NOT NULL DEFAULT 0,
    avg_engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('active', 'review', 'paused')) DEFAULT 'active',
    auth_connected BOOLEAN NOT NULL DEFAULT false,
    api_credentials JSONB DEFAULT '{}'::jsonb,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(persona_id, platform)
);

-- 5. CONTENT ITEMS (Master Content Management & Lifecycle Pipeline)
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE SET NULL,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'both')),
    title TEXT NOT NULL,
    description TEXT,
    content_pillar TEXT NOT NULL,
    content_format TEXT NOT NULL CHECK (content_format IN ('reel', 'tiktok_video', 'carousel', 'story', 'static_photo')),
    hook TEXT NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    media_attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
    production_notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('idea', 'planned', 'in_production', 'review', 'approved', 'scheduled', 'published', 'analyzed')) DEFAULT 'idea',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    published_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_by_name TEXT,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by_name TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to_name TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. CONTENT METRICS (Granular performance tracking)
CREATE TABLE IF NOT EXISTS public.content_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
    views BIGINT NOT NULL DEFAULT 0,
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    shares INTEGER NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0,
    reach BIGINT NOT NULL DEFAULT 0,
    engagement_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    profile_visits INTEGER NOT NULL DEFAULT 0,
    attributed_follows INTEGER NOT NULL DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    source TEXT NOT NULL CHECK (source IN ('manual', 'official_api', 'simulated_batch')) DEFAULT 'manual'
);

-- 7. TASKS (Shared task management for admins & team)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    content_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
    persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to_name TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_by_name TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. VIRAL TRENDS (AI Viral Research Engine)
CREATE TABLE IF NOT EXISTS public.viral_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    trend_description TEXT NOT NULL,
    source_url TEXT,
    platform TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'general')),
    evidence_of_popularity TEXT NOT NULL,
    why_it_gains_attention TEXT NOT NULL,
    recommended_persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
    adaptation_ideas JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggested_opening_hook TEXT NOT NULL,
    viral_potential_score INTEGER NOT NULL CHECK (viral_potential_score BETWEEN 1 AND 100) DEFAULT 75,
    recommendation TEXT NOT NULL CHECK (recommendation IN ('pursue', 'monitor', 'ignore')) DEFAULT 'pursue',
    is_verified_observation BOOLEAN NOT NULL DEFAULT true,
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. WEEKLY STRATEGY REPORTS (AI Weekly Strategist)
CREATE TABLE IF NOT EXISTS public.weekly_strategy_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES public.personas(id) ON DELETE SET NULL,
    week_start_date DATE NOT NULL,
    week_end_date DATE NOT NULL,
    what_worked JSONB NOT NULL DEFAULT '[]'::jsonb,
    what_failed JSONB NOT NULL DEFAULT '[]'::jsonb,
    improving_formats JSONB NOT NULL DEFAULT '[]'::jsonb,
    topics_to_expand JSONB NOT NULL DEFAULT '[]'::jsonb,
    what_to_stop JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_experiments JSONB NOT NULL DEFAULT '[]'::jsonb,
    proposed_content_calendar JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence_summary TEXT NOT NULL,
    generated_by_ai BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 10. AUDIT LOGS (Collaboration History & Attribution)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viral_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_strategy_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function to verify workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is authenticated and part of workspace
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = ws_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for multi-user collaboration
CREATE POLICY "Workspace members can view workspace" ON public.workspaces
    FOR SELECT USING (is_workspace_member(id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can view members" ON public.workspace_members
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() = user_id);

CREATE POLICY "Workspace members can manage personas" ON public.personas
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can manage social accounts" ON public.social_accounts
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can manage content" ON public.content_items
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can view/manage metrics" ON public.content_metrics
    FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can manage tasks" ON public.tasks
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can view/manage viral trends" ON public.viral_trends
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can view/manage weekly reports" ON public.weekly_strategy_reports
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);

CREATE POLICY "Workspace members can view audit logs" ON public.audit_logs
    FOR ALL USING (is_workspace_member(workspace_id) OR auth.uid() IS NOT NULL);
