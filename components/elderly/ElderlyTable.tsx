"use client";
import { useEffect, useState } from "react";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import ConfirmModal from "@/components/ui/ConfirmModal";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  age: number;
  phone: string;
  status: string;
};

export default function ElderlyTable() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [elderlyList, setElderlyList] = useState<Elderly[]>([]);

  useEffect(() => {
    const fetchElderly = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/elderly?userId=${userId}`
        );
        const data = await res.json();
        setElderlyList(data);
      } catch (error) {
        console.error("โหลดข้อมูลผู้สูงอายุไม่สำเร็จ", error);
      }
    };

    fetchElderly();
  }, []);
  
  const handleDelete = async (id: number) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("ลบไม่สำเร็จ");
    return;
  }

  setElderlyList(prev => prev.filter(e => e.id !== id));
  setDeleteId(null);
  setShowSuccess(true);
};


  function formatPhone(phone: string) {
    const digits = phone.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
    if (digits.length !== 10) return phone;
    return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6,10)}`;
  }

  function statusTH(status: string) {
    switch (status) {
      case "normal": return "ปกติ";
      case "watch": return "เฝ้าระวัง";
      case "risk": return "เสี่ยง";
      default: return "-";
    }
  }

  
  return (
    <div>
      <h3 className="font-semibold mb-2 text-black">
        รายชื่อผู้สูงอายุ
      </h3>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-[#0D7C66] text-white">
            <tr>
              <th className="py-2 text-center">ผู้สูงอายุ</th>
              <th className="py-2 text-center">อายุ</th>
              <th className="py-2 text-center">เบอร์ติดต่อ</th>
              <th className="py-2 text-center">สถานะคนไข้</th>
              <th className="py-2 text-center">ลบ</th>
              <th className="py-2 text-center">รายละเอียด</th>
            </tr>
          </thead>

         <tbody className="text-black">
            {elderlyList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  ยังไม่มีข้อมูลผู้สูงอายุ
                </td>
              </tr>
            ) : (
              elderlyList.map((e, index) => (
                <tr
                  key={e.id}
                  className={`text-center ${index % 2 === 0 ? "bg-white" : "bg-[#DEF4DF]"}`}
                >
                  <td className="py-2">{e.title}{e.first_name} {e.last_name}</td>
                  <td>{e.age}</td>
                  <td>{formatPhone(e.phone)}</td>
                  <td>{statusTH(e.status)}</td>
                  <td>
                    <Trash2
                      className="mx-auto text-red-500 cursor-pointer hover:scale-110"
                      size={16}
                      onClick={() => setDeleteId(e.id)}
                    />
                  </td>
                  <td>
                    <Link href={`/dashboard/elderly/info/${e.id}`}>
                      <Eye className="mx-auto text-emerald-600 cursor-pointer hover:scale-110" size={16} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ปุ่มเพิ่ม */}
      <div className="flex justify-end mt-4">
        <Link href="/dashboard/elderly/add"> 
          <button className="bg-[#0D7C66] text-white px-4 py-2 rounded-md flex items-center gap-2
                            hover:bg-emerald-800 transition-colors duration-200 "
          >
            + เพิ่มผู้สูงอายุ
          </button>
        </Link>
      </div>
      {deleteId && (
        <ConfirmModal
          title="ยืนยันการลบผู้สูงอายุ"
          description="ข้อมูลผู้สูงอายุรายนี้จะถูกลบถาวรและไม่สามารถกู้คืนได้"
          onCancel={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
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
              ลบข้อมูลผู้สูงอายุเรียบร้อย
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

