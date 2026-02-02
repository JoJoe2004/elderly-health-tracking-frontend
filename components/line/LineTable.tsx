"use client";
import { useEffect, useState } from "react";
import { Link, Unlink } from "lucide-react";
import ConfirmModal from "../ui/ConfirmModal";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  line_user_id: string | null;
};

export default function LineTable() {
  const [elderlyList, setElderlyList] = useState<Elderly[]>([]);
  const [unlinkId, setUnlinkId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly?userId=${userId}`)
      .then(res => res.json())
      .then(data => setElderlyList(data));
  }, []);

  const connectLine = (elderlyId: number) => {
    if (typeof window !== "undefined") {
      window.location.assign(
        `${process.env.NEXT_PUBLIC_API_URL}/api/line/login?elderlyId=${elderlyId}`
      );
    }
  };


  const handleUnlink = async (elderlyId: number) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/line/users/${elderlyId}/unlink-line`,
      { method: "PATCH" }
    );

    if (res.ok) {
      setElderlyList(prev =>
        prev.map(e =>
          e.id === elderlyId ? { ...e, line_user_id: null } : e
        )
      );
      setUnlinkId(null);
      setShowSuccess(true);
    }
  };


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly?userId=${userId}`)
      .then(res => res.json())
      .then(data => setElderlyList(data));
      
  }, []);
  
  return (
    <div className="space-y-2 text-black">
      <h3 className="font-semibold">การเชื่อมต่อ LINE กับผู้สูงอายุ</h3>

      <div className="overflow-hidden rounded-lg">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-[#0D7C66] text-white">
            <tr>
              <th className="w-1/2 py-2 text-center">ชื่อผู้สูงอายุ</th>
              <th className="w-1/4 text-center">สถานะ</th>
              <th className="w-1/4 text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {elderlyList.length === 0 ? (
              <tr>
                <td colSpan={3} className="bg-white text-center py-4 text-gray-500">
                  ไม่พบข้อมูลผู้สูงอายุ
                </td>
              </tr>
            ) : (
              elderlyList.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? "bg-white" : "bg-[#DEF4DF]"}>
                  <td className="text-center py-2">
                    {e.title}{e.first_name} {e.last_name}
                  </td>
                  <td className="text-center">
                    {e.line_user_id ? (
                      <span className="text-green-600 font-medium">เชื่อมแล้ว</span>
                    ) : (
                      <span className="text-gray-500">ยังไม่เชื่อม</span>
                    )}
                  </td>
                  <td className="text-center">
                    {e.line_user_id ? (
                      <button
                        onClick={() => setUnlinkId(e.id)}
                        className="text-red-500 hover:scale-110 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Unlink size={16} /> ยกเลิก
                      </button>
                    ) : (
                      <button
                        onClick={() => connectLine(e.id)}
                        className="text-emerald-600 hover:scale-110 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Link size={16} /> เชื่อม LINE
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {unlinkId && (
        <ConfirmModal
          title="ยืนยันการยกเลิกการเชื่อมต่อ LINE"
          description="จะไม่สามารถส่งการแจ้งเตือนไปยัง LINE ของผู้สูงอายุรายนี้ได้"
          onCancel={() => setUnlinkId(null)}
          onConfirm={() => handleUnlink(unlinkId)}
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
              ยกเลิกการเชื่อมต่อ LINE เรียบร้อย
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
