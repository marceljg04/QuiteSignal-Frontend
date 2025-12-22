import { CloudRainWind, CloudDrizzle, Cloud, CloudSun, Sun } from "lucide-react";

const MOODS = [
  { value: 1, icon: CloudRainWind, label: "Molt malament" },
  { value: 2, icon: CloudDrizzle, label: "Malament" },
  { value: 3, icon: Cloud, label: "Normal" },
  { value: 4, icon: CloudSun, label: "Bé" },
  { value: 5, icon: Sun, label: "Molt bé" },
];

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div className="mood-selector">
      {MOODS.map((mood) => {
        const Icon = mood.icon;
        return (
          <button
            key={mood.value}
            className={`mood-btn mood-${mood.value} ${selected === mood.value ? "selected" : ""}`}
            onClick={() => onSelect(mood.value)}
            title={mood.label}
            type="button"
          >
            <Icon size={24} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}

export { MOODS };
