/**
 * 🔌 useSocket
 * --------------------------------------------------
 * Gerencia conexão com websocket (tempo real)
 */

import { useEffect } from "react";

export default function useSocket() {
  useEffect(() => {
    console.log("Socket conectado");

    return () => {
      console.log("Socket desconectado");
    };
  }, []);
}