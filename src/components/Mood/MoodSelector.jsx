const MOODS = [
  { value: 1, emoji: "😢", label: "Molt malament" },
  { value: 2, emoji: "😔", label: "Malament" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "🙂", label: "Bé" },
  { value: 5, emoji: "😊", label: "Molt bé" },
];

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div className="mood-selector">
      {MOODS.map((mood) => (
        <button
          key={mood.value}
          className={`mood-btn mood-${mood.value} ${selected === mood.value ? "selected" : ""}`}
          onClick={() => onSelect(mood.value)}
          title={mood.label}
          type="button"
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  );
}

export { MOODS };
