"use client";

// 🔹 Importa seu componente já existente
import CalendarView from "../../../components/calendar/page";

/**
 * 📅 Página do calendário
 */
export default function CalendarPage() {
  return (
    <div className="p-6">
      <CalendarView />
    </div>
  );
}"use client";

/**
 * 📅 CalendarView (NÍVEL PROFISSIONAL)
 * -------------------------------------
 * Responsabilidades:
 * ✔ Renderizar calendário
 * ✔ Drag-and-drop (salva no banco)
 * ✔ Tooltip com imagem
 * ✔ Filtro por status
 * ✔ Modal de edição
 */

import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import ptBR from "date-fns/locale/pt-BR";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

/**
 * 🌎 Localização
 */
const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * 🔥 Habilita drag-and-drop
 */
const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarView({ events, setEvents }) {

  /**
   * 🎯 Estados
   */
  const [filter, setFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);

  /**
   * 🎨 Cor por status
   */
  function eventStyleGetter(event) {
    let color = "#3b82f6";

    if (event.status === "APPROVED") color = "#22c55e";
    if (event.status === "PENDING") color = "#facc15";
    if (event.status === "REJECTED") color = "#ef4444";

    return {
      style: {
        backgroundColor: color,
        color: "white",
        borderRadius: "8px",
        padding: "4px",
      },
    };
  }

  /**
   * 🔄 Drag-and-drop (salva no backend)
   */
  async function handleEventDrop({ event, start }) {
    await fetch(
      `http://localhost:3001/posts/${event.id}/schedule`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ date: start }),
      }
    );

    const updated = events.map((e) =>
      e.id === event.id ? { ...e, start } : e
    );

    setEvents(updated);
  }

  /**
   * 👆 Clique no evento
   */
  function handleSelectEvent(event) {
    setSelectedEvent(event);
  }

  /**
   * 🖼️ Tooltip customizado
   */
  function CustomEvent({ event }) {
    return (
      <div>
        <strong>{event.title}</strong>

        {event.image && (
          <img
            src={`http://localhost:3001/uploads/${event.image}`}
            className="w-16 h-16 mt-1 rounded"
          />
        )}
      </div>
    );
  }

  /**
   * 🔎 Filtro
   */
  const filteredEvents =
    filter === "ALL"
      ? events
      : events.filter((e) => e.status === filter);

  return (
    <div className="space-y-4">

      {/* 🔎 FILTRO */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="ALL">Todos</option>
        <option value="PENDING">Pendentes</option>
        <option value="APPROVED">Aprovados</option>
        <option value="REJECTED">Rejeitados</option>
      </select>

      {/* 📅 CALENDÁRIO */}
      <div className="bg-white p-4 rounded-xl shadow h-[75vh]">
        <DnDCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"

          step={30}
          timeslots={2}

          defaultView="week"
          views={["month", "week", "day"]}

          onEventDrop={handleEventDrop}
          onSelectEvent={handleSelectEvent}

          eventPropGetter={eventStyleGetter}

          components={{ event: CustomEvent }}

          culture="pt-BR"
        />
      </div>

      {/* 🧠 MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">

            <h2 className="font-bold text-lg">Editar Post</h2>

            <input
              value={selectedEvent.title}
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  title: e.target.value,
                })
              }
              className="w-full border p-2 rounded"
            />

            <button
              onClick={async () => {
                await fetch(
                  `http://localhost:3001/posts/${selectedEvent.id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      title: selectedEvent.title,
                    }),
                  }
                );

                setSelectedEvent(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500"
            >
              Cancelar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}