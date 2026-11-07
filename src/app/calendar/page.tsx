'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  format, 
  addDays, 
  startOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths,
  subWeeks,
  addWeeks
} from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Crown, 
  GlassWater, 
  SunMedium, 
  Plus, 
  Filter,
  CheckCircle2
} from 'lucide-react';

function CalendarPageContent() {
  const { 
    personas, 
    socialAccounts, 
    contentItems, 
    tasks, 
    selectedPersonaId, 
    setSelectedPersonaId,
    platformFilter, 
    setPlatformFilter 
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date('2026-11-08T12:00:00Z'));
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week');
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  // Filter content items that have a scheduled date
  const scheduledItems = useMemo(() => {
    return contentItems.filter((item) => {
      if (!item.scheduled_at || item.is_archived) return false;
      if (selectedPersonaId !== 'all' && item.persona_id !== selectedPersonaId) return false;
      if (platformFilter !== 'all' && item.platform !== 'both' && item.platform !== platformFilter) return false;
      return true;
    });
  }, [contentItems, selectedPersonaId, platformFilter]);

  // Conflict Detection: check if any 2 posts are scheduled within 60 minutes of each other
  const conflicts = useMemo(() => {
    const list: { post1: typeof scheduledItems[0]; post2: typeof scheduledItems[0]; timeDiffMinutes: number }[] = [];
    for (let i = 0; i < scheduledItems.length; i++) {
      for (let j = i + 1; j < scheduledItems.length; j++) {
        const t1 = new Date(scheduledItems[i].scheduled_at!).getTime();
        const t2 = new Date(scheduledItems[j].scheduled_at!).getTime();
        const diffMinutes = Math.abs(t1 - t2) / (1000 * 60);
        if (diffMinutes <= 60) {
          list.push({ post1: scheduledItems[i], post2: scheduledItems[j], timeDiffMinutes: Math.round(diffMinutes) });
        }
      }
    }
    return list;
  }, [scheduledItems]);

  // Days for Month View
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = startOfWeek(addDays(endOfMonth(currentDate), 7));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Days for Week View
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  // Empty publishing days in current week view
  const emptyDaysWarning = useMemo(() => {
    const warnings: { date: Date; personaName: string }[] = [];
    const activePersonas = selectedPersonaId === 'all' 
      ? personas 
      : personas.filter(p => p.id === selectedPersonaId);

    weekDays.forEach((day) => {
      activePersonas.forEach((persona) => {
        const hasPost = scheduledItems.some(
          (item) => item.persona_id === persona.id && isSameDay(new Date(item.scheduled_at!), day)
        );
        if (!hasPost) {
          warnings.push({ date: day, personaName: persona.name });
        }
      });
    });
    return warnings;
  }, [weekDays, scheduledItems, selectedPersonaId, personas]);

  const handlePrev = () => {
    if (calendarView === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (calendarView === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, -1));
  };

  const handleNext = () => {
    if (calendarView === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (calendarView === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            Social Publishing Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scheduling intelligence across 6 accounts with conflict resolution and empty-day detection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            {(['day', 'week', 'month'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setCalendarView(v)}
                className={`px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                  calendarView === v ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <button
              onClick={handlePrev}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-200 px-2 min-w-[130px] text-center">
              {calendarView === 'month' && format(currentDate, 'MMMM yyyy')}
              {calendarView === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`}
              {calendarView === 'day' && format(currentDate, 'EEEE, MMM d, yyyy')}
            </span>
            <button
              onClick={handleNext}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/content?action=new"
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" />
            Schedule Post
          </Link>
        </div>
      </div>

      {/* Warnings & Diagnostics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scheduling Conflicts Warning Card */}
        <div className={`p-4 rounded-2xl border text-xs ${
          conflicts.length > 0 
            ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {conflicts.length > 0 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Scheduling Collision Alert ({conflicts.length})</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Publishing Spacing: Optimal</span>
              </>
            )}
          </div>
          {conflicts.length > 0 ? (
            <p className="text-[11px] text-rose-300/80">
              Collision detected: "{conflicts[0].post1.title}" and "{conflicts[0].post2.title}" are scheduled within {conflicts[0].timeDiffMinutes} minutes. Space out to avoid cross-channel cannibalization.
            </p>
          ) : (
            <p className="text-[11px] text-emerald-400/80">
              No overlapping posts within 60 minutes across your 6 accounts.
            </p>
          )}
        </div>

        {/* Empty Publishing Days Warning Card */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-amber-200 text-xs">
          <div className="flex items-center justify-between font-bold mb-1">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Empty Publishing Slot Detector
            </span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
              {emptyDaysWarning.length} open slots
            </span>
          </div>
          <p className="text-[11px] text-amber-300/80 line-clamp-2">
            {emptyDaysWarning.length > 0
              ? `Open slots on ${format(emptyDaysWarning[0].date, 'EEE, MMM d')} for ${emptyDaysWarning[0].personaName}. Maintain daily persona cadence.`
              : 'All 3 personas have scheduled coverage throughout the current week.'}
          </p>
        </div>
      </div>

      {/* Persona Color Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-[#0D1220] p-3 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-500 font-bold uppercase text-[10px]">Persona Palette:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span className="text-slate-300 font-medium">Ava Montcrief (The Rookie / Opportunity)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
          <span className="text-slate-300 font-medium">Jackie Quintera (The Insider / Money)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
          <span className="text-slate-300 font-medium">Sienna Torneu (The Wildcard / Freedom)</span>
        </div>
      </div>

      {/* Week View Grid */}
      {calendarView === 'week' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const isToday = today ? isSameDay(day, today) : false;
              const dayPosts = scheduledItems.filter((i) => isSameDay(new Date(i.scheduled_at!), day));
              const dayTasks = tasks.filter((t) => t.due_date && isSameDay(new Date(t.due_date), day));

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[500px] rounded-xl border p-2.5 flex flex-col justify-between ${
                    isToday
                      ? 'bg-[#12182B] border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                      : 'bg-[#0E1322] border-slate-800/80'
                  }`}
                >
                  <div>
                    {/* Day Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          {format(day, 'EEE')}
                        </div>
                        <div className={`text-base font-extrabold ${isToday ? 'text-cyan-400' : 'text-slate-200'}`}>
                          {format(day, 'd')}
                        </div>
                      </div>
                      {dayPosts.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {dayPosts.length}
                        </span>
                      )}
                    </div>

                    {/* Day Scheduled Posts */}
                    <div className="mt-2 space-y-2">
                      {dayPosts.map((post) => {
                        const persona = personas.find((p) => p.id === post.persona_id);
                        const isHighRoller = persona?.archetype === 'high_roller';
                        const isNightlife = persona?.archetype === 'nightlife_insider';
                        
                        let cardColor = 'border-amber-500/40 bg-amber-950/20 text-amber-200';
                        if (isNightlife) {
                          cardColor = 'border-purple-500/40 bg-purple-950/20 text-purple-200';
                        } else if (!isHighRoller) {
                          cardColor = 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200';
                        }

                        return (
                          <div
                            key={post.id}
                            className={`p-2 rounded-lg border text-left shadow-sm ${cardColor} space-y-1`}
                          >
                            <div className="flex items-center justify-between text-[9px] uppercase font-bold">
                              <span>{persona?.name.split(' ')[0]}</span>
                              <span className="opacity-80">{post.platform}</span>
                            </div>
                            <div className="text-[11px] font-bold leading-tight line-clamp-2">
                              {post.title}
                            </div>
                            <div className="text-[9px] opacity-80 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {format(new Date(post.scheduled_at!), 'h:mm a')}
                            </div>
                          </div>
                        );
                      })}

                      {/* Outstanding Production Tasks on this day */}
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-1.5 rounded bg-slate-900 border border-slate-700/80 text-[10px] text-slate-300"
                        >
                          <span className="font-semibold text-purple-400">Task: </span>
                          <span className="line-clamp-1">{t.title}</span>
                        </div>
                      ))}

                      {dayPosts.length === 0 && dayTasks.length === 0 && (
                        <div className="pt-8 text-center text-slate-600 text-[11px]">
                          No posts
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/content?action=new&date=${day.toISOString()}`}
                    className="w-full mt-2 py-1 text-center text-[10px] text-slate-500 hover:text-cyan-400 hover:bg-slate-800/60 rounded transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Post
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View Grid */}
      {calendarView === 'month' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-slate-500 py-1 uppercase">
                {d}
              </div>
            ))}
            {monthDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = today ? isSameDay(day, today) : false;
              const dayPosts = scheduledItems.filter((i) => isSameDay(new Date(i.scheduled_at!), day));

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] rounded-xl border p-1.5 flex flex-col justify-between ${
                    isToday
                      ? 'bg-[#12182B] border-cyan-500/40'
                      : isCurrentMonth
                      ? 'bg-[#0E1322] border-slate-800/80'
                      : 'bg-slate-950/40 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className={isToday ? 'text-cyan-400 font-extrabold' : ''}>
                      {format(day, 'd')}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1">
                    {dayPosts.slice(0, 2).map((post) => {
                      const persona = personas.find((p) => p.id === post.persona_id);
                      const isHighRoller = persona?.archetype === 'high_roller';
                      const isNightlife = persona?.archetype === 'nightlife_insider';
                      const bg = isHighRoller ? 'bg-amber-500/20 text-amber-300' : isNightlife ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300';

                      return (
                        <div key={post.id} className={`px-1 py-0.5 rounded text-[9px] truncate font-medium ${bg}`}>
                          {post.title}
                        </div>
                      );
                    })}
                    {dayPosts.length > 2 && (
                      <div className="text-[9px] text-slate-500 text-center">
                        +{dayPosts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {calendarView === 'day' && (
        <div className="bg-[#0C101D] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Detailed Publishing Schedule for {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
              <p className="text-xs text-slate-400">
                Hourly cadence across Instagram Reels and TikTok algorithms
              </p>
            </div>
            <Link
              href="/content?action=new"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs font-semibold"
            >
              + Add Schedule
            </Link>
          </div>

          <div className="space-y-3">
            {scheduledItems
              .filter((i) => isSameDay(new Date(i.scheduled_at!), currentDate))
              .map((post) => {
                const persona = personas.find((p) => p.id === post.persona_id);
                return (
                  <div
                    key={post.id}
                    className="p-4 bg-[#12182B] border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-bold text-cyan-400">{persona?.name}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300 uppercase text-[10px]">{post.platform} ({post.content_format})</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-amber-400 font-semibold text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {format(new Date(post.scheduled_at!), 'h:mm a')}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{post.title}</h4>
                      <p className="text-xs text-slate-400">"{post.hook}"</p>
                    </div>

                    <Link
                      href="/content"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg"
                    >
                      View in CMS
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500 text-xs">Loading Calendar Matrix...</div>}>
      <CalendarPageContent />
    </Suspense>
  );
}
