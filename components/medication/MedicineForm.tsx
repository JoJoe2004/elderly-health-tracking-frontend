"use client";
import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

type Schedule = {
  dose: string;
  type: string;
  time: string;
  method: string;
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

type MedicineFormProps = {
  elderlyId: number;
};

export default function MedicineForm({ elderlyId }: MedicineFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      name: "",
      startDate: "",
      endDate: "",
      sideEffect: "",
      schedules: [{ dose: "", type: "", time: "", method: "" }],
      image: null,
      imagePreview: "",
    },
  ]);

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    setErrorMsg(null);

    // validation เบื้องต้น
    const hasEmpty = medicines.some(m =>
      !m.name || !m.startDate || m.schedules.some(s => !s.dose || !s.type || !s.time || !s.method)
    );

    if (hasEmpty) {
      setErrorMsg("กรุณากรอกข้อมูลยาและเวลาให้ครบถ้วนก่อนบันทึก");
       // ให้หายเองใน 4 วินาที
      setTimeout(() => {
        setErrorMsg(null);
      }, 4000);

      return;
    }

    const formData = new FormData();
    formData.append("elderlyId", String(elderlyId));
    formData.append("data", JSON.stringify(medicines));

    medicines.forEach((m) => {
      if (m.image) {
        formData.append("images", m.image);
      }
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setShowSuccess(true);
    } else {
      setErrorMsg("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };


  /* ---------- Medicine ---------- */
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        startDate: "",
        endDate: "",
        sideEffect: "",
        schedules: [{ dose: "", type: "", time: "", method: "" }],
        image: null,
        imagePreview: "",
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const newArr = [...medicines];
    newArr[index] = { ...newArr[index], [field]: value };
    setMedicines(newArr);
  };

  /* ---------- Schedule ---------- */
  const addSchedule = (mIndex: number) => {
    const newArr = [...medicines];
    newArr[mIndex].schedules.push({ dose: "", type: "", time: "", method: "" });
    setMedicines(newArr);
  };

  const removeSchedule = (mIndex: number, sIndex: number) => {
    const newArr = [...medicines];
    newArr[mIndex].schedules = newArr[mIndex].schedules.filter((_, i) => i !== sIndex);
    setMedicines(newArr);
  };

  const updateSchedule = (
    mIndex: number,
    sIndex: number,
    field: keyof Schedule,
    value: string
  ) => {
    const newArr = [...medicines];
    newArr[mIndex].schedules[sIndex] = {
      ...newArr[mIndex].schedules[sIndex],
      [field]: value,
    };
    setMedicines(newArr);
  };

  const handleImageChange = (mIndex: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("ไฟล์ใหญ่เกิน 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);

    const newArr = [...medicines];
    newArr[mIndex].image = file;
    newArr[mIndex].imagePreview = preview;
    setMedicines(newArr);
  };

  return (
    <div className="space-y-6 mx-auto">
      {medicines.map((med, mIndex) => (
        <div key={mIndex} className="bg-white p-6 rounded-xl shadow space-y-6 text-black overflow-x-auto">
          {/* ข้อมูลหลักยา */}
          <div className="grid grid-cols-[180px_minmax(160px,1.5fr)_1fr_1fr] gap-4">
            <label className="row-span-2 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-xs text-gray-500
              cursor-pointer transition-all duration-200 hover:border-[#0D7C66] hover:bg-emerald-50 overflow-hidden relative">
              {med.imagePreview ? (
                <Image src={med.imagePreview} alt="preview" fill className="object-cover" />
              ) : (
                <>
                  <span className="text-lg">⬆</span>
                  <span>เพิ่มรูปภาพ</span>
                  <span className="mt-1">สูงสุด 5 MB</span>
                </>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageChange(mIndex, file);
                }}
              />
            </label>

            <div>
              <label>ชื่อยา</label>
              <input
                className="input w-full min-w-0"
                value={med.name}
                onChange={(e) => updateMedicine(mIndex, "name", e.target.value)}
              />
            </div>

            <div>
              <label>วันที่เริ่มการใช้ยา</label>
              <input
                type="date"
                className="input w-full"
                value={med.startDate}
                onChange={(e) => updateMedicine(mIndex, "startDate", e.target.value)}
              />
            </div>

            <div>
              <label>วันที่สิ้นสุดการใช้ยา</label>
              <input
                type="date"
                className="input w-full"
                value={med.endDate}
                onChange={(e) => updateMedicine(mIndex, "endDate", e.target.value)}
              />
            </div>

            <div className="col-span-3">
              <label>ผลข้างเคียง</label>
              <textarea
                className="input w-full h-24"
                value={med.sideEffect}
                onChange={(e) => updateMedicine(mIndex, "sideEffect", e.target.value)}
              />
            </div>
          </div>

          {/* ตารางเวลา */}
          {med.schedules.map((row, sIndex) => (
            <div key={sIndex} className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_80px] gap-4 items-end">
              <div>
                <label>ปริมาณ</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="input w-full text-center"
                  value={row.dose}
                  onChange={(e) => updateSchedule(mIndex, sIndex, "dose", e.target.value)}
                />
              </div>

              <div>
                <label>ประเภทยา</label>
                <select
                  className="input w-full text-center"
                  value={row.type}
                  onChange={(e) => updateSchedule(mIndex, sIndex, "type", e.target.value)}
                >
                  <option value="">เลือก</option>
                  <option value="tablet">เม็ด</option>
                  <option value="capsule">แคปซูล</option>
                  <option value="liquid">น้ำ</option>
                  <option value="spoon">ช้อน</option>
                </select>
              </div>

              <div>
                <label>เวลา</label>
                <input
                  type="time"
                  className="input w-full"
                  value={row.time}
                  onChange={(e) => updateSchedule(mIndex, sIndex, "time", e.target.value)}
                />
              </div>

              <div>
                <label>วิธีทาน</label>
                <select
                  className="input w-full text-center"
                  value={row.method}
                  onChange={(e) => updateSchedule(mIndex, sIndex, "method", e.target.value)}
                >
                  <option value="">เลือก</option>
                  <option value="before">ก่อนอาหาร</option>
                  <option value="after">หลังอาหาร</option>
                  <option value="with_food">พร้อมอาหาร</option>
                  <option value="bedtime">ก่อนนอน</option>
                </select>
              </div>

              <div className="flex gap-4">
                {med.schedules.length > 1 && (
                  <button onClick={() => removeSchedule(mIndex, sIndex)} className="text-red-500 hover:scale-110">
                    <Trash2 size={25} />
                  </button>
                )}
                {sIndex === med.schedules.length - 1 && (
                  <button onClick={() => addSchedule(mIndex)} className="text-[#0D7C66] hover:scale-110">
                    <CirclePlus size={25} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-4">
            {medicines.length > 1 && (
              <button
                onClick={() => removeMedicine(mIndex)}
                className="w-32 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
              >
                <Minus size={16} /> ลบยา
              </button>
            )}

            {mIndex === medicines.length - 1 && (
              <button
                onClick={addMedicine}
                className="w-32 flex items-center justify-center gap-2 border border-[#0D7C66] text-[#0D7C66] px-4 py-1 rounded-md hover:bg-emerald-50"
              >
                <Plus size={16} /> เพิ่มยา
              </button>
            )}
          </div>
        </div>
      ))}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
          {errorMsg}
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#0D7C66] text-white px-6 py-2 rounded-md hover:bg-emerald-800"
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
