"use client";

import { useEffect, useState } from "react";
import NotificationFilter from "@/components/notification/NotificationFilter";
import NotificationList from "@/components/notification/NotificationList";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
};

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

export default function NotificationPage() {
  const [elderlyList, setElderlyList] = useState<Elderly[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly?userId=` + userId)
    .then(res => res.json())
    .then(data => {
      setElderlyList(data);

      if (data.length > 0) {
        setSelectedId(data[0].id);
      }
    });
}, []);


  useEffect(() => {
    if (!selectedId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${selectedId}`)
      .then((res) => res.json())
      .then((data) => setReminders(data));
  }, [selectedId]);

  const toggleNotify = async (timeId: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${timeId}/toggle`, {
      method: "PATCH",
    });

    setReminders((prev) =>
      prev.map((r) =>
        r.id === timeId ? { ...r, is_notify: r.is_notify ? 0 : 1 } : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <NotificationFilter
        list={elderlyList}
        selectedId={selectedId}
        onChange={setSelectedId}
      />

      <NotificationList reminders={reminders} onToggle={toggleNotify} />
    </div>
  );
}
