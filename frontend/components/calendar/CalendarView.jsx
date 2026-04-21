"use client";

/**
 * =====================================================
 * 📅 CALENDAR VIEW (React Big Calendar + Drag & Drop)
 * =====================================================
 * Responsável por:
 * - Renderizar calendário de posts
 * - Exibir eventos (posts agendados)
 * - Permitir mover eventos (drag & drop)
 * - Permitir redimensionar eventos
 * - Aplicar estilo baseado no status
 *
 * Props:
 * - events: [
 *     { id, title, start: Date, end: Date, status }
 *   ]
 * - onMoveEvent: ({ id, newStart, newEnd }) => void
 *
 * =====================================================
 */

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import { format, parse, startOfWeek, getDay } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";


/**
 * 🌎 Localização pt-BR
 */
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { "pt-BR": ptBR },
});

/**
 * 🔄 Habilita Drag & Drop
 */
const DnDCalendar = withDragAndDrop(Calendar);

/**
 * 🎨 Estilo dos eventos baseado no status
 */
function eventStyleGetter(event) {
  const statusColors = {
    DRAFT: "#9ca3af",
    SCHEDULED: "#f59e0b",
    PUBLISHED: "#10b981",
    REJECTED: "#ef4444", // 🔥 novo status
  };

  return {
    style: {
      backgroundColor: statusColors[event.status] || "#3b82f6",
      borderRadius: "6px",
      color: "#fff",
      border: "none",
      padding: "4px 6px",
      fontSize: "12px",
      cursor: "pointer",
    },
  };
}

/**
 * 📅 COMPONENTE PRINCIPAL
 */
export default function CalendarView({
  events = [],
  onMoveEvent,
}) {
  /**
   * ⚠️ EMPTY STATE
   */
  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow h-[300px] flex items-center justify-center">
        <p className="text-gray-500">
          Nenhum post agendado ainda 📅
        </p>
      </div>
    );
  }

  /**
   * 🔄 Evento movido (drag & drop)
   */
  const handleEventDrop = ({ event, start, end }) => {
    if (!onMoveEvent) return;

    onMoveEvent({
      id: event.id,
      newStart: start,
      newEnd: end,
    });
  };

  /**
   * 🔄 Evento redimensionado
   */
  const handleEventResize = ({ event, start, end }) => {
    if (!onMoveEvent) return;

    onMoveEvent({
      id: event.id,
      newStart: start,
      newEnd: end,
    });
  };

  /**
   * 🎯 Clique no evento (preparado pra futuro modal)
   */
  const handleSelectEvent = (event) => {
    console.log("📌 Evento clicado:", event);
    // 🔥 futuro: abrir modal de edição
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow h-[650px]">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"

        /**
         * 📊 Visualizações
         */
        defaultView="month"
        views={["month", "week", "day"]}
        culture="pt-BR"
        style={{ height: "100%" }}

        /**
         * 🔥 Drag & Drop
         */
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        resizable

        /**
         * 🎯 UX
         */
        selectable
        popup
        longPressThreshold={200}
        onSelectEvent={handleSelectEvent}

        /**
         * 🎨 Estilo dos eventos
         */
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}