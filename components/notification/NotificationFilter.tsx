"use client";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
};

type Props = {
  list: Elderly[];
  selectedId: number;
  onChange: (id: number) => void;
};

export default function NotificationFilter({ list, selectedId, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 text-black">
      <h3 className="font-semibold">เลือกผู้สูงอายุ</h3>
      <select
        className="input w-80"
        value={selectedId}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {list.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
            {e.first_name} {e.last_name}
          </option>
        ))}
      </select>
    </div>
  );
}
