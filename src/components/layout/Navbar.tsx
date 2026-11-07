'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { 
  Users, 
  Crown, 
  Sparkles, 
  GlassWater, 
  SunMedium, 
  Layers, 
  Calendar as CalendarIcon, 
  Flame, 
  Wand2, 
  BarChart3, 
  BrainCircuit, 
  Settings as SettingsIcon,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  PlusCircle,
  Database
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    workspace, 
    members, 
    currentUser, 
    setCurrentUser, 
    personas, 
    selectedPersonaId, 
    setSelectedPersonaId,
    inviteTeamMember
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'partner' | 'editor'>('partner');

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Layers },
    { href: '/content', label: 'Content Pipeline', icon: Sparkles },
    { href: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { href: '/trends', label: 'Viral Research', icon: Flame },
    { href: '/generator', label: 'AI Studio', icon: Wand2 },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/strategist', label: 'AI Strategist', icon: BrainCircuit },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;
    inviteTeamMember(newEmail, newName, newRole);
    setNewEmail('');
    setNewName('');
    setInviteModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Bar: Workspace & Multi-User Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-800/60">
          {/* Logo & Workspace Title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/10">
                <div className="w-full h-full bg-[#0E1322] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  AFTER EIGHT DIGITAL
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  WILL VEGAS HIRE HER? • Talent Ops
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-800 text-xs">
              <span className="text-slate-400 mr-2">Workspace:</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-200 font-medium border border-slate-700/60 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                {workspace.name}
              </span>
            </div>
          </div>

          {/* Active Collaborator Switcher & Actions */}
          <div className="flex items-center space-x-3">
            {/* Supabase status badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Shared Workspace Active
            </div>

            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition text-sm"
              >
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-purple-400/50 shadow"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-amber-500 flex items-center justify-center text-[11px] font-bold text-white">
                    {currentUser.full_name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                    {currentUser.full_name}
                    <UserCheck className="w-3 h-3 text-cyan-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111625] border border-slate-700 shadow-2xl p-2 z-50">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Administrator
                  </div>
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setCurrentUser(member);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition ${
                        currentUser.id === member.id
                          ? 'bg-purple-900/40 text-purple-200 border border-purple-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.full_name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {member.full_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-200">{member.full_name}</div>
                          <div className="text-[10px] text-slate-400">{member.email}</div>
                        </div>
                      </div>
                      {currentUser.id === member.id && (
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                      )}
                    </button>
                  ))}

                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setInviteModalOpen(true);
                      }}
                      className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-cyan-400 hover:bg-cyan-950/30 rounded-lg transition"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Invite Co-Admin or Partner
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Persona Workspace Selector Bar */}
        <div className="flex items-center justify-between py-2 overflow-x-auto no-scrollbar border-b border-slate-800/40">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1 uppercase tracking-wider">Persona:</span>
            
            <button
              onClick={() => setSelectedPersonaId('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedPersonaId === 'all'
                  ? 'bg-slate-200 text-slate-900 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              All Personas (Unified)
            </button>

            {personas.map((persona) => {
              const isSelected = selectedPersonaId === persona.id;
              const isRookie = persona.archetype === 'rookie' || persona.name.toLowerCase().includes('ava');
              const isInsider = persona.archetype === 'insider' || persona.name.toLowerCase().includes('jackie');
              
              let Icon = Crown;
              let activeStyle = 'bg-amber-500 text-slate-950 shadow-amber-500/20';
              if (isInsider) {
                Icon = GlassWater;
                activeStyle = 'bg-purple-600 text-white shadow-purple-500/20';
              } else if (!isRookie) {
                Icon = SunMedium;
                activeStyle = 'bg-cyan-500 text-slate-950 shadow-cyan-500/20';
              }

              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersonaId(persona.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? `${activeStyle} shadow-md`
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{persona.name}</span>
                  <span className="text-[10px] opacity-75 hidden md:inline">
                    ({persona.archetype.replace('_', ' ')})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111625] border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Invite Team Member
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your business partner or creator to collaborate on all 3 personas and 6 accounts in real time.
            </p>

            <form onSubmit={handleInvite} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="partner@vegasai.studio"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Workspace Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="partner">Partner (Full Admin & Approval Access)</option>
                  <option value="admin">Admin (Full System Permissions)</option>
                  <option value="editor">Editor (Draft & Content Creation Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-semibold hover:opacity-95 transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
