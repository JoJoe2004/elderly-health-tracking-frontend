"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

const isValidPassword = (password: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

const handleRegister = async () => {
  let hasError = false;

  if (!email) {
    setEmailError("กรุณากรอกอีเมล");
    hasError = true;
  }

  if (!password) {
    setPasswordError("กรุณากรอกรหัสผ่าน");
    hasError = true;  
  }
  if (password && !isValidPassword(password)) {
    setPasswordError("รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีตัวอักษรกับตัวเลข");
    hasError = true;
  }

  if (!confirmPassword) {
    setConfirmPasswordError("กรุณายืนยันรหัสผ่าน");
    hasError = true;
  }

  if (hasError) return;

  if (password !== confirmPassword) {
    setConfirmPasswordError("รหัสผ่านไม่ตรงกัน");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      setConfirmPasswordError("ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setShowSuccess(true);
  } catch (error) {
    console.error("Register error:", error);
    setConfirmPasswordError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }

};
  return (
    
    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-center text-black mb-6">
        ลงทะเบียน
      </h1>

    <div className="mx-auto max-w-sm mb-6">
      {/* Email */}
      <div className="mb-4 relative">
        <label className="block text-sm font-bold text-black mb-1">อีเมล</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          className={`placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2
              ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}`}
        />
        {emailError && (
          <span className="absolute -bottom-5 right-0 text-xs text-red-600">{emailError}</span>
        )}
      </div>

      {/* Password */}
      <div className="mb-4 relative">
        <label className="block text-sm font-bold text-black mb-1">รหัสผ่าน</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
            setConfirmPasswordError("");
          }}
          className={`placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2
              ${passwordError  ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}`}
        />
         {passwordError && (
          <span className="absolute -bottom-5 right-0 text-xs text-red-600">{passwordError}</span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-6 relative">
        <label className="block text-sm font-bold text-black mb-1">
          ยืนยันรหัสผ่าน
        </label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmPasswordError("");
          }}
          className={`placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2
              ${confirmPasswordError  ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}`}
        />
         {confirmPasswordError && (
          <span className="absolute -bottom-5 right-0 text-xs text-red-600">{confirmPasswordError}</span>
        )}
      </div>

      {/* Register Button */}
      <button
        type="button"
        onClick={handleRegister}
        className="w-full bg-[#0D7C66] text-white py-2 rounded-md hover:bg-emerald-800 transition cursor-pointer mt-4"
      >
        ลงทะเบียน
      </button>

      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-500">หรือ</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Login Link */}
      <Link href="/login">
        <button className="w-full border border-[#0D7C66]
        text-[#0D7C66] py-2 rounded-md hover:bg-emerald-50 transition cursor-pointer">
          เข้าสู่ระบบ
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
