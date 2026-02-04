"use client";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
};

type MedicineRow = {
  time_id: number;
  medicine_id: number;
  medicine_name: string;
  dose: string;
  dose_type: string;
  time: string;
  method: string;
  side_effect: string;
};

const doseTypeMap: Record<string, string> = {
  tablet: "เม็ด",
  capsule: "แคปซูล",
  liquid: "มล.",
  spoon: "ช้อน",
};

export default function MedicineTable() {
  const searchParams = useSearchParams();
  const elderlyIdFromUrl = searchParams.get("elderlyId");
  const router = useRouter();
  const [elderlyList, setElderlyList] = useState<Elderly[]>([]);
  const [medicineList, setMedicineList] = useState<MedicineRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    elderlyIdFromUrl ? Number(elderlyIdFromUrl) : null
  );
  const [deleteTimeId, setDeleteTimeId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);


  // โหลดผู้สูงอายุ
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly?userId=${localStorage.getItem("userId")}`)
    .then(res => res.json())
    .then(data => {
      setElderlyList(data);

      if (elderlyIdFromUrl) {
        setSelectedId(Number(elderlyIdFromUrl));
      } else if (data.length > 0) {
        setSelectedId(data[0].id); // fallback คนแรก
      }
    });
  }, [elderlyIdFromUrl]);

  // โหลดรายการยาของคนที่เลือก
  useEffect(() => {
    if (!selectedId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${selectedId}/medicine-table`)
      .then(res => res.json())
      .then(data => setMedicineList(data));
  }, [selectedId]);

  const methodText = (value: string) => {
    if (value === "before") return "ก่อนอาหาร";
    if (value === "after") return "หลังอาหาร";
    if (value === "with_food") return "พร้อมอาหาร";
    if (value === "bedtime") return "ก่อนนอน";
    return "-";
  };

  const handleDelete = async () => {
    if (!deleteTimeId || !selectedId) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicine-times/${deleteTimeId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMedicineList(prev => prev.filter(m => m.time_id !== deleteTimeId));
      setDeleteTimeId(null);
      setShowSuccess(true);
    } else {
      alert("ลบไม่สำเร็จ");
    }
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

      {/* ตารางยา */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">ยาที่ใช้ปัจจุบัน</h3>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-[#0D7C66] text-white">
              <tr>
                <th className="w-75 py-2 text-center">ชื่อยา</th>
                <th className="w-24 py-2 text-center">ขนาดยา</th>
                <th className="w-24 py-2 text-center">เวลา</th>
                <th className="w-24 py-2 text-center">วิธีใช้</th>
                <th className="w-40 py-2 text-center">ผลข้างเคียง</th>
                <th className="w-20 py-2 text-center">แก้ไข</th>
                <th className="w-20 py-2 text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {medicineList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bg-white text-center py-4 text-gray-500">
                    ยังไม่มียาที่บันทึกไว้
                  </td>
                </tr>
              ) : (
                medicineList.map((m, i) => (
                  <tr key={m.time_id} className={i % 2 === 0 ? "bg-white" : "bg-[#DEF4DF]"}>
                    <td className="w-75 py-2 text-center">{m.medicine_name}</td>
                    <td className="w-24 py-2 text-center">{m.dose} {doseTypeMap[m.dose_type]}</td>
                    <td className="w-24 py-2 text-center">{m.time.slice(0,5)}</td>
                    <td className="w-24 py-2 text-center">{methodText(m.method)}</td>
                    <td className="w-40 py-2 text-center">{m.side_effect || "-"}</td>
                    <td><Pencil 
                          className="w-20 mx-auto text-emerald-600 cursor-pointer hover:scale-110" 
                          size={16} 
                          onClick={() => router.push(`/dashboard/medication/edit/${m.medicine_id}`)}
                        />
                    </td>
                    <td><Trash2 
                      className="w-20 mx-auto text-red-500 cursor-pointer hover:scale-110" 
                      size={16} 
                      onClick={() =>  setDeleteTimeId(m.time_id)}  
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
            onClick={() => router.push(`/dashboard/medication/add?elderlyId=${selectedId}`)}
            className="flex items-center gap-2 bg-[#0D7C66] text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition"
          >
            <Plus size={16} /> เพิ่มยา
          </button>
        </div>
      </div>
      {deleteTimeId && (
        <ConfirmModal
          title="ยืนยันการลบเวลาทานยา"
          description="เวลานี้จะถูกลบออกจากตารางยา"
          onCancel={() => setDeleteTimeId(null)}
          onConfirm={handleDelete}
        />
      )}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-4 animate-scaleIn">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-4xl text-green-500">✓</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black">
              ลบเวลาทานยาเรียบร้อย
            </h3>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 bg-[#0D7C66] text-white px-6 py-2 rounded-md hover:bg-emerald-800"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
