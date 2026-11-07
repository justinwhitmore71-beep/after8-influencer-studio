'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  Settings as SettingsIcon, 
  Users, 
  Database, 
  Key, 
  FileText, 
  RotateCcw, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Plus,
  ExternalLink,
  Crown
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { 
    workspace, 
    members, 
    currentUser, 
    inviteTeamMember, 
    auditLogs, 
    resetToInitialData 
  } = useApp();

  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'partner' | 'editor'>('partner');

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiKeyInput) return;
    try {
      localStorage.setItem('vegas_ai_studio_gemini_key', geminiKeyInput);
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    inviteTeamMember(inviteEmail, inviteName, inviteRole);
    setInviteEmail('');
    setInviteName('');
    setInviteModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Workspace Configuration & Multi-User Governance</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Workspace Settings & Multi-User Management
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Row-level security, shared partner permissions, PostgreSQL audit trail, and AI API integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team & Workspace Members */}
        <div className="lg:col-span-2 space-y-6">
          {/* Team Members Card */}
          <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Shared Workspace Collaborators ({members.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Both administrators have full synchronized access across all 3 personas and active social accounts
                </p>
              </div>

              <button
                onClick={() => setInviteModalOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite Partner
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#111728] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                      alt={member.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {member.full_name}
                        {currentUser.id === member.id && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] rounded-full font-bold">
                            You (Active)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{member.email}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
                      {member.role}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">Full Admin Permissions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail Log Viewer */}
          <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Synchronized Collaboration Audit Trail
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track which partner created, edited, approved, or published content
                </p>
              </div>
              <span className="text-xs text-slate-500 font-semibold">{auditLogs.length} Records</span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                Audit trail active. User actions (content creation, status advancement, approvals) will record here automatically.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#111728] border border-slate-800/80 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-purple-300">{log.user_name}</span>{' '}
                      <span className="text-slate-300">{log.action}</span>
                      {log.details && (
                        <div className="text-[11px] text-slate-500 truncate max-w-md mt-0.5">
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                      {new Date(log.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Database & API Integrations */}
        <div className="space-y-6">
          {/* Supabase PostgreSQL & RLS Status */}
          <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Supabase PostgreSQL Architecture
            </h3>
            <p className="text-slate-400 text-xs">
              Configured for multi-tenant Row Level Security (RLS) and real-time subscription synchronization.
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-bold text-slate-200">PostgreSQL (Supabase)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Row Level Security:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Enforced
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Schema File:</span>
                <span className="font-mono text-[11px] text-cyan-400">supabase/schema.sql</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              To bind a live cloud database, add <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code className="text-purple-300">.env.local</code>.
            </div>
          </div>

          {/* Gemini API Key Configuration */}
          <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Google Gemini API Engine
            </h3>
            <p className="text-slate-400 text-xs">
              Powers the Viral Research Scout, AI Persona Content Generator, and AI Weekly Strategist.
            </p>

            <form onSubmit={handleSaveGeminiKey} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKeyInput}
                  onChange={(e) => setGeminiKeyInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition flex items-center justify-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                {keySaved ? 'Saved API Key!' : 'Save Key'}
              </button>
            </form>
          </div>

          {/* Database Reset & Seed State */}
          <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset & Demo Seed Controls
            </h3>
            <p className="text-slate-400 text-xs">
              Restore default rich dataset (Ava Montcrief, Jackie Quintera, Sienna Torneu, active accounts, pipeline items, tasks, and historical metrics).
            </p>

            <button
              onClick={() => {
                if (confirm('Reset application data to original verified seed state?')) {
                  resetToInitialData();
                }
              }}
              className="w-full py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-lg font-semibold transition"
            >
              Reset to Factory Seed Data
            </button>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#101524] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Invite Workspace Partner
            </h3>
            <p className="text-xs text-slate-400">
              Add your partner or creator with immediate shared access to the publishing calendar, pipeline, and personas.
            </p>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@vegasai.studio"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role & Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="partner">Partner (Full Admin & Approval Authority)</option>
                  <option value="admin">Administrator (Full System Access)</option>
                  <option value="editor">Editor (Drafting & Asset Uploads)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold"
                >
                  Grant Shared Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
