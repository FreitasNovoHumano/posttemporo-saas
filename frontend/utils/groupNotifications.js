/**
 * =====================================================
 * 🧠 GROUP NOTIFICATIONS
 * =====================================================
 * Agrupa notificações semelhantes
 * Ex: "3 pessoas aprovaram o post"
 * =====================================================
 */

export default function groupNotifications(notifications) {
  const groups = {};

  notifications.forEach((n) => {
    const key = `${n.action}-${n.postId}`;

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(n);
  });

  return Object.values(groups);
}