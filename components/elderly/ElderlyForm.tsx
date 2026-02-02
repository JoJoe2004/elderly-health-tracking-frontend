"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type Props = {
  mode: "add" | "edit";
  elderlyId?: string;
};
type DiseaseRow = {
  id: number;
  disease_name: string;
};
type AllergyRow = {
  id: number;
  allergy_name: string;
};

export default function ElderlyForm({ mode, elderlyId }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [diseases, setDiseases] = useState([""]);
  const [allergies, setAllergies] = useState([""]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
  title: "",
  firstName: "",
  lastName: "",
  gender: "",
  age: "",
  birthDate: "",
  phone: "",
  emergencyPhone: "",
  });

const handleSubmit = async () => {
  const hasEmpty =
    !form.title.trim() ||
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.gender ||
    !form.birthDate ||
    !form.phone.trim() ||
    !form.emergencyPhone.trim();

  if (hasEmpty) {
    setErrorMsg("กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วนก่อนบันทึก");
    setTimeout(() => setErrorMsg(null), 4000);
    return;
  }

  const userId = localStorage.getItem("userId");

  const url =
    mode === "add"
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/elderly/add`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}`;

  const method = mode === "add" ? "POST" : "PUT";

  const confirmedDiseases = diseases.slice(0, -1).filter(d => d.trim() !== "");
  const confirmedAllergies = allergies.slice(0, -1).filter(a => a.trim() !== "");

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      ...form,
      diseases: confirmedDiseases,
      allergies: confirmedAllergies,
    }),
  });

  const data = await res.json();
    if (res.ok) {
      setShowSuccess(true);
    } else {
      alert(data.message || "บันทึกไม่สำเร็จ");
    }
};

  // ถ้าเป็น edit ให้โหลดข้อมูลเดิมมากรอก
  useEffect(() => {
  if (mode === "edit" && elderlyId) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title,
          firstName: data.first_name,
          lastName: data.last_name,
          gender: data.gender,
          age: data.age,
          birthDate: data.birth_date,
          phone: data.phone,
          emergencyPhone: data.emergency_phone,
        });
      });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}/diseases`)
      .then(res => res.json())
      .then((rows: DiseaseRow[]) => setDiseases([...rows.map(r => r.disease_name), ""]));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}/allergies`)
      .then(res => res.json())
      .then((rows: AllergyRow[]) =>setAllergies([...rows.map(r => r.allergy_name), ""]));
  }
}, [mode, elderlyId]);

  const calculateAge = (dateString: string) => {
    if (!dateString) return "";
    const today = new Date();
    const birth = new Date(dateString);

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return String(age);
  };

  return (
    <div className="p-1 rounded-xl text-black">
      <h2 className="text-lg font-semibold mb-4">ข้อมูลส่วนตัว*</h2>

      {/* ข้อมูลส่วนตัว */}
      <div className="space-y-2">
  <div className="flex gap-6">
    <div className="flex flex-col w-25">
      <label className="text-sm mb-1">คำนำหน้า</label>
      <input 
        className="input" 
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
    </div>

    <div className="flex flex-col w-80">
      <label className="text-sm mb-1">ชื่อ</label>
      <input 
        className="input" 
        value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />
    </div>

    <div className="flex flex-col w-80">
      <label className="text-sm mb-1">นามสกุล</label>
      <input
        className="input" 
        value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
    </div>
  </div>

  <div className="flex gap-6">
    <div className="flex flex-col w-25">
      <label className="text-sm mb-1">เพศ</label>
      <select 
        className="input"
        value={form.gender}
        onChange={(e) => {
          const gender = e.target.value;
          let title = form.title;

          if (gender === "male") title = "นาย";
          if (gender === "female") title = "นาง";

          setForm({ ...form, gender, title });
        }}
      >
        <option value="">เลือกเพศ</option>
        <option value="male">ชาย</option>
        <option value="female">หญิง</option>
      </select>
    </div>

    <div className="flex flex-col w-20">
      <label className="text-sm mb-1">อายุ</label>
      <input 
        className="input" 
        value={form.age}
        readOnly
      />
    </div>

    <div className="flex flex-col w-54">
      <label className="text-sm mb-1">วัน/เดือน/ปี เกิด</label>
      <input 
        type="date" 
        className="input" 
        value={form.birthDate}
         onChange={(e) => {
          const birthDate = e.target.value;
          const age = calculateAge(birthDate);
          setForm({ ...form, birthDate, age });
        }}
      />
    </div>
  </div>

  <div className="flex gap-6">
    <div className="flex flex-col w-50">
      <label className="text-sm mb-1">เบอร์ติดต่อ</label>
      <input 
        className="input" 
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
    </div>

    <div className="flex flex-col w-50">
      <label className="text-sm mb-1">เบอร์ติดต่อฉุกเฉิน</label>
      <input 
        className="input" 
        value={form.emergencyPhone}
        onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
      />
    </div>
  </div>
</div>
{errorMsg && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm mt-3">
    {errorMsg}
  </div>
)}
      <hr className="my-4 border-[#0D7C66]" />

      <DynamicSection title="ข้อมูลโรคประจำตัว" values={diseases} setValues={setDiseases} />

      <hr className="my-4 border-[#0D7C66]" />

      <DynamicSection title="ประวัติแพ้ยา" values={allergies} setValues={setAllergies} />



      {/* ปุ่ม */}
      <div className="flex justify-end gap-3 mt-6">
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
        >
          ยกเลิก
        </button>

        <button 
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#0D7C66] hover:bg-emerald-800 transition text-white rounded-md">
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

            <h3 className="text-xl font-semibold text-black">
              {mode === "add" ? "บันทึกรายการเรียบร้อย" : "บันทึกการแก้ไขเรียบร้อย"}
            </h3>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push("/dashboard/elderly"); // หรือหน้าตารางผู้สูงอายุ
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

function DynamicSection({
  title,
  values, 
  setValues,
}: {
  title: string;
  values: string[];
  setValues: (v: string[]) => void;
}) {
  const handleAdd = () => {
    const last = values[values.length - 1];
    if (last.trim() === "") return; // ห้ามเพิ่มถ้ายังไม่กรอก
    setValues([...values, ""]);
  };

  const handleRemove = (index: number) => {
    if (index === values.length - 1) return; // กันลบช่องพิมพ์
    const newArr = values.filter((_, i) => i !== index);
    setValues(newArr.length === 0 ? [""] : newArr);
  };
  
  return (
    <div className="mb-6">
      <h3 className="font-medium mb-3 text-gray-800">{title}</h3>

      {values.map((value, index) => {
        const isLast = index === values.length - 1;
        const isFilled = value.trim() !== "";

        return (
          <div key={index} className="flex items-center gap-3 mb-2">
            <input
              className={`input w-96 ${
                !isLast ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              value={value}
              readOnly={!isLast}
              onChange={(e) => {
                if (!isLast) return;
                const newArr = [...values];
                newArr[index] = e.target.value;
                setValues(newArr);
              }}
            />

            {/* ปุ่มลบ (เฉพาะช่องที่ล็อกแล้ว) */}
            {!isLast && (
              <button
                onClick={() => handleRemove(index)}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition w-24"
              >
               - ลบข้อมูล
              </button>
            )}

            {/* ปุ่มเพิ่ม (เฉพาะช่องสุดท้าย) */}
            {isLast && (
              <button
                onClick={handleAdd}
                disabled={!isFilled}
                className={`px-3 py-1 text-sm rounded transition ${
                  isFilled
                    ? "border border-[#0D7C66] text-[#0D7C66] hover:bg-emerald-100 w-24"
                    : "border border-gray-300 text-gray-400 cursor-not-allowed w-24"
                }`}
              >
                + เพิ่มข้อมูล
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}



