export default function formatElectionDates(dateString) {
  const date = new Date(dateString);

  const formatted = date.toLocaleString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatted;
}
