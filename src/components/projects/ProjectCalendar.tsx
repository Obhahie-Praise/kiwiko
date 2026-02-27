"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Video,
  Flag,
  Mail,
  Users,
  Calendar,
  Clock,
  Tag,
  Plus,
} from "lucide-react";
import AddEventModal from "./AddEventModal";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventKind = "achievement" | "meeting" | "milestone" | "email" | "team";

export interface CalendarEvent {
  id: string;
  kind?: EventKind;
  title: string;
  description?: string;
  date: Date; // exact datetime
  endDate?: Date;
  duration?: number; // minutes, for meetings
  past: boolean;
  color?: string; // custom hex color
}

import { getCalendarEventsAction, addCalendarEventAction } from "@/actions/calendar.actions";

// ─── Config ───────────────────────────────────────────────────────────────────

const KIND_META: Record<EventKind, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  achievement: { label: "Achievement", color: "text-amber-600", bg: "bg-amber-50 border-amber-100", Icon: Trophy },
  meeting:     { label: "Meeting",     color: "text-sky-600",   bg: "bg-sky-50 border-sky-100",   Icon: Video },
  milestone:   { label: "Milestone",   color: "text-violet-600",bg: "bg-violet-50 border-violet-100", Icon: Flag },
  email:       { label: "Email",       color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-100", Icon: Mail },
  team:        { label: "Team",        color: "text-zinc-600",  bg: "bg-zinc-100 border-zinc-200", Icon: Users },
};

const now = new Date();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00 – 22:00

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(d: Date) {
  const copy = new Date(d);
  copy.setDate(d.getDate() - d.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(d.getDate() + n);
  return copy;
}

function getEventStyles(event: CalendarEvent) {
  const meta = KIND_META[event.kind || 'team'];
  if (event.color) {
    return {
      Icon: Calendar,
      bgClass: "",
      colorClass: "",
      styleBg: { backgroundColor: `${event.color}15`, borderColor: `${event.color}30` },
      styleColor: { color: event.color },
    };
  }
  return {
    Icon: meta.Icon,
    bgClass: meta.bg,
    colorClass: meta.color,
    styleBg: {},
    styleColor: {},
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventDot({ event }: { event: CalendarEvent }) {
  if (event.color) {
    return <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: event.color }} />;
  }
  const { color } = KIND_META[event.kind || 'team'];
  return <span className={`w-2 h-2 rounded-full ${color.replace("text-", "bg-")} inline-block shrink-0`} />;
}

function EventPill({ event }: { event: CalendarEvent }) {
  const s = getEventStyles(event);
  const Icon = s.Icon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${s.bgClass} transition-all hover:shadow-sm`} style={s.styleBg}>
      <div className={`mt-0.5 shrink-0 ${s.colorClass}`} style={s.styleColor}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-zinc-900 truncate">{event.title}</p>
          <span className={`text-xs font-bold uppercase tracking-widest ${s.colorClass} shrink-0`} style={s.styleColor}>
            {event.kind ? KIND_META[event.kind].label : "Event"}
          </span>
        </div>
        {event.description && (
          <p className="text-sm text-zinc-500 mt-0.5 line-clamp-1">{event.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {event.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            {event.endDate && ` - ${event.endDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} /> {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {event.duration && (
            <span className="flex items-center gap-1">
              <Tag size={10} /> {event.duration}min
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Month Grid View ──────────────────────────────────────────────────────────

function MonthView({ cursor, events }: { cursor: Date; events: CalendarEvent[] }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 mb-1 pb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-zinc-400 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
        {cells.map((day, i) => {
          const dayEvents = day ? events.filter((e) => sameDay(e.date, day)) : [];
          const isToday = day ? sameDay(day, now) : false;
          return (
            <div
              key={i}
              className={`min-h-[90px] p-2 flex flex-col gap-1 ${day ? "bg-white hover:bg-zinc-50" : "bg-zinc-50"} transition-colors`}
            >
              {day && (
                <>
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors mb-1 ${
                      isToday ? "bg-zinc-900 text-white" : "text-zinc-500"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((e) => {
                      const s = getEventStyles(e);
                      return (
                        <div
                          key={e.id}
                          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate ${s.bgClass} ${s.colorClass} border`}
                          style={{...s.styleBg, ...s.styleColor}}
                          title={e.title}
                        >
                          <EventDot event={e} />
                          <span className="truncate">{e.title}</span>
                        </div>
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <p className="text-[9px] text-zinc-400 pl-1 font-medium">+{dayEvents.length - 3} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week Grid View ───────────────────────────────────────────────────────────

function WeekView({ cursor, events }: { cursor: Date; events: CalendarEvent[] }) {
  const weekStart = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {days.map((day) => {
          const isToday = sameDay(day, now);
          return (
            <div key={day.toISOString()} className="text-center pb-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{DAYS[day.getDay()]}</p>
              <p
                className={`text-sm font-bold mt-1 w-7 h-7 mx-auto flex items-center justify-center rounded-full ${
                  isToday ? "bg-zinc-900 text-white" : "text-zinc-600"
                }`}
              >
                {day.getDate()}
              </p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 gap-px bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
        {days.map((day) => {
          const dayEvents = events.filter((e) => sameDay(e.date, day));
          return (
            <div key={day.toISOString()} className="min-h-[200px] bg-white p-2 space-y-1.5">
              {dayEvents.map((e) => {
                const s = getEventStyles(e);
                const Icon = s.Icon;
                return (
                  <div key={e.id} className={`flex items-start gap-1.5 p-1.5 rounded-lg border ${s.bgClass} ${s.colorClass} text-[10px] font-semibold`} style={{...s.styleBg, ...s.styleColor}}>
                    <Icon size={12} className="mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{e.title}</p>
                      <p className="opacity-70 font-medium mt-0.5">{e.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Day Timeline View ────────────────────────────────────────────────────────

function DayView({ cursor, events }: { cursor: Date; events: CalendarEvent[] }) {
  const dayEvents = events.filter((e) => sameDay(e.date, cursor));

  return (
    <div className="border border-zinc-100 rounded-xl overflow-hidden">
      {HOURS.map((hour) => {
        const slotEvents = dayEvents.filter((e) => e.date.getHours() === hour);
        const isCurrentHour = now.getHours() === hour && sameDay(cursor, now);
        return (
          <div
            key={hour}
            className={`flex gap-4 min-h-[56px] border-b border-zinc-50 last:border-0 ${isCurrentHour ? "bg-zinc-50/50" : "bg-white"}`}
          >
            <div className="w-14 shrink-0 py-2 pl-3 flex items-start">
              <span className={`text-[10px] font-bold tabular-nums ${isCurrentHour ? "text-zinc-900" : "text-zinc-400"}`}>
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
            <div className="flex-1 py-1.5 pr-2 flex flex-col gap-1.5">
              {slotEvents.map((e) => {
                const s = getEventStyles(e);
                const Icon = s.Icon;
                return (
                  <div key={e.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${s.bgClass} ${s.colorClass} text-xs font-semibold`} style={{...s.styleBg, ...s.styleColor}}>
                    <Icon size={14} className="shrink-0" />
                    <span className="flex-1 truncate">{e.title}</span>
                    {e.duration && <span className="opacity-70 font-medium shrink-0">{e.duration}min</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type ViewMode = "day" | "week" | "month";
type TabMode  = "upcoming" | "past";

export default function ProjectCalendar({ projectId }: { projectId: string }) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView]     = useState<ViewMode>("month");
  const [cursor, setCursor] = useState(new Date());
  const [tab, setTab]       = useState<TabMode>("upcoming");
  const [filter, setFilter] = useState<EventKind | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drag-to-scroll refs and state for log list
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Load events from DB
  useEffect(() => {
    async function load() {
      const res = await getCalendarEventsAction(projectId);
      if (res.success) {
        setEvents(res.data.map((e: any) => ({
          id: e.id,
          kind: e.attendees?.kind || "team",
          title: e.title,
          description: e.description || undefined,
          date: new Date(e.startTime),
          endDate: e.endTime ? new Date(e.endTime) : undefined,
          duration: e.endTime ? Math.round((new Date(e.endTime).getTime() - new Date(e.startTime).getTime()) / 60000) : undefined,
          past: new Date(e.startTime).getTime() < new Date().getTime(),
          color: undefined
        })));
      }
    }
    load();
  }, [projectId]);

  const handleAddEvent = async (newEvent: CalendarEvent) => {
    // Add optimistic approach
    setEvents(p => [...p, newEvent]);
    const res = await addCalendarEventAction(projectId, {
      title: newEvent.title,
      description: newEvent.description,
      startTime: newEvent.date,
      endTime: newEvent.endDate || newEvent.date,
      kind: newEvent.kind,
    });
    if (!res.success) {
      // Revert if error
      setEvents(p => p.filter(e => e.id !== newEvent.id));
    }
  };

  // Drag handlers for Event Log list
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const y = e.pageY - scrollRef.current.offsetTop;
    const walkX = (x - startX) * 2; // scroll-fast multiplier
    const walkY = (y - startY) * 2; // scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeft - walkX;
    scrollRef.current.scrollTop = scrollTop - walkY;
  };

  // Navigate cursor
  const navigate = (dir: 1 | -1) => {
    const next = new Date(cursor);
    if (view === "day")   next.setDate(cursor.getDate() + dir);
    if (view === "week")  next.setDate(cursor.getDate() + dir * 7);
    if (view === "month") next.setMonth(cursor.getMonth() + dir);
    setCursor(next);
  };

  const goToday = () => setCursor(new Date());

  // Cursor label
  const cursorLabel = useMemo(() => {
    if (view === "day")   return cursor.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (view === "week") {
      const ws = startOfWeek(cursor);
      const we = addDays(ws, 6);
      return `${ws.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${we.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
  }, [cursor, view]);

  const filteredEvents = filter === "all" ? events : events.filter((e) => e.kind === filter);
  const tabList = filteredEvents.filter((e) => tab === "upcoming" ? !e.past : e.past)
    .sort((a, b) => tab === "upcoming" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime());

  return (
    <>
      <div className="bg-white border-[0.1px] border-zinc-200 rounded-2xl p-5 h-full flex flex-col overflow-hidden shadow-none hover:shadow-md transition-shadow">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-zinc-900">Event Calendar</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 gap-0.5">
              {(["day","week","month"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize tracking-widest transition-all ${
                    view === v ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={goToday}
              className="px-4 py-1.5 text-xs font-bold text-zinc-600 border border-zinc-200 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-all"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar navigation */}
        <div className="flex items-center justify-between py-3 mb-2 border-b border-zinc-100">
          <div className="flex items-center gap-1.5">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <h4 className="text-sm font-semibold text-zinc-900 min-w-[200px] text-center">{cursorLabel}</h4>
            <button onClick={() => navigate(1)} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Kind filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-widest transition-all border ${
                filter === "all" ? "bg-zinc-900 text-white border-zinc-900" : "text-zinc-500 bg-zinc-50 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              All
            </button>
            {(Object.keys(KIND_META) as EventKind[]).map((k) => {
              const { label, color, bg } = KIND_META[k];
              return (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-widest transition-all border ${
                    filter === k ? `${bg} ${color} border-current ring-1 ring-current ring-offset-1` : "text-zinc-500 bg-zinc-50 border-zinc-100 hover:border-zinc-300 hover:bg-zinc-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calendar body */}
        <div className="py-2">
          {view === "month" && <MonthView cursor={cursor} events={filteredEvents} />}
          {view === "week"  && <WeekView  cursor={cursor} events={filteredEvents} />}
          {view === "day"   && <DayView   cursor={cursor} events={filteredEvents} />}
        </div>

        {/* Event Log */}
        <div className="mt-4 pt-4 border-t border-zinc-100">
          {/* Tabs */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-1 bg-zinc-50 rounded-lg p-0.5">
              {(["upcoming","past"] as TabMode[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold tracking-[0.5px] transition-all ${
                    tab === t ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {t === "upcoming" ? `Upcoming - ${events.filter(e => !e.past).length}` : `Past - ${events.filter(e => e.past).length}`}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm focus:ring-4 focus:ring-blue-500/20"
            >
              <Plus size={14} /> Add Event
            </button>
          </div>

          {/* Event list */}
          <div 
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className={`space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
          >
            {tabList.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-3 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-700">No {tab} events</p>
                  <p className="text-xs text-zinc-500 mt-1">Events you add will appear here.</p>
                </div>
              </div>
            ) : (
              tabList.map((e) => <EventPill key={e.id} event={e} />)
            )}
          </div>
        </div>
      </div>

      <AddEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddEvent}
      />
    </>
  );
}
