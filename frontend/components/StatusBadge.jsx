"use client";

export default function StatusBadge({ status }) {
  const styles = {
    APPROVED: { color: "green" },
    REJECTED: { color: "red" },
    SCHEDULED: { color: "orange" },
    DRAFT: { color: "gray" },
  };

  return (
    <span style={styles[status] || {}}>
      {status}
    </span>
  );
}