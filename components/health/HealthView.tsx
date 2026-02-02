"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type HealthRecord = {
  id: number;
  elderly_name: string;
  weight: string;
  blood_pressure: string;
  oxygen: string;
  pulse: string;
  temperature: string;
  blood_sugar: string;
  abnormal_symptom: string;
  note: string;
};

export default function HealthView() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;

  const [data, setData] = useState<HealthRecord | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-records/${recordId}`)
      .then(res => res.json())
      .then(result => setData(result));
  }, [recordId]);

  if (!data) return <div>กำลังโหลด...</div>;

  return (
    <div className="space-y-2 text-black">
      <h2 className="text-lg font-semibold">รายละเอียดบันทึกสุขภาพ</h2>

      <div className="rounded">
        <p className="font-medium">ผู้สูงอายุ: {data.elderly_name}</p>
      </div>

      <hr className="my-4 border-[#D9D9D9]" />

      {/* Vital Signs */}
      <div className="rounded">
        <h3 className="font-semibold mb-3">บันทึกสุขภาพประจำวัน</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>น้ำหนัก (กิโลกรัม)</label>
            <input className="input w-full" value={data.weight} disabled />
          </div>

          <div>
            <label>ความดันโลหิต (mmHg)</label>
            <input className="input w-full" value={data.blood_pressure} disabled />
          </div>

          <div>
            <label>ค่าออกซิเจน (%)</label>
            <input className="input w-full" value={data.oxygen || ""} disabled />
          </div>

          <div>
            <label>ชีพจร (bpm)</label>
            <input className="input w-full" value={data.pulse} disabled />
          </div>

          <div>
            <label>อุณหภูมิร่างกาย (°C)</label>
            <input className="input w-full" value={data.temperature || ""} disabled />
          </div>

          <div>
            <label>น้ำตาลในเลือด (mg/dL)</label>
            <input className="input w-full" value={data.blood_sugar || ""} disabled />
          </div>
        </div>
      </div>

      <hr className="my-4 border-[#D9D9D9]" />

      {/* Abnormal Symptom */}
      <div className="rounded">
        <h3 className="font-semibold mb-1">อาการผิดปกติ</h3>
        <textarea
          className="input w-full h-32"
          value={data.abnormal_symptom || ""}
          disabled
        />
      </div>

      <hr className="my-4 border-[#D9D9D9]" />

      {/* Note */}
      <div className="rounded">
        <h3 className="font-semibold mb-2">รายละเอียดเพิ่มเติม</h3>
        <textarea
          className="input w-full h-32"
          value={data.note || ""}
          disabled
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded bg-white text-gray-700 hover:bg-gray-100"
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  );
}
