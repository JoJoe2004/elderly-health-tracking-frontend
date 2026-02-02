"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPWForm() {
const router = useRouter();
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");

const [passwordError, setPasswordError] = useState("");
const [confirmError, setConfirmError] = useState("");
const [showSuccess, setShowSuccess] = useState(false);

const isValidPassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

const handleReset = async () => {
  let hasError = false;

  if (!password) {
    setPasswordError("กรุณากรอกรหัสผ่าน");
    hasError = true;
  } else if (!isValidPassword(password)) {
    setPasswordError("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีตัวอักษรกับตัวเลข");
    hasError = true;
  }

  if (!confirm) {
    setConfirmError("กรุณายืนยันรหัสผ่าน");
    hasError = true;
  }

  if (hasError) return;

  if (password !== confirm) {
    setConfirmError("รหัสผ่านไม่ตรงกัน");
    return;
  }

  const userId = localStorage.getItem("recoveryUserId");
  if (!userId) {
    setPasswordError("ไม่พบข้อมูลผู้ใช้");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setPasswordError(data.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
      return;
    }

    localStorage.removeItem("recoveryUserId");
    setShowSuccess(true);
  } catch {
    setPasswordError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
};

  return (

    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
      {/* Title */}
      <h1 className="text-2xl text-black font-semibold text-center mb-6">
        ตั้งค่ารหัสผ่านใหม่
      </h1>

    <div className="mx-auto max-w-sm mb-6">
      {/* New Password */}
      <div className="mb-4 relative">
        <label className="block text-black text-sm font-bold mb-1">รหัสผ่านใหม่</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          className={`
              placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2
              ${passwordError ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}
            `}
          />
          {passwordError && (
            <span className="absolute -bottom-5 right-0 text-xs text-red-600">{passwordError}</span>
          )}
      </div>

      {/* Confrim Password */}
      <div className="mb-4 relative">
        <label className="block text-black text-sm font-bold mb-1">ยืนยันรหัสผ่าน</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirm}
          onChange={(e) => { 
            setConfirm(e.target.value);
            setConfirmError("");
          }}
          className={`
              placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2
              ${confirmError ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}
            `}
          />
          {confirmError && (
            <span className="absolute -bottom-5 right-0 text-xs text-red-600">{confirmError}</span>
          )}
      </div>


      {/* Submit */}
      <button 
      onClick={handleReset}
      className="w-full mt-4 bg-[#0D7C66] text-white 
      py-2 rounded-md hover:bg-emerald-800 transition mb-6">
        ยืนยัน
      </button>


      {/* Cancel */}
      <Link href="/login">
        <button className="w-full border border-[#0D7C66]
        text-[#0D7C66] py-2 rounded-md
        hover:bg-emerald-50 transition">
          ยกเลิก
        </button>
      </Link>
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
              ลงทะเบียนสำเร็จ
            </h3>

            <p className="text-sm text-gray-500">
              คุณสามารถเข้าสู่ระบบได้ทันที
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                router.push("/login");
              }}
              className="mt-4 bg-[#0D7C66] text-white px-6 py-2 rounded-md hover:bg-emerald-800"
            >
              ไปหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
