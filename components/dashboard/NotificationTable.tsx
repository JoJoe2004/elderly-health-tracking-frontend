"use client";

import { useEffect, useState } from "react";

type NotificationApiRow = {
  time_id: number;
  elderly_name: string;
  medicine_name: string;
  time: string;
  status: "pending" | "waiting" | "taken" | "missed";
  sent_at: string | null;
  response_at: string | null;
};

type Notification = {
  timeId: number;
  elderName: string;
  medicine: string;
  time: string;
  status: "pending" | "waiting" | "taken" | "missed";
};

export default function NotificationTable() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

       try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/medicines/notifications/today/${userId}`
      );

      if (!res.ok) return;

      const data: NotificationApiRow[] = await res.json();

      const mapped: Notification[] = data.map(row => ({
        timeId: row.time_id,
        elderName: row.elderly_name,
        medicine: row.medicine_name,
        time: row.time.slice(0, 5),
        status: row.status,
      }));

      setNotifications(mapped);
    } catch {
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
      fetchNotifications(); // โหลดครั้งแรก

      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000); // ⏱ ทุก 15 วิ

      return () => clearInterval(interval);
    }, []);

    const renderStatus = (status: Notification["status"]) => {
      switch (status) {
        case "pending":
          return <span className="text-gray-400">รอแจ้งเตือน</span>;
        case "waiting":
          return <span className="text-orange-500">รอการตอบกลับ</span>;
        case "taken":
          return <span className="text-green-600 font-medium">ทานแล้ว</span>;
        case "missed":
          return <span className="text-red-500 font-medium">พลาดการทานยา</span>;
      }
    };
    if (loading) {
      return <div className="text-gray-400">กำลังโหลดข้อมูล...</div>;
    }
    
  return (
    <div className="space-y-2">
      {/* Title */}
      <h3 className="font-semibold mb-1 text-black">
        การแจ้งเตือนวันนี้
      </h3>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="max-h-80 overflow-y-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-[#0D7C66] text-white">
              <th className="py-2 px-4 text-center">ผู้สูงอายุ</th>
              <th className="py-2 px-4 text-center">ยา</th>
              <th className="py-2 px-4 text-center">เวลา</th>
              <th className="py-2 px-4 text-center">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-2 text-center text-gray-400"
                >
                  - ไม่มีข้อมูล -
                </td>
              </tr>
            ) : (
              notifications.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 1 ? "bg-emerald-50" : ""}
                >
                  <td className="py-2 px-4 text-center text-black">
                    {item.elderName}
                  </td>
                  <td className="py-2 px-4 text-center text-black">
                    {item.medicine}
                  </td>
                  <td className="py-2 px-4 text-center text-black">
                    {item.time}
                  </td>
                  <td className="py-2 px-4 text-center text-black">
                    {renderStatus(item.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
