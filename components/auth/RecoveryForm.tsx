"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RecoveryForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  
  const handleRecovery = async () => {
    if (!email) {
      setEmailError("กรุณากรอกอีเมล");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/recovery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setFormMessage(data.message || "ไม่พบอีเมลในระบบ");
        return;
      }

      localStorage.setItem("recoveryUserId", data.userId);
      localStorage.setItem("recoveryEmail", email);

      router.push("/otp");
    } catch {
      setFormMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
      <h1 className="text-2xl text-black font-semibold text-center mb-6">
        การกู้คืนบัญชี
      </h1>

      <div className="mx-auto max-w-sm mb-6">
        {/* form message */}
        {formMessage && (
          <div className="mb-4 px-3 py-2 text-sm text-center rounded-md
            bg-red-50 border border-red-400 text-red-700">
            {formMessage}
          </div>
        )}

        {/* Email */}
        <div className="mb-4 relative">
          <label className="block text-black text-sm font-bold mb-1">
            อีเมล
          </label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setFormMessage("");
            }}
            className={`placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md
              focus:outline-none focus:ring-2
              ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}`}
          />
          {emailError && (
            <span className="absolute -bottom-5 right-0 text-xs text-red-600">
              {emailError}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleRecovery}
          className="w-full mt-4 mb-6 bg-[#0D7C66] text-white
          py-2 rounded-md hover:bg-emerald-800 transition cursor-pointer"
        >
          ดำเนินการต่อ
        </button>

        {/* Cancel */}
        <Link href="/login">
          <button className="w-full border border-[#0D7C66]
            text-[#0D7C66] py-2 rounded-md hover:bg-emerald-50 transition cursor-pointer">
            ยกเลิก
          </button>
        </Link>
      </div>
    </div>
  );
}
