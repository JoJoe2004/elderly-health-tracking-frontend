"use client";

type Props = {
  enabled: boolean;
  onToggle: () => void;
};

export default function NotificationToggle({ enabled, onToggle }: Props) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={enabled}
        onChange={onToggle}
      />
      <div
        className={`w-16 h-7 p-1 rounded-full transition ${
          enabled ? "bg-emerald-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition ${
            enabled ? "translate-x-9" : "translate-x-0"
          }`}
        />
      </div>
    </label>
  );
}
