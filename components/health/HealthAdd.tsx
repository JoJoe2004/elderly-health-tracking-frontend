"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
};

export default function HealthAdd() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const elderlyId = Number(searchParams.get("elderlyId"));

  const [elderly, setElderly] = useState<Elderly | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    weight: "",
    blood_pressure: "",
    oxygen: "",
    pulse: "",
    temperature: "",
    blood_sugar: "",
    abnormal_symptom: "",
    note: "",
  });

  useEffect(() => {
    if (!elderlyId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}`)
      .then(res => res.json())
      .then(data => setElderly(data));
  }, [elderlyId]);

  const handleSubmit = async () => {
    const hasEmpty =
      !form.weight ||
      !form.blood_pressure ||
      !form.pulse;

    if (hasEmpty) {
      setErrorMsg("กรุณากรอกข้อมูลให้ครบถ้วน");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;

    if (!bpRegex.test(form.blood_pressure)) {
      setErrorMsg("กรุณากรอกความดันในรูปแบบ 120/80");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const [systolicStr, diastolicStr] = form.blood_pressure.split("/");
    const systolic = Number(systolicStr);
    const diastolic = Number(diastolicStr);

    if (isNaN(systolic) || isNaN(diastolic)) {
      setErrorMsg("ค่าความดันไม่ถูกต้อง");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      elderly_id: elderlyId,
      record_date: today,
      weight: form.weight,
      blood_pressure: form.blood_pressure, // 👈 ส่ง "140/80"
      pulse: form.pulse,
      oxygen: form.oxygen || null,
      temperature: form.temperature || null,
      blood_sugar: form.blood_sugar || null,
      abnormal_symptom: form.abnormal_symptom || null,
      note: form.note || null,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health-records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowSuccess(true);
    } else {
      alert("บันทึกไม่สำเร็จ");
    }
  };

  return (
    <div className="space-y-2 text-black">
      <h3 className="text-lg font-semibold">บันทึกสุขภาพประจำวัน</h3>

      {elderly && (
        <div className="rounded">
          <p className="font-medium">
            ผู้สูงอายุ: {elderly.title}{elderly.first_name} {elderly.last_name}
          </p>
        </div>
      )}
      
      <hr className="my-4 border-[#D9D9D9]" />


      {/* Vital Signs */}
      <div className="rounded">
        <h3 className="text-lg font-semibold mb-3">บันทึกสุขภาพประจำวัน</h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>น้ำหนัก (กิโลกรัม)</label>
            <input className="input w-full"
              type="number"
              placeholder="kg"
              value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })}
            />
          </div>

          <div>
            <label>ความดันโลหิต (mmHg)</label>
            <input className="input w-full"
              type="text"
              pattern="\d{2,3}/\d{2,3}"
              placeholder="120/80"
              value={form.blood_pressure}
              onChange={e => setForm({ ...form, blood_pressure: e.target.value })}
            />
          </div>

          <div>
            <label>ค่าออกซิเจน (%)</label>
            <input className="input w-full"
              type="number"
              placeholder="%"
              value={form.oxygen}
              onChange={e => setForm({ ...form, oxygen: e.target.value })}
            />
          </div>

          <div>
            <label>ชีพจร (bpm)</label>
            <input className="input w-full"
              type="number"
              placeholder="bpm"
              value={form.pulse}
              onChange={e => setForm({ ...form, pulse: e.target.value })}
            />
          </div>

          <div>
            <label>อุณหภูมิร่างกาย (°C)</label>
            <input className="input w-full"
              type="number"
              step="0.1"
              placeholder="°C"
              value={form.temperature}
              onChange={e => setForm({ ...form, temperature: e.target.value })}
            />
          </div>

          <div>
            <label>น้ำตาลในเลือด (mg/dL)</label>
            <input className="input w-full"
              type="number"
              placeholder="mg/dL"
              value={form.blood_sugar}
              onChange={e => setForm({ ...form, blood_sugar: e.target.value })}
            />
          </div>
        </div>
      </div>
      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-2 rounded">
          {errorMsg}
        </div>
      )}
      <hr className="my-4 border-[#D9D9D9]" />
      {/* Abnormal Symptom */}
      <div className="rounded">
        <h3 className="font-semibold mb-1">อาการผิดปกติ</h3>
        <p className="text-sm mb-2">
          บันทึกลักษณะอาการ + เวลาที่เกิด เช่น &quot;มีอาการเวียนหัวตอนลุกขึ้นยืน เวลา 08:30 น.&quot; 
          หรือ &quot;แน่นหน้าอกหลังจากเดินขึ้นบันได&quot;
        </p>
        <textarea
          className="input w-full h-32"
          value={form.abnormal_symptom}
          onChange={e => setForm({ ...form, abnormal_symptom: e.target.value })}
        />
      </div>
      <hr className="my-4 border-[#D9D9D9]" />
      {/* Note */}
      <div className="rounded ">
        <h3 className="font-semibold mb-2">รายละเอียดเพิ่มเติม</h3>
        <textarea
          className="input w-full h-32"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="border px-6 py-2 rounded-md text-gray-700 bg-white border-gray-300 hover:bg-gray-100"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#0D7C66] hover:bg-emerald-800 transition text-white rounded-md"
        >
          บันทึก
        </button>
      </div>
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center space-y-4 animate-scaleIn">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                <span className="text-4xl text-green-500">✓</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-black">บันทึกรายการเรียบร้อย</h3>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push(`/dashboard/health?elderlyId=${elderlyId}`);
              }}
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
