"use client";
import { useEffect, useState } from "react";
import { Eye, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  birth_date: string;
};

type HealthRow = {
  id: number;
  record_date: string;
  full_name: string;
  age: number;
  weight: number;
  pulse: number;
  blood_pressure: string;
};

export default function HealthTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const elderlyIdFromUrl = searchParams.get("elderlyId");

  const [elderlyList, setElderlyList] = useState<Elderly[]>([]);
  const [healthList, setHealthList] = useState<HealthRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    elderlyIdFromUrl ? Number(elderlyIdFromUrl) : null
  );

  // โหลดรายชื่อผู้สูงอายุ
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly?userId=${localStorage.getItem("userId")}`)
      .then(res => res.json())
      .then(data => {
        setElderlyList(data);
        if (elderlyIdFromUrl) {
          setSelectedId(Number(elderlyIdFromUrl));
        } else if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      });
  }, [elderlyIdFromUrl]);

  // โหลดบันทึกสุขภาพของผู้สูงอายุที่เลือก
  useEffect(() => {
    if (!selectedId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${selectedId}/health-records`)
      .then(res => res.json())
      .then(data => setHealthList(data));
  }, [selectedId]);

  const formatThaiDate = (iso: string) => {
    const d = new Date(iso);

    const months = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];

    const day = d.getDate().toString().padStart(2, "0");
    const month = months[d.getMonth()];
    const year = (d.getFullYear() + 543).toString().slice(-2); // พ.ศ. 2 หลัก

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-4 text-black">
      {/* Dropdown */}
      <div className="flex items-center gap-3">
        <h3 className="font-semibold">เลือกผู้สูงอายุ</h3>
        <select
          className="input w-80"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          {elderlyList.map(e => (
            <option key={e.id} value={e.id}>
              {e.title}{e.first_name} {e.last_name}
            </option>
          ))}
        </select>
      </div>

      {/* ตารางบันทึกสุขภาพ */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">บันทึกสุขภาพ</h3>
        </div>

        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#0D7C66] text-white">
              <tr>
                <th className="w-32 py-2 text-center">วันที่</th>
                <th className="w-48 py-2 text-center">ชื่อ-สกุล</th>
                <th className="w-16 py-2 text-center">อายุ</th>
                <th className="w-20 py-2 text-center">น้ำหนัก</th>
                <th className="w-20 py-2 text-center">ชีพจร</th>
                <th className="w-28 py-2 text-center">ความดัน</th>
                <th className="w-20 py-2 text-center">ดู</th>
              </tr>
            </thead>
            <tbody>
              {healthList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bg-white text-center py-4 text-gray-500">
                    ยังไม่มีบันทึกสุขภาพ
                  </td>
                </tr>
              ) : (
                healthList.map((h, i) => (
                  <tr key={h.id} className={i % 2 === 0 ? "bg-white" : "bg-[#DEF4DF]"}>
                    <td className="py-2 text-center">{formatThaiDate(h.record_date)}</td>
                    <td className="py-2 text-center">{h.full_name}</td>
                    <td className="py-2 text-center">{h.age}</td>
                    <td className="py-2 text-center">{h.weight}</td>
                    <td className="py-2 text-center">{h.pulse}</td>
                    <td className="py-2 text-center">{h.blood_pressure}</td>
                    <td>
                      <Eye
                        className="w-20 mx-auto text-emerald-600 cursor-pointer hover:scale-110"
                        size={16}
                        onClick={() => router.push(`/dashboard/health/view/${h.id}`)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => router.push(`/dashboard/health/add?elderlyId=${selectedId}`)}
            className="flex items-center gap-2 bg-[#0D7C66] text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition"
          >
            <Plus size={16} /> เพิ่มบันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
