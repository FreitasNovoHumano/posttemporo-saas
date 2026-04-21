"use client";

/**
 * =====================================================
 * 📅 CALENDAR VIEW (PRO - ESTILO INSTAGRAM)
 * =====================================================
 * Responsável por:
 * - Renderizar calendário de posts
 * - Exibir eventos com preview de imagem
 * - Drag & drop (reagendamento)
 * - Estilo baseado no status
 * - UX moderna
 *
 * Props:
 * - events: [{ id, title, start, end, status, image }]
 * - onMoveEvent: function
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
 * 🔄 Drag & Drop habilitado
 */
const DnDCalendar = withDragAndDrop(Calendar);

/**
 * 🎨 Cores por status
 */
const STATUS_COLORS = {
  DRAFT: "#9ca3af",
  SCHEDULED: "#f59e0b",
  PUBLISHED: "#10b981",
  REJECTED: "#ef4444",
};

/**
 * 🎨 Estilo dos eventos
 */
function eventStyleGetter(event) {
  return {
    style: {
      backgroundColor: "transparent", // 🔥 agora usamos card custom
      border: "none",
      padding: 0,
    },
  };
}

/**
 * 🖼️ EVENTO CUSTOMIZADO (ESTILO INSTAGRAM)
 */
function EventComponent({ event }) {
  return (
    <div
      className="
        flex items-center gap-2
        bg-white rounded-lg shadow px-2 py-1
        border-l-4
      "
      style={{
        borderColor: STATUS_COLORS[event.status] || "#3b82f6",
      }}
    >
      {/* 🖼️ IMAGEM */}
      {event.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${event.image}`}
          className="w-6 h-6 rounded object-cover"
        />
      )}

      {/* 📝 TEXTO */}
      <div className="flex flex-col">
        <span className="text-xs font-semibold truncate">
          {event.title}
        </span>

        <span
          className="text-[10px]"
          style={{
            color: STATUS_COLORS[event.status],
          }}
        >
          {event.status}
        </span>
      </div>
    </div>
  );
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
   * 🔄 Drag & Drop
   */
  const handleEventDrop = ({ event, start, end }) => {
    if (!onMoveEvent) return;

    onMoveEvent({
      id: event.id,
      newStart: start,
      newEnd: end,
    });
  };

  const handleEventResize = ({ event, start, end }) => {
    if (!onMoveEvent) return;

    onMoveEvent({
      id: event.id,
      newStart: start,
      newEnd: end,
    });
  };

  /**
   * 🎯 Clique no evento
   */
  const handleSelectEvent = (event) => {
    console.log("📌 Evento clicado:", event);
    // 👉 futuro: abrir modal
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow h-[650px]">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"

        /**
         * 📊 Views
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
         * 🎨 Customização visual
         */
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent, // 🔥 AQUI ESTÁ O PULO DO GATO
        }}
      />
    </div>
  );
}