"use client";
import { useEffect, useState } from "react";

type Props = {
  elderlyId: string;
};

type Status = "normal" | "watch" | "risk";

export default function StatusBox({ elderlyId }: Props) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}`);
      const data = await res.json();
      setStatus(data.status as Status);   // ต้องได้ normal | watch | risk
      setLoading(false);
    };
    fetchStatus();
  }, [elderlyId]);

  const handleChange = async (newStatus: Status) => {
    setStatus(newStatus);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  if (loading) return <div className="text-gray-400">กำลังโหลดสถานะ...</div>;

  return (
    <div className="text-black">
      <h3 className="font-semibold mb-2">สถานะคนไข้</h3>

      <select
        className="input w-full"
        value={status!}
        onChange={(e) => handleChange(e.target.value as Status)}
      >
        <option value="normal">ปกติ</option>
        <option value="watch">เฝ้าระวัง</option>
        <option value="risk">เสี่ยง</option>
      </select>
    </div>
  );
}
