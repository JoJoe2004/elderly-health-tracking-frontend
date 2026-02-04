"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import NotificationTable from "@/components/dashboard/NotificationTable";
import HealthChart from "@/components/health/HealthChart";

// type จาก API โดยตรง
type ElderlyApiResponse = {
  id: number;
  title: string | null;
  first_name: string;
  last_name: string;
};

type ElderlyOption = {
  id: number;
  name: string;
};


export default function DashboardPage() {
  const [elderlyCount, setElderlyCount] = useState(0);
  const [notifyCount, setNotifyCount] = useState(0);

  const [elderlyList, setElderlyList] = useState<ElderlyOption[]>([]);
  const [selectedElderlyId, setSelectedElderlyId] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // จำนวนผู้สูงอายุ
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/count/${userId}`)
      .then(res => res.json())
      .then(data => setElderlyCount(data.total ?? 0));

    // แจ้งเตือนวันนี้
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/notifications/today/${userId}`)
      .then(res => res.json())
      .then(data => setNotifyCount(data.length ?? 0));

    // ✅ โหลดรายชื่อ elderly
     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/elderlies`)
    .then(res => res.json())
    .then((data: ElderlyApiResponse[]) => {
      const list: ElderlyOption[] = data.map((e) => ({
        id: e.id,
        name: `${e.title ?? ""}${e.first_name} ${e.last_name}`.trim(),
      }));

      setElderlyList(list);

      if (list.length > 0) {
        setSelectedElderlyId(list[0].id);
      }
    })
    .catch(err => {
      console.error("โหลดรายชื่อผู้สูงอายุไม่สำเร็จ", err);
      setElderlyList([]);
    });
}, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row gap-6">
        <div>
          <h3 className="font-semibold text-black mb-1">
            จำนวนผู้สูงอายุในความดูแล
          </h3>
          <StatCard value={elderlyCount} unit="คน" iconSrc="/icons/icon_elderly.png" />
        </div>
        
        <div>
          <h3 className="font-semibold text-black  mb-1">
            แจ้งเตือนที่ต้องส่งวันนี้
          </h3>
           <StatCard value={notifyCount} unit="รายการ" iconSrc="/icons/icon_notify.png" />
        </div>
      </div>

      <NotificationTable />

      <div className=" rounded-xl space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-black">
            กราฟสุขภาพโดยรวมผู้สูงอายุ
          </h3>

          <select
            className="input text-black w-80"
            value={selectedElderlyId ?? ""}
            onChange={(e) => setSelectedElderlyId(Number(e.target.value))}
          >
            {elderlyList.length === 0 && (
              <option value="">ไม่มีผู้สูงอายุ</option>
            )}

            {elderlyList.map(e => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white">
          {/* ✅ ใช้ HealthChart ตัวเดิม */}
          {selectedElderlyId !== null && (
            <HealthChart elderlyId={selectedElderlyId}/>
          )}
        </div>
      </div>
    </div>
  );
}
