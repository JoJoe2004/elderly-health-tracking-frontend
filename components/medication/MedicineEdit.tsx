"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

/* ---------- Types ---------- */
type ApiMedicineTime = {
  id: number;
  dose: string;
  dose_type: string;
  time: string;
  method: string;
  is_notify: number;
};

type ApiMedicine = {
  medicine_name: string;
  start_date: string;
  end_date: string;
  side_effect: string;
  image: string | null;
  times: ApiMedicineTime[];
};

type Schedule = {
  id?: number;
  dose: string;
  dose_type: string;
  time: string;
  method: string;
  is_notify: boolean;
};

type Medicine = {
  name: string;
  startDate: string;
  endDate: string;
  sideEffect: string;
  schedules: Schedule[];
  image?: File | null;
  imagePreview?: string;
};

type MedicineEditProps = {
  medicineId: number;
  elderlyId?: number;
};

export default function MedicineEdit({ medicineId, elderlyId }: MedicineEditProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [medicine, setMedicine] = useState<Medicine>({
    name: "",
    startDate: "",
    endDate: "",
    sideEffect: "",
    schedules: [{ dose: "", dose_type: "", time: "", method: "", is_notify: true }],
    image: null,
    imagePreview: "",
  });

  const toDateInput = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset() * 60000;
    const localISO = new Date(d.getTime() - offset).toISOString();
    return localISO.slice(0, 10); // yyyy-mm-dd สำหรับ input type="date"
  };


  /* ---------- Load data for edit ---------- */
  useEffect(() => {
    const fetchMedicine = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/${medicineId}`);
      const data: ApiMedicine = await res.json();

      setMedicine({
        name: data.medicine_name,
        startDate: toDateInput(data.start_date),
        endDate: toDateInput(data.end_date),
        sideEffect: data.side_effect,
        image: null,
        imagePreview: data.image || "",
        schedules: data.times.map((t) => ({
          id: t.id,
          dose: t.dose,
          dose_type: t.dose_type,
          time: t.time,
          method: t.method,
          is_notify: t.is_notify === 1,
        })),
      });
    };

    fetchMedicine();
  }, [medicineId]);

  /* ---------- Submit (UPDATE) ---------- */
  const handleSubmit = async () => {
    const hasEmpty =
      !medicine.name ||
      !medicine.startDate ||
      medicine.schedules.some(
        (s) => !s.dose || !s.dose_type || !s.time || !s.method
      );

    if (hasEmpty) {
      setErrorMsg("กรุณากรอกข้อมูลยาและเวลาให้ครบถ้วนก่อนบันทึก");
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    const payload = {
      medicine_name: medicine.name,
      start_date: medicine.startDate,
      end_date: medicine.endDate,
      side_effect: medicine.sideEffect,
      times: medicine.schedules,
      image: medicine.imagePreview || null, 
    };


    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    if (medicine.image) {
      formData.append("image", medicine.image);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/${medicineId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      setShowSuccess(true);
    } else {
      alert("บันทึกไม่สำเร็จ");
    }
  };

  /* ---------- Schedule ---------- */
  const addSchedule = () => {
    setMedicine({
      ...medicine,
      schedules: [
        ...medicine.schedules,
        { dose: "", dose_type: "", time: "", method: "", is_notify: true },
      ],
    });
  };

  const removeSchedule = (index: number) => {
    setMedicine({
      ...medicine,
      schedules: medicine.schedules.filter((_, i) => i !== index),
    });
  };

  const updateSchedule = (
    index: number,
    field: keyof Schedule,
    value: string | boolean
  ) => {
    const newSchedules = [...medicine.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setMedicine({ ...medicine, schedules: newSchedules });
  };

  const handleImageChange = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("ไฟล์ใหญ่เกิน 5MB");
      return;
    }

    setMedicine({
      ...medicine,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6 mx-auto">
      <div className="bg-white p-6 rounded-xl shadow space-y-6 text-black overflow-x-auto">
        {/* ข้อมูลหลักยา */}
        <div className="grid grid-cols-[160px_minmax(160px,1.5fr)_1fr_1fr] gap-4">
          <label className="row-span-2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-xs text-gray-500
              cursor-pointer transition-all duration-200 hover:border-[#0D7C66] hover:bg-emerald-50 overflow-hidden relative">
            {medicine.imagePreview ? (
              <Image
                src={medicine.imagePreview}
                alt="preview"
                fill
                unoptimized
                className="object-cover"
                sizes="160px"
              />
            ) : (
              <>
                <span className="text-lg">⬆</span>
                <span>เพิ่มรูปภาพ</span>
                <span>สูงสุด 5 MB</span>
              </>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
            />
          </label>

          <div>
            <label>ชื่อยา</label>
            <input
              className="input w-full min-w-0"
              value={medicine.name}
              onChange={(e) => setMedicine({ ...medicine, name: e.target.value })}
            />
          </div>

          <div>
            <label>วันที่เริ่ม</label>
            <input
              type="date"
              className="input w-full"
              value={medicine.startDate}
              onChange={(e) => setMedicine({ ...medicine, startDate: e.target.value })}
            />
          </div>

          <div>
            <label>วันที่สิ้นสุด</label>
            <input
              type="date"
              className="input w-full"
              value={medicine.endDate}
              onChange={(e) => setMedicine({ ...medicine, endDate: e.target.value })}
            />
          </div>

          <div className="col-span-3">
            <label>ผลข้างเคียง</label>
            <textarea
              className="input w-full h-24"
              value={medicine.sideEffect || ""}
              onChange={(e) => setMedicine({ ...medicine, sideEffect: e.target.value })}
            />
          </div>
        </div>

        {/* ตารางเวลา */}
        {medicine.schedules.map((row, sIndex) => (
          <div key={sIndex} className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_80px] gap-4 items-end">
            <input
              type="number"
              className="input text-center"
              value={row.dose}
              onChange={(e) => updateSchedule(sIndex, "dose", e.target.value)}
            />

            <select
              className="input text-center"
              value={row.dose_type}
              onChange={(e) => updateSchedule(sIndex, "dose_type", e.target.value)}
            >
              <option value="">เลือก</option>
              <option value="tablet">เม็ด</option>
              <option value="capsule">แคปซูล</option>
              <option value="liquid">น้ำ</option>
              <option value="spoon">ช้อน</option>
            </select>

            <input
              type="time"
              className="input"
              value={row.time}
              onChange={(e) => updateSchedule(sIndex, "time", e.target.value)}
            />

            <select
              className="input text-center"
              value={row.method}
              onChange={(e) => updateSchedule(sIndex, "method", e.target.value)}
            >
              <option value="">เลือก</option>
              <option value="before">ก่อนอาหาร</option>
              <option value="after">หลังอาหาร</option>
              <option value="with_food">พร้อมอาหาร</option>
              <option value="bedtime">ก่อนนอน</option>
            </select>

            <div className="flex gap-3">
              {medicine.schedules.length > 1 && (
                <button onClick={() => removeSchedule(sIndex)} className="text-red-500">
                  <Trash2 />
                </button>
              )}
              {sIndex === medicine.schedules.length - 1 && (
                <button onClick={addSchedule} className="text-green-600">
                  <CirclePlus />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
          {errorMsg}
        </div>
      )}
      <div className="flex justify-end">
        <button onClick={handleSubmit} className="bg-[#0D7C66] text-white px-6 py-2 rounded">
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

            <h3 className="text-xl font-semibold text-black">บันทึกการแก้ไขเรียบร้อย</h3>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push(`/dashboard/medication?elderlyId=${elderlyId}`);
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
