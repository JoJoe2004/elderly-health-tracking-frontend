"use client";

import NotificationCard from "./NotificationCard";

type Reminder = {
  id: number;
  medicine_name: string;
  dose: number;
  dose_type: string;
  method: string;
  time: string;
  image: string;
  start_date: string;
  end_date: string | null;
  is_notify: number;
};

type Props = {
  reminders: Reminder[];
  onToggle: (id: number) => void;
};

export default function NotificationList({ reminders, onToggle }: Props) {
  if (reminders.length === 0) {
    return <div className="text-gray-500">ยังไม่มีการตั้งเวลาแจ้งเตือน</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {reminders.map((r) => (
        <NotificationCard key={r.id} data={r} onToggle={onToggle} />
      ))}
    </div>
  );
}
