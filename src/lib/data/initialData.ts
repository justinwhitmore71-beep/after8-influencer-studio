import { 
  Workspace, 
  WorkspaceMember, 
  Persona, 
  SocialAccount, 
  ContentItem, 
  Task, 
  ViralTrend, 
  WeeklyStrategyReport 
} from '@/types';

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws-after8-talent-001',
  name: 'After Eight Digital Talent',
  slug: 'after-eight-digital',
  settings: {
    timezone: 'America/Los_Angeles',
    require_approval: true,
  },
  created_at: '2026-10-22T00:00:00Z',
  updated_at: '2026-11-07T00:00:00Z',
};

export const INITIAL_MEMBERS: WorkspaceMember[] = [
  {
    id: 'mem-evan-founder',
    workspace_id: 'ws-after8-talent-001',
    user_id: 'usr-evan-surratt',
    email: 'evan@after8.digital',
    full_name: 'Evan Surratt (Founder / Approvals)',
    role: 'owner',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    created_at: '2026-10-22T00:00:00Z',
  },
  {
    id: 'mem-justin-prod',
    workspace_id: 'ws-after8-talent-001',
    user_id: 'usr-justin-whitmore',
    email: 'justin@after8.digital',
    full_name: 'Justin Whitmore (Production Lead)',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    created_at: '2026-10-22T00:00:00Z',
  },
];

export const INITIAL_PERSONAS: Persona[] = [
  {
    id: 'persona-ava-montcrief',
    workspace_id: 'ws-after8-talent-001',
    name: 'Ava Montcrief',
    slug: 'ava-montcrief',
    soul_id: 'b7b1cebf-362c-48e4-b8a9-77801e1cd5c1',
    dramatic_role: 'The Rookie / Opportunity ("What if the hardest part isn’t being good enough?")',
    archetype: 'high_roller',
    tagline: 'The Rookie • Testing My Limits in Vegas Hospitality',
    bio: 'Fictional adult (21, turning 22 Dec 2026). Lexington, KY native & former college athlete. Striking athletic build, light-blonde hair, blue eyes. Relatable, competitive, earnest, and learning that politics and timing trump sheer work ethic.',
    voice_and_tone: {
      style: 'Energetic vlog to "chat", playful competitive one-liners, self-aware humor, confessions, owning mistakes in public.',
      pacing: 'Brisk, upbeat, earnest and transparently vulnerable.',
      lexicon: ['Chat', 'Rookie season', 'Tryout vs politics', 'Leg day', 'Audition checklist', 'Vegas learning curve'],
      boundaries: ['No hollow pep talks', 'No cynical financial lectures', 'Must not pretend to have Jackie’s lived server expertise', 'Never represent real venue contracts']
    },
    target_audience: 'Aspirational young hospitality workers, fitness/athleisure fans, audition hopefuls, and social drama followers.',
    core_pillars: [
      'Rookie Season Diaries: The Audition Prep',
      'Athletic Preparation & Fitness Regimen',
      'Audition Checklists & Selection Reality',
      'Fit, Beauty & Audition Styling'
    ],
    visual_guidelines: {
      lighting: 'Bright natural gym light, clean modern apartment prep lighting, cinematic audition glow',
      aesthetic: 'Athletic, fresh, natural anatomy, clean sporty chic with light-blonde hair and blue eyes',
      wardrobe: 'High-performance athleisure, sleek audition dresses, minimalist jewelry'
    },
    color_theme: {
      primary: '#F59E0B',
      accent: '#D97706',
      badge: 'amber',
      border: 'border-amber-500/40',
      bgGradient: 'from-amber-950/40 via-amber-900/10 to-transparent'
    },
    avatar_url: '/characters/ava_montcrief.jpg',
    banner_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
    is_ai_disclosed: true,
    ai_disclosure_statement: 'Fictional AI Creator • Series: WILL VEGAS HIRE HER? • After Eight Digital Talent',
    created_at: '2026-10-22T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'persona-jackie-quintera',
    workspace_id: 'ws-after8-talent-001',
    name: 'Jackie Quintera',
    slug: 'jackie-quintera',
    soul_id: 'd14fdf5c-91c6-40b8-9c1c-54bd62fcd55b',
    dramatic_role: 'The Insider / Money ("Vegas pays well. The trick is keeping the money.")',
    archetype: 'nightlife_insider',
    tagline: 'The Insider • The Exit Number & Vegas Worker Economics',
    bio: 'Fictional adult Las Vegas native, former bartender and experienced nightclub/dayclub cocktail server. Clever, teasing, witty, socially observant, fiercely loyal to service staff, and cynical about empty management promises.',
    voice_and_tone: {
      style: 'Fast, sharp, flirtatious humor, quick undercut, money math, caring older-sister counsel.',
      pacing: 'Rapid-fire, punchy, sardonic but warm.',
      lexicon: ['The Exit Number', 'Shift math', 'Keeping the money', 'Tuesday bank account', 'Floor politics', 'Server code'],
      boundaries: ['Not a regulated financial advisor', 'Never fabricate addictions or vices', 'Do not claim real venue employment', 'Respect actual working hospitality staff']
    },
    target_audience: 'Nightlife staff, industry insiders, service workers, financial literacy seekers, and dark comedy fans.',
    core_pillars: [
      'The Exit Number: Shift Economics & Tip Math',
      'Behind-the-Service Reality & Floor Politics',
      'Unwritten Rules of Vegas Nightclubs',
      'Practical Luxury & Savings vs Spending'
    ],
    visual_guidelines: {
      lighting: 'Moody neon purples, warm bar backlights, late-night kitchen table lamp lighting',
      aesthetic: 'Street-smart Vegas native chic, sharp and observant, cocktail aesthetic',
      wardrobe: 'Sleek server black, vintage leather jackets, edgy streetwear for casual mode'
    },
    color_theme: {
      primary: '#8B5CF6',
      accent: '#7C3AED',
      badge: 'indigo',
      border: 'border-indigo-500/40',
      bgGradient: 'from-indigo-950/40 via-purple-900/10 to-transparent'
    },
    avatar_url: '/characters/jackie_quintera.jpg',
    banner_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    is_ai_disclosed: true,
    ai_disclosure_statement: 'Fictional AI Creator • Series: WILL VEGAS HIRE HER? • After Eight Digital Talent',
    created_at: '2026-10-22T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'persona-sienna-torneu',
    workspace_id: 'ws-after8-talent-001',
    name: 'Sienna Torneu',
    slug: 'sienna-torneu',
    soul_id: '8ea0e6ab-e1d0-4953-a3bc-8cc118e0c97b',
    dramatic_role: 'The Wildcard / Freedom ("Work the season. Live the year.")',
    archetype: 'poolside_specialist',
    tagline: 'The Wildcard • Work the season. Live the year.',
    bio: 'Fictional adult age 26; Greek/Italian family heritage; California-connected seasonal hospitality traveler. Brunette with warm Mediterranean complexion, hazel/brown eyes. Fiercely independent, dryly funny, alternating between hotel-lobby elegance and festival/PLUR/afterhours charisma.',
    voice_and_tone: {
      style: 'Short, warm Californian observations, dry wit, fearless jokes, magnetic and socially fearless.',
      pacing: 'Effortless, melodic, cinematic with sudden witty pivots.',
      lexicon: ['Work the season, live the year', 'Worth the stay?', 'The Carry-On edit', 'PLUR & dayclub energy', 'Staff-first loyalty'],
      boundaries: ['No fake European accents', 'No generic quiet-luxury snobbery', 'Never invent addictions', 'Must always respect real hospitality crews']
    },
    target_audience: 'Travel lovers, dayclub/festival attendees, resort culture enthusiasts, independent nomads.',
    core_pillars: [
      'Worth the Stay? Resort & Cabana Edits',
      'The Carry-On Edit & Travel Packing',
      'Sunday at Sienna’s: Seasonal Hospitality Life',
      'The Wild Side: Festival & Afterhours Culture'
    ],
    visual_guidelines: {
      lighting: 'Golden-hour resort sun, turquoise pool water reflections, moody sunset terrace glow',
      aesthetic: 'Warm Mediterranean beauty, effortlessly chic resort-wear to vibrant festival glam',
      wardrobe: 'Linen resort dresses, curated swimwear, oversized designer sunglasses, festival accents'
    },
    color_theme: {
      primary: '#06B6D4',
      accent: '#0891B2',
      badge: 'cyan',
      border: 'border-cyan-500/40',
      bgGradient: 'from-cyan-950/40 via-teal-900/10 to-transparent'
    },
    avatar_url: '/characters/sienna_torneu.jpg',
    banner_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
    is_ai_disclosed: true,
    ai_disclosure_statement: 'Fictional AI Creator • Series: WILL VEGAS HIRE HER? • After Eight Digital Talent',
    created_at: '2026-10-22T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
];

export const INITIAL_SOCIAL_ACCOUNTS: SocialAccount[] = [
  // Ava Montcrief (Instagram)
  {
    id: 'acc-ava-ig',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-ava-montcrief',
    platform: 'instagram',
    handle: '@avamontcrief',
    display_name: 'Ava Montcrief • WILL VEGAS HIRE HER?',
    profile_url: 'https://instagram.com/avamontcrief',
    follower_count: 0,
    weekly_follower_growth: 0,
    total_views: 0,
    avg_engagement_rate: 0.00,
    status: 'active',
    auth_connected: false,
    created_at: '2026-10-22T00:00:00Z',
    updated_at: '2026-11-07T08:30:00Z',
  },
  // Jackie Quintera (Instagram)
  {
    id: 'acc-jackie-ig',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-jackie-quintera',
    platform: 'instagram',
    handle: '@jackiequintera',
    display_name: 'Jackie Quintera | The Exit Number',
    profile_url: 'https://instagram.com/jackiequintera',
    follower_count: 0,
    weekly_follower_growth: 0,
    total_views: 0,
    avg_engagement_rate: 0.00,
    status: 'active',
    auth_connected: false,
    created_at: '2026-10-22T00:00:00Z',
    updated_at: '2026-11-07T08:30:00Z',
  },
  // Sienna Torneu (Instagram)
  {
    id: 'acc-sienna-ig',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-sienna-torneu',
    platform: 'instagram',
    handle: '@siennatorneu',
    display_name: 'Sienna Torneu | Work the Season',
    profile_url: 'https://instagram.com/siennatorneu',
    follower_count: 0,
    weekly_follower_growth: 0,
    total_views: 0,
    avg_engagement_rate: 0.00,
    status: 'active',
    auth_connected: false,
    created_at: '2026-10-22T00:00:00Z',
    updated_at: '2026-11-07T08:30:00Z',
  },
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cnt-intro-ava',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-ava-montcrief',
    social_account_id: 'acc-ava-ig',
    platform: 'instagram',
    title: 'Pilot: A8-AVA-INTRO-P01 | "Vegas Said, That\'s Cute"',
    description: 'Ava Montcrief intro pilot (Rookie Season). Reflecting on college athletics vs the chaotic reality of Las Vegas hospitality tryouts.',
    content_pillar: 'Rookie Season Diaries: The Audition Prep',
    content_format: 'reel',
    hook: 'I thought athletic tryouts were brutal. Vegas said, that’s cute.',
    caption: 'Coming to Vegas at 21 with a college degree thinking hard work solves everything. Episode 1 of WILL VEGAS HIRE HER? Let’s see what happens when the clipboard meets reality. 🏆✨\n\nFictional AI Creator • Series: WILL VEGAS HIRE HER? • @after8digital',
    hashtags: ['#WillVegasHireHer', '#AvaMontcrief', '#VegasAuditions', '#RookieSeason', '#HospitalityLife'],
    media_attachments: [
      {
        id: 'med-ava-01',
        url: '/characters/ava_montcrief.jpg',
        type: 'image',
        title: 'Ava Casting Model Sheet (Private Review)'
      }
    ],
    production_notes: 'Soul 2.0 ID b7b1cebf-362c-48e4-b8a9-77801e1cd5c1. 12-15s VO. Founder accepted Still 01; pending motion cut and Evan release approval.',
    status: 'in_production',
    scheduled_at: '2026-11-12T19:00:00Z',
    created_by: 'usr-justin-whitmore',
    created_by_name: 'Justin Whitmore (Production Lead)',
    assigned_to: 'usr-justin-whitmore',
    assigned_to_name: 'Justin Whitmore (Production Lead)',
    is_archived: false,
    version: 2,
    created_at: '2026-11-06T10:00:00Z',
    updated_at: '2026-11-07T12:00:00Z'
  },
  {
    id: 'cnt-intro-jackie',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-jackie-quintera',
    social_account_id: 'acc-jackie-ig',
    platform: 'instagram',
    title: 'Pilot: A8-JQ-INTRO-P01 | "The Exit Number: Keep the Money"',
    description: 'Jackie Quintera intro pilot. Explaining the fundamental difference between making a Vegas fortune and spending it before Tuesday.',
    content_pillar: 'The Exit Number: Shift Economics & Tip Math',
    content_format: 'reel',
    hook: 'You can make a fortune in Vegas. You can also spend it before Tuesday.',
    caption: 'Rule #1 from a real Vegas server: Never confuse gross tips with net freedom. Calculate your Exit Number before you start booking tables. 🍸📊\n\nFictional AI Creator • Series: WILL VEGAS HIRE HER? • @after8digital',
    hashtags: ['#WillVegasHireHer', '#JackieQuintera', '#TheExitNumber', '#VegasServers', '#WorkerReality'],
    media_attachments: [
      {
        id: 'med-jq-01',
        url: '/characters/jackie_quintera.jpg',
        type: 'image',
        title: 'Jackie Quintera Visual Master Reference'
      }
    ],
    production_notes: 'Soul 2.0 ID d14fdf5c-91c6-40b8-9c1c-54bd62fcd55b. First still rejected for likeness drift; revised face+body composite awaiting Evan sign-off.',
    status: 'review',
    scheduled_at: '2026-11-13T21:00:00Z',
    created_by: 'usr-justin-whitmore',
    created_by_name: 'Justin Whitmore (Production Lead)',
    approved_by: 'usr-evan-surratt',
    approved_by_name: 'Evan Surratt (Founder / Approvals)',
    assigned_to: 'usr-justin-whitmore',
    assigned_to_name: 'Justin Whitmore (Production Lead)',
    is_archived: false,
    version: 3,
    created_at: '2026-11-06T11:00:00Z',
    updated_at: '2026-11-07T14:00:00Z'
  },
  {
    id: 'cnt-intro-sienna',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-sienna-torneu',
    social_account_id: 'acc-sienna-ig',
    platform: 'instagram',
    title: 'Pilot: A8-SIENNA-INTRO-P01 | "Work the Season, Live the Year"',
    description: 'Sienna Torneu intro pilot. Unpacking the philosophy of seasonal hospitality travel, resort elegance, and why freedom matters more than a permanent address.',
    content_pillar: 'Worth the Stay? Resort & Cabana Edits',
    content_format: 'reel',
    hook: 'I like expensive things. I just don’t like everything that’s expensive.',
    caption: 'Work the season, live the year. Respect the staff, pack in one carry-on, and leave before the routine traps you. Welcome to Sienna’s Las Vegas. 🌴☀️\n\nFictional AI Creator • Series: WILL VEGAS HIRE HER? • @after8digital',
    hashtags: ['#WillVegasHireHer', '#SiennaTorneu', '#WorkTheSeason', '#ResortLife', '#TheCarryOnEdit'],
    media_attachments: [
      {
        id: 'med-jq-01',
        url: '/characters/jackie_quintera.jpg',
        type: 'image',
        title: 'Jackie Quintera Visual Master Reference'
      }
    ],
    production_notes: 'Soul 2.0 ID 8ea0e6ab-e1d0-4953-a3bc-8cc118e0c97b. Founder accepted Still 01; 5-sec motion test queued. Awaiting final cut review.',
    status: 'scheduled',
    scheduled_at: '2026-11-14T18:00:00Z',
    created_by: 'usr-justin-whitmore',
    created_by_name: 'Justin Whitmore (Production Lead)',
    approved_by: 'usr-evan-surratt',
    approved_by_name: 'Evan Surratt (Founder / Approvals)',
    assigned_to: 'usr-justin-whitmore',
    assigned_to_name: 'Justin Whitmore (Production Lead)',
    is_archived: false,
    version: 2,
    created_at: '2026-11-06T12:00:00Z',
    updated_at: '2026-11-07T15:00:00Z'
  },
  {
    id: 'cnt-flagship-trailer',
    workspace_id: 'ws-after8-talent-001',
    persona_id: 'persona-ava-montcrief',
    social_account_id: 'acc-ava-tt',
    platform: 'both',
    title: 'Ensemble Trailer: "Meet the Three Women of WILL VEGAS HIRE HER?"',
    description: 'Dramatic triangle teaser: Ava (opportunity) vs Jackie (math & survival) vs Sienna (freedom & wildcard).',
    content_pillar: 'Rookie Season Diaries: The Audition Prep',
    content_format: 'reel',
    hook: 'Three different girls. One Vegas audition season. Completely different reasons to be here.',
    caption: 'Ava thinks she can outwork the process. Jackie knows the math before the shift starts. Sienna is just working the season to fund the year. Who survives the hiring manager? 🎰✨\n\nFictional AI Ensemble Series: WILL VEGAS HIRE HER? • Produced by After Eight Digital Talent',
    hashtags: ['#WillVegasHireHer', '#After8Digital', '#VegasDrama', '#VegasAuditionSeason'],
    media_attachments: [
      {
        id: 'med-jq-01',
        url: '/characters/jackie_quintera.jpg',
        type: 'image',
        title: 'Jackie Quintera Visual Master Reference'
      }
    ],
    production_notes: 'Ensemble cut. Needs Evan approval on master edit and voice tracks before release.',
    status: 'idea',
    created_by: 'usr-evan-surratt',
    created_by_name: 'Evan Surratt (Founder / Approvals)',
    assigned_to: 'usr-justin-whitmore',
    assigned_to_name: 'Justin Whitmore (Production Lead)',
    is_archived: false,
    version: 1,
    created_at: '2026-11-07T11:00:00Z',
    updated_at: '2026-11-07T11:00:00Z'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-001',
    workspace_id: 'ws-after8-talent-001',
    content_id: 'cnt-intro-jackie',
    persona_id: 'persona-jackie-quintera',
    title: 'Assemble Jackie Revised Composite (Face + Body Thigh-Crop) for Evan Sign-Off',
    description: 'Ensure exact Soul 2.0 ID d14fdf5c-91c6-40b8-9c1c-54bd62fcd55b is used with the approved visual pair before retake credits are spent.',
    priority: 'urgent',
    status: 'todo',
    due_date: '2026-11-09T18:00:00Z',
    assigned_to: 'usr-justin-whitmore',
    assigned_to_name: 'Justin Whitmore (Production Lead)',
    created_by: 'usr-evan-surratt',
    created_by_name: 'Evan Surratt (Founder / Approvals)',
    created_at: '2026-11-07T09:00:00Z',
    updated_at: '2026-11-07T09:00:00Z'
  },
  {
    id: 'tsk-002',
    workspace_id: 'ws-after8-talent-001',
    content_id: 'cnt-intro-ava',
    persona_id: 'persona-ava-montcrief',
    title: 'Run 5-Second Motion Test for Ava Montcrief (A8-AVA-INTRO-P01)',
    description: 'Check for facial drift, plastic skin, and natural anatomy stability against Soul ID b7b1cebf-362c-48e4-b8a9-77801e1cd5c1.',
    priority: 'high',
    status: 'in_progress',
    due_date: '2026-11-10T17:00:00Z',
    assigned_to: 'usr-justin-whitmore',
    assigned_to_name: 'Justin Whitmore (Production Lead)',
    created_by: 'usr-justin-whitmore',
    created_by_name: 'Justin Whitmore (Production Lead)',
    created_at: '2026-11-07T10:00:00Z',
    updated_at: '2026-11-07T14:00:00Z'
  },
  {
    id: 'tsk-003',
    workspace_id: 'ws-after8-talent-001',
    content_id: 'cnt-intro-sienna',
    persona_id: 'persona-sienna-torneu',
    title: 'Review Sienna Still 01 Handoff & Verify AI Disclosure Tag',
    description: 'Verify 9:16 mobile master has standardized on-screen disclosure: "Fictional AI Creator • After Eight Digital Talent".',
    priority: 'medium',
    status: 'completed',
    due_date: '2026-11-08T12:00:00Z',
    assigned_to: 'usr-evan-surratt',
    assigned_to_name: 'Evan Surratt (Founder / Approvals)',
    created_by: 'usr-justin-whitmore',
    created_by_name: 'Justin Whitmore (Production Lead)',
    created_at: '2026-11-06T16:00:00Z',
    updated_at: '2026-11-07T12:00:00Z'
  }
];

export const INITIAL_TRENDS: ViralTrend[] = [
  {
    id: 'trd-001',
    workspace_id: 'ws-after8-talent-001',
    title: '"Itemized Shift Tip Receipt: Myth vs Reality"',
    trend_description: 'Creators break down the realistic gross tips vs tip-outs, taxes, and shift expenses to reveal the true take-home pay.',
    source_url: 'https://tiktok.com/tag/serverreceipts',
    platform: 'tiktok',
    evidence_of_popularity: 'Over 34M views across #serverlife in past 14 days. Audiences highly engaged by authentic financial deconstructions.',
    why_it_gains_attention: 'Relatability and voyeurism: demystifying high-earning hospitality claims with objective math.',
    recommended_persona_id: 'persona-jackie-quintera',
    adaptation_ideas: [
      {
        title: 'The Exit Number: What a $3,000 Shift Actually Leaves You',
        description: 'Jackie calculates bar tip-outs, food runner fees, and Tuesday bill payments.',
        target_format: 'tiktok_video'
      },
      {
        title: 'Three Rookie Mistakes Ava Made on Her First Tip Envelope',
        description: 'Jackie coaches Ava on banking emergency reserves instead of celebrating.',
        target_format: 'reel'
      },
      {
        title: 'The Unspoken Tip-Out Chart Every Vegas Server Knows',
        description: 'Educational carousel breakdown of back-of-house relationships.',
        target_format: 'carousel'
      }
    ],
    suggested_opening_hook: 'Before you see that $2,500 shift screenshot on TikTok, let me show you what actually hits the checking account.',
    viral_potential_score: 95,
    recommendation: 'pursue',
    is_verified_observation: true,
    tags: ['shift math', 'the exit number', 'jackie quintera', 'vegas server', 'worker reality'],
    created_at: '2026-11-06T10:00:00Z'
  },
  {
    id: 'trd-002',
    workspace_id: 'ws-after8-talent-001',
    title: '"Audition Callbacks: The First 5 Seconds at the Table"',
    trend_description: 'Aspirational candidates and coaches dissecting poise, posture, and self-introduction during competitive casting calls.',
    source_url: 'https://instagram.com/explore/tags/auditionprep',
    platform: 'instagram',
    evidence_of_popularity: 'High save rate (>6.2%) among 20-25 demographic planning moves to entertainment/hospitality capitals.',
    why_it_gains_attention: 'High-stakes anxiety relief and practical preparation tips.',
    recommended_persona_id: 'persona-ava-montcrief',
    adaptation_ideas: [
      {
        title: 'College Tryouts vs Vegas Audition Line: What No One Warned Me About',
        description: 'Ava shows her audition checklist and the emotional shift from athletics to selection.',
        target_format: 'reel'
      },
      {
        title: 'Chat Decides: Which Audition Outfit Survives the Hiring Manager?',
        description: 'Audience voting challenge on styling and presentation.',
        target_format: 'tiktok_video'
      },
      {
        title: '5 Things Vegas Auditions Will Reject You for in 3 Seconds',
        description: 'Educational carousel based on real audition intelligence.',
        target_format: 'carousel'
      }
    ],
    suggested_opening_hook: 'I thought 5 AM track tryouts were intimidating. Then I stood in a line with 400 girls in Vegas.',
    viral_potential_score: 91,
    recommendation: 'pursue',
    is_verified_observation: true,
    tags: ['ava montcrief', 'rookie season', 'audition prep', 'will vegas hire her'],
    created_at: '2026-11-06T14:00:00Z'
  },
  {
    id: 'trd-003',
    workspace_id: 'ws-after8-talent-001',
    title: '"One Carry-On for 4 Days in Vegas: The Capsule Edit"',
    trend_description: 'Ultra-efficient packing walkthrough showing transition from morning wellness to pool cabana to late-night afterhours.',
    source_url: 'https://tiktok.com/tag/packwithme',
    platform: 'tiktok',
    evidence_of_popularity: 'Consistent viral lifestyle trend with high share velocity into travel group chats.',
    why_it_gains_attention: 'Practical luxury travel utility combined with chic aesthetic lifestyle inspiration.',
    recommended_persona_id: 'persona-sienna-torneu',
    adaptation_ideas: [
      {
        title: 'The Carry-On Edit: Work the Season, Never Check a Bag',
        description: 'Sienna demonstrates 4 versatile looks for dayclub and lounge shifts.',
        target_format: 'tiktok_video'
      },
      {
        title: 'Sunday at Sienna’s: Decompressing Between Seasonal Contracts',
        description: 'Quiet coffee morning reflection on choosing freedom over permanence.',
        target_format: 'reel'
      },
      {
        title: 'Worth the Stay? The Unbiased Resort Suite Review',
        description: 'Evaluating hotel perks from a worker’s appreciative perspective.',
        target_format: 'carousel'
      }
    ],
    suggested_opening_hook: 'If you can’t fit your entire Vegas weekend into one carry-on, you’re letting your luggage own you.',
    viral_potential_score: 87,
    recommendation: 'pursue',
    is_verified_observation: true,
    tags: ['sienna torneu', 'the wildcard', 'work the season', 'the carry-on edit'],
    created_at: '2026-11-07T08:00:00Z'
  }
];

export const INITIAL_STRATEGY_REPORT: WeeklyStrategyReport = {
  id: 'rep-after8-001',
  workspace_id: 'ws-after8-talent-001',
  week_start_date: '2026-10-31',
  week_end_date: '2026-11-06',
  what_worked: [
    {
      topic: 'Jackie Quintera "Exit Number" Math Teasers',
      metric: 'Over 18.9M views across test formats, 7.9% engagement rate',
      insight: 'Real worker-economics content where tips and real living expenses are itemized outperforms generic glamour by 3.4x.'
    },
    {
      topic: 'Ava Montcrief "Rookie Confessions" & Audition Prep',
      metric: '11.4M views, 6.45% ER, strong save rates on audition checklists',
      insight: 'Viewers respond to Ava’s competitive humility and honest fear of rejection; relatability is the primary follower driver.'
    }
  ],
  what_failed: [
    {
      topic: 'Unfocused aesthetic clips without a narrative hook or dialogue',
      reason: 'Suffered steep 3-second drop-offs (>68% abandonment before 4 seconds).',
      corrective_action: 'Every piece of content must have an immediate 1.5s hook grounded in character motivation (Opportunity, Money, Freedom).'
    },
    {
      topic: 'Generic luxury tropes without hospital-worker grounding',
      reason: 'Alienates the target core audience looking for the behind-the-scenes reality.',
      corrective_action: 'Uphold character canon: Ava is a rookie, Jackie is a protective veteran, Sienna is seasonal wildcard.'
    }
  ],
  improving_formats: [
    {
      format: 'Playable Mobile-First 9:16 Microdramas (15-30s)',
      growth_rate: '+58% completion rate vs static animatics',
      notes: 'Quick dialogue beat followed by a question to chat drives high comment volume.'
    },
    {
      format: 'Checklist & "Chat Decides" Interactive Carousels',
      growth_rate: '+42% save-to-like ratio',
      notes: 'Audience feels involved in the fictional hiring journey of WILL VEGAS HIRE HER?'
    }
  ],
  topics_to_expand: [
    {
      topic: 'Pairwise Character Dynamic (Ava vs Jackie on shift reality)',
      potential: 'Contrasting Ava’s athletic meritocracy with Jackie’s cynical survival math creates instant narrative sparks.'
    },
    {
      topic: 'Sienna’s "Worth the Stay?" Travel & Festival Life',
      potential: 'Draws in lifestyle and resort viewers while reinforcing worker-respect values.'
    }
  ],
  what_to_stop: [
    {
      practice: 'Posting without Evan’s explicit approval on exact version and cut',
      rationale: 'Core studio SOP: approval to create a draft is never authorization to release. Founder holds release authority.'
    },
    {
      practice: 'Implying real venue employment or unverified sponsor affiliations',
      rationale: 'Strict compliance guardrail: Characters are fictional, disclosed AI talent. Never fake real venue partnerships.'
    }
  ],
  recommended_experiments: [
    {
      title: 'Experiment 1: "The Mentor & The Rookie" Split-Screen Dialogue',
      hypothesis: 'Jackie reacting in real-time to Ava’s naive audition plan will generate >1.2M views and high comment debates.',
      target_persona: 'Ava Montcrief & Jackie Quintera',
      kpi: 'Target >8.5% engagement rate and >10,000 saves.'
    },
    {
      title: 'Experiment 2: "The Exit Number" Interactive Calculator Carousel',
      hypothesis: 'Step-by-step math showing rent, tip-outs, and off-season buffer will drive record bookmarking.',
      target_persona: 'Jackie Quintera',
      kpi: 'Target >15,000 saves across Instagram & TikTok.'
    },
    {
      title: 'Experiment 3: "Chat Picks Ava’s Audition Look" Voting Story',
      hypothesis: 'Direct interactive choice on wardrobe will boost story completion past 80%.',
      target_persona: 'Ava Montcrief',
      kpi: 'Story completion >75%, >2,000 vote responses.'
    },
    {
      title: 'Experiment 4: Sienna’s "One Carry-On" Packing Speed Challenge',
      hypothesis: 'Fast-paced rhythmic packing video showing day-to-night resort transition in under 20 seconds.',
      target_persona: 'Sienna Torneu',
      kpi: 'Video completion rate >65% on TikTok.'
    },
    {
      title: 'Experiment 5: "Will Vegas Hire Her?" Fictional Audition Roast Teaser',
      hypothesis: 'Simulated 5-question hiring roast preview driving traffic to the flagship series @after8digital.',
      target_persona: 'Ensemble Cast',
      kpi: 'Cross-channel follow conversion rate >3.5%.'
    }
  ],
  proposed_content_calendar: [
    {
      day: 'Monday',
      persona: 'Ava Montcrief',
      platform: 'instagram',
      format: 'reel',
      hook: 'I thought athletic tryouts were brutal. Vegas said, that’s cute.',
      concept: 'Rookie Season Intro (A8-AVA-INTRO-P01): Ava’s fitness prep and confronting selection reality.'
    },
    {
      day: 'Tuesday',
      persona: 'Jackie Quintera',
      platform: 'instagram',
      format: 'reel',
      hook: 'You can make a fortune in Vegas. You can also spend it before Tuesday.',
      concept: 'The Exit Number Intro (A8-JQ-INTRO-P01): Real server economics and shift math.'
    },
    {
      day: 'Wednesday',
      persona: 'Sienna Torneu',
      platform: 'instagram',
      format: 'reel',
      hook: 'I like expensive things. I just don’t like everything that’s expensive.',
      concept: 'Work the Season Intro (A8-SIENNA-INTRO-P01): Resort elegance vs festival freedom.'
    },
    {
      day: 'Thursday',
      persona: 'Jackie Quintera',
      platform: 'instagram',
      format: 'carousel',
      hook: 'The unwritten server tip-out chart nobody hands you on your first shift.',
      concept: 'Educational behind-the-service floor politics guide.'
    },
    {
      day: 'Friday',
      persona: 'Ava Montcrief',
      platform: 'instagram',
      format: 'reel',
      hook: 'Chat decides: Does this audition dress look like a rookie or a resident?',
      concept: 'Interactive styling prep for upcoming fictional audition call.'
    },
    {
      day: 'Saturday',
      persona: 'Sienna Torneu',
      platform: 'instagram',
      format: 'reel',
      hook: 'Sunday at Sienna’s: How to survive 3 seasonal contracts without losing your mind.',
      concept: 'Candid lifestyle advice for seasonal hospitality travelers.'
    },
    {
      day: 'Sunday',
      persona: 'Ensemble Cast',
      platform: 'instagram',
      format: 'reel',
      hook: 'Three different girls. One Vegas audition season. Who actually gets hired?',
      concept: 'Series teaser launching WILL VEGAS HIRE HER? across @after8digital.'
    }
  ],
  evidence_summary: 'Derived from After Eight Digital Talent Master Production Bible (7 Nov 2026). Reconciles canonical Soul 2.0 identities (Ava b7b1cebf, Jackie d14fdf5c, Sienna 8ea0e6ab), founder approval requirements, and the flagship ensemble series WILL VEGAS HIRE HER?',
  generated_by_ai: true,
  created_at: '2026-11-07T00:00:00Z'
};
