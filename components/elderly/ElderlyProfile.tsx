"use client";
import { useEffect, useState } from "react";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  birth_date: string;
  phone: string;
  emergency_phone: string;
  status: string;
};

type Props = {
  elderlyId: string;
};

export default function ElderlyProfile({ elderlyId }: Props) {
  const [data, setData] = useState<Elderly | null>(null);

  useEffect(() => {
    const fetchElderly = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}`);
      const result = await res.json();
      setData(result);
    };
    fetchElderly();
  }, [elderlyId]);

  if (!data) return <div className="text-black">กำลังโหลด...</div>;

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return phone;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const genderLabel = (gender: string) => {
    if (gender === "male") return "ชาย";
    if (gender === "female") return "หญิง";
    return "-";
  };

  function formatThaiDate(dateStr: string) {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
      "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
      "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = months[d.getMonth()];
    const year = d.getFullYear() + 543; // พ.ศ.

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="space-y-4 text-black">
      <h3 className="font-semibold mb-2">ข้อมูลส่วนตัว</h3>
      <div className="bg-white rounded-xl p-2 leading-7 space-y-1 text-base">
        <p>ชื่อ  :  {data.title}{data.first_name} {data.last_name}</p>
        <p>เพศ  :  {genderLabel(data.gender)}</p>
        <p>อายุ  :  {data.age} ปี</p>
        <p>วัน/เดือน/ปีที่เกิด  :  {formatThaiDate(data.birth_date)}</p>
        <p>เบอร์ติดต่อ  :  {formatPhone(data.phone)}</p>
        <p>เบอร์ติดต่อฉุกเฉิน  :  {formatPhone(data.emergency_phone)}</p>
      </div>
    </div>
  );
}
