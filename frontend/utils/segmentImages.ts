/**
 * =====================================================
 * 🖼️ IMAGENS POR SEGMENTO (FALLBACK INTELIGENTE)
 * =====================================================
 *
 * 🎯 Objetivo:
 * Garantir imagem SEMPRE carregada
 *
 * Ordem:
 * 1. Unsplash
 * 2. Picsum
 * 3. Placeholder
 * 4. Robohash
 *
 * =====================================================
 */

export const segmentImages: Record<string, string[]> = {
  hamburgueria: [
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    "https://picsum.photos/seed/burger/800/600",
    "https://via.placeholder.com/800x600?text=Hamburguer",
    "https://robohash.org/burger?size=800x600",
  ],

  pizzaria: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    "https://picsum.photos/seed/pizza/800/600",
    "https://via.placeholder.com/800x600?text=Pizza",
    "https://robohash.org/pizza?size=800x600",
  ],

  sushi: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    "https://picsum.photos/seed/sushi/800/600",
    "https://via.placeholder.com/800x600?text=Sushi",
    "https://robohash.org/sushi?size=800x600",
  ],

  churrasco: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    "https://picsum.photos/seed/churrasco/800/600",
    "https://via.placeholder.com/800x600?text=Churrasco",
    "https://robohash.org/churrasco?size=800x600",
  ],

  acai: [
    "https://images.unsplash.com/photo-1598514982901-1b8a3c6c6e63?w=800",
    "https://picsum.photos/seed/acai/800/600",
    "https://via.placeholder.com/800x600?text=Acai",
    "https://robohash.org/acai?size=800x600",
  ],

  tropeiro: [
    "https://picsum.photos/seed/tropeiro/800/600",
    "https://via.placeholder.com/800x600?text=Tropeiro",
    "https://robohash.org/tropeiro?size=800x600",
  ],

  parmegiana: [
    "https://picsum.photos/seed/parmegiana/800/600",
    "https://via.placeholder.com/800x600?text=Parmegiana",
    "https://robohash.org/parmegiana?size=800x600",
  ],

  hotdog: [
    "https://images.unsplash.com/photo-1550547660-4d90c6b8c1b4?w=800",
    "https://picsum.photos/seed/hotdog/800/600",
    "https://via.placeholder.com/800x600?text=Hotdog",
    "https://robohash.org/hotdog?size=800x600",
  ],

  default: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    "https://picsum.photos/seed/food/800/600",
    "https://via.placeholder.com/800x600?text=Restaurante",
    "https://robohash.org/food?size=800x600",
  ],
};