/**
 * =====================================================
 * 🧠 COPY GENERATOR (SIMULA IA)
 * =====================================================
 *
 * 🎯 Objetivo:
 * Gerar textos dinâmicos por segmento sem depender de IA
 *
 * ✔ rápido
 * ✔ sem custo
 * ✔ nunca falha
 *
 * =====================================================
 */

export const copyTemplates: Record<string, string[]> = {
  hamburgueria: [
    "🍔 Hoje é dia de hambúrguer artesanal!",
    "🔥 Sabor que conquista na primeira mordida!",
    "😋 Já pensou nesse hambúrguer agora?",
  ],

  pizzaria: [
    "🍕 Pizza quentinha saindo agora!",
    "🔥 Promoção especial hoje!",
    "😋 Seu cliente está com fome agora!",
  ],

  sushi: [
    "🍣 Fresquinho e preparado na hora!",
    "🔥 Experiência premium hoje!",
    "😋 Seu jantar merece isso!",
  ],

  churrasco: [
    "🔥 Churrasco no ponto perfeito!",
    "🥩 Hoje é dia de carne na brasa!",
    "😋 Vem garantir o seu!",
  ],

  acai: [
    "🍇 Açaí gelado pra refrescar seu dia!",
    "🔥 Combinação perfeita hoje!",
    "😋 Peça agora!",
  ],

  tropeiro: [
    "🥘 Comida caseira de verdade!",
    "🔥 Sabor mineiro no seu prato!",
    "😋 Hoje tem tropeiro!",
  ],

  parmegiana: [
    "🍗 Parmegiana suculenta!",
    "🔥 Crocante por fora, macio por dentro!",
    "😋 Experimente hoje!",
  ],

  hotdog: [
    "🌭 Cachorro-quente completo!",
    "🔥 Explosão de sabor!",
    "😋 Já pediu o seu hoje?",
  ],

  default: [
    "🔥 Hoje é dia de vender mais!",
    "🚀 Seu restaurante pode mais!",
    "😋 Clientes estão procurando por você!",
  ],
};

/**
 * 🧠 Função que gera texto dinâmico
 */
export function generateLocalPost(
  type: string,
  company: string
): string {
  const copies = copyTemplates[type] || copyTemplates.default;

  const randomCopy =
    copies[Math.floor(Math.random() * copies.length)];

  return `${company}

${randomCopy}

📲 Peça agora e aumente seu movimento!`;
}