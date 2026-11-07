import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, GeneratePersonaContentParams } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GeneratePersonaContentParams;
    const { persona, requestType, topicOrPillar, platform, format } = body;

    const apiKey = req.headers.get('x-gemini-key') || process.env.GEMINI_API_KEY;
    const gemini = getGeminiClient(apiKey || undefined);

    if (gemini) {
      try {
        const prompt = `You are the lead creative director for an elite Las Vegas social media studio.
You are generating content for ONE specific AI persona:

PERSONA NAME: ${persona.name}
ARCHETYPE: ${persona.archetype}
TAGLINE: ${persona.tagline}
BIO: ${persona.bio}
VOICE & TONE STYLE: ${persona.voice_and_tone.style}
PACING: ${persona.voice_and_tone.pacing}
KEY VOCABULARY: ${persona.voice_and_tone.lexicon.join(', ')}
BOUNDARIES: ${persona.voice_and_tone.boundaries.join(', ')}
CORE CONTENT PILLARS: ${persona.core_pillars.join(', ')}

TARGET PLATFORM: ${platform}
CONTENT FORMAT: ${format}
REQUEST TYPE: ${requestType}
TOPIC / PILLAR FOCUS: ${topicOrPillar || 'Core signature topic'}

CRITICAL GUIDELINES:
1. Maintain this persona's distinctive identity from the After Eight Digital Talent Master Bible:
   - AVA MONTCRIEF (The Rookie / Opportunity): 21 y/o former athlete from Lexington, KY. Competitive, energetic vlog to chat, earnest, vulnerable about selection reality, fitness and audition preparation.
   - JACKIE QUINTERA (The Insider / Money): Vegas native, veteran cocktail server. Sharp, flirtatious wit, money math, "The Exit Number", teaching servers not to blow shift money before Tuesday.
   - SIENNA TORNEU (The Wildcard / Freedom): 26 y/o Mediterranean heritage. "Work the season. Live the year." Hotel-lobby elegance meets festival/PLUR/afterhours charisma. Dry Californian wit.
2. Compliance & Ethics: Always include the mandatory disclosure: "${persona.ai_disclosure_statement}".
3. Never imply real venue employment, real contracts, or impersonation of real hospitality workers.

Return a valid JSON object matching this schema:
{
  "title": "Short punchy internal title",
  "hooks": ["Hook option 1 (provocative 3-second opener)", "Hook option 2 (mystery/intrigue)", "Hook option 3 (data/cost breakdown)"],
  "selected_hook": "The best hook",
  "caption": "Full post caption written in persona voice with spacing and calls to action",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
  "script": {
    "visual_direction": "Step by step camera and avatar direction",
    "audio_vo": "Spoken voiceover script with pacing cues",
    "on_screen_text": ["Text overlay 1", "Text overlay 2"]
  },
  "content_pillar": "${topicOrPillar || persona.core_pillars[0]}",
  "production_notes": "Lighting, outfit, and render specifications for AI image/video pipeline"
}`;

        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return NextResponse.json({ success: true, data: parsed, source: 'gemini-api' });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, using high-fidelity persona engine fallback:', geminiError);
      }
    }

    // High-fidelity Persona-specific Fallback Engine
    const fallbackData = generatePersonaFallback(persona, requestType, topicOrPillar, platform, format);
    return NextResponse.json({ 
      success: true, 
      data: fallbackData, 
      source: 'persona-studio-engine',
      note: 'Generated using built-in Persona Studio Engine (Add GEMINI_API_KEY in settings to enable live Gemini API).'
    });

  } catch (error) {
    console.error('Error in AI Generator:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}

function generatePersonaFallback(
  persona: GeneratePersonaContentParams['persona'],
  requestType: string,
  topicOrPillar?: string,
  platform?: string,
  format?: string
) {
  const isAva = persona.name.toLowerCase().includes('ava') || persona.archetype === 'high_roller';
  const isJackie = persona.name.toLowerCase().includes('jackie') || persona.archetype === 'nightlife_insider';

  if (isAva) {
    return {
      title: 'A8-AVA-P01 | What Vegas Said to My Athletic Tryouts',
      hooks: [
        'I thought college athletic tryouts were brutal. Vegas said, that’s cute.',
        'Here is what happens when you show up to a Las Vegas hospitality audition with a clipboard.',
        'Chat, we need to talk about what they actually judge in the first 3 seconds of a Vegas casting call.'
      ],
      selected_hook: 'I thought college athletic tryouts were brutal. Vegas said, that’s cute.',
      caption: `Coming to Vegas at 21 with a college degree thinking hard work solves everything.\n\nIn athletics, if you run faster and lift heavier, you start. In Vegas hospitality, timing, floor politics, and who is holding the clipboard change the game entirely.\n\nEpisode 1 of WILL VEGAS HIRE HER? Tell me in the comments: would you survive the selection line?\n\n✨ ${persona.ai_disclosure_statement}`,
      hashtags: ['#WillVegasHireHer', '#AvaMontcrief', '#VegasAudition', '#RookieSeason', '#HospitalityPrep'],
      script: {
        visual_direction: 'Fast-paced athletic vlog cut. Ava in sleek black training athleisure, tying her runners, checking her audition prep notes, candid smile directly to camera.',
        audio_vo: 'I thought four years of 5 AM sprint conditioning prepared me for anything. Then I walked into a Las Vegas audition room with 400 other girls and learned what real pressure looks like.',
        on_screen_text: ['Rookie Season • Entry 01', 'Lexington, KY -> Las Vegas', 'Audition Checklist Active']
      },
      content_pillar: topicOrPillar || 'Rookie Season Diaries: The Audition Prep',
      production_notes: 'Soul 2.0 ID b7b1cebf-362c-48e4-b8a9-77801e1cd5c1. High energy, natural daylight, light-blonde hair, natural anatomy.'
    };
  }

  if (isJackie) {
    return {
      title: 'A8-JQ-P01 | The Exit Number: Stop Blowing Money Before Tuesday',
      hooks: [
        'You can make a fortune in Vegas. You can also spend it before Tuesday.',
        'Rule number one from a Vegas server: Never confuse gross tips with net freedom.',
        'If your Tuesday bank balance looks like this, you have no Exit Number.'
      ],
      selected_hook: 'You can make a fortune in Vegas. You can also spend it before Tuesday.',
      caption: `Before you believe that viral TikTok screenshot of a $3,000 Saturday night envelope, let’s run the actual math:\n\n• 15% to bar tip-out\n• 5% to bussers and runners\n• 30% held for self-employed tax bracket\n\nVegas pays well. The trick is keeping the money. What is your Exit Number?\n\n🍸 ${persona.ai_disclosure_statement}`,
      hashtags: ['#WillVegasHireHer', '#JackieQuintera', '#TheExitNumber', '#VegasServers', '#WorkerReality'],
      script: {
        visual_direction: 'Moody late-night kitchen scene. Jackie with a pen and notepad, sharp witty eye-contact, breaking down the tip envelope item by item.',
        audio_vo: 'Everyone talks about how much cash you can pull off the floor on a holiday weekend. Nobody talks about how fast it vanishes if you don’t have an Exit Number.',
        on_screen_text: ['Jackie Quintera • Veteran Server', 'Gross Tips != Net Wealth', 'The Exit Number']
      },
      content_pillar: topicOrPillar || 'The Exit Number: Shift Economics & Tip Math',
      production_notes: 'Soul 2.0 ID d14fdf5c-91c6-40b8-9c1c-54bd62fcd55b. Sharp, witty, late-night kitchen table lighting with purple accent glow.'
    };
  }

  // Sienna Torneu
  return {
    title: 'A8-SIENNA-P01 | Work the Season. Live the Year.',
    hooks: [
      'I like expensive things. I just don’t like everything that’s expensive.',
      'Work the season, live the year. Here is how I fit my entire summer into one carry-on.',
      'Why seasonal hospitality is the only job that pays you in pure freedom.'
    ],
    selected_hook: 'I like expensive things. I just don’t like everything that’s expensive.',
    caption: `Work the season. Live the year. Respect the staff, pack everything into one carry-on, and never let routine own your calendar.\n\nFrom poolside cabanas to sunrise afterhours, here is the secret to moving through Vegas with total independence.\n\n🌴 ${persona.ai_disclosure_statement}`,
    hashtags: ['#WillVegasHireHer', '#SiennaTorneu', '#WorkTheSeason', '#TheCarryOnEdit', '#ResortLifestyle'],
    script: {
      visual_direction: 'Sun-drenched resort terrace with pool caustics. Sienna in a crisp linen resort set, adjusting sunglasses, with effortless California cool.',
      audio_vo: 'People ask why I don’t buy a house and settle into a 9-to-5. Because six months of intense seasonal focus gives me six months of uninterrupted freedom.',
      on_screen_text: ['Sienna Torneu • The Wildcard', 'Work the season. Live the year.', 'Carry-On Capsule']
    },
    content_pillar: topicOrPillar || 'Worth the Stay? Resort & Cabana Edits',
    production_notes: 'Soul 2.0 ID 8ea0e6ab-e1d0-4953-a3bc-8cc118e0c97b. Mediterranean warm tones, turquoise water highlights, chic resort wear.'
  };
}
