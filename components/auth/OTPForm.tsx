"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function OTPForm() {
  const length = 6;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState(0);

  const [formMessage, setFormMessage] = useState("");
  const [otpError, setOtpError] = useState(false);

  useEffect(() => {
    if (!formMessage) return;

    const timer = setTimeout(() => {
      setFormMessage("");
      setOtpError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [formMessage]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

const handleSubmit = async () => {
  const otpValue = otp.join("");
  const userId = localStorage.getItem("recoveryUserId");

  if (!userId) {
    setFormMessage("ไม่พบข้อมูลผู้ใช้");
    return;
  }

  if (otpValue.length !== 6) {
    setFormMessage("กรุณากรอก OTP ให้ครบ 6 หลัก");
    setOtpError(true);
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          otp: otpValue
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setFormMessage(data.message || "OTP ไม่ถูกต้อง");
      setOtpError(true);
      return;
    }

    window.location.href = "/resetpassword";
  } catch {
    setFormMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
  }
};

// Resend OTP
const handleResendOTP = async () => {
  if (cooldown > 0) return;

  const email = localStorage.getItem("recoveryEmail");
  if (!email) {
    setFormMessage("ไม่พบอีเมล");
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

    if (data.userId) {
      localStorage.setItem("recoveryUserId", data.userId.toString());
    }

    setOtp(Array(length).fill(""));
    inputsRef.current[0]?.focus();
    
    if (!res.ok) {
      setFormMessage(data.message || "ไม่สามารถส่ง OTP ใหม่ได้");
      return;
    }

    let time = 5;
    setCooldown(time);

    const interval = setInterval(() => {
      time -= 1;
      setCooldown(time);
      if (time <= 0) clearInterval(interval);
    }, 1000);
  } catch {
    setFormMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    setOtpError(true);
  }
};


  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
      {/* Title */}
      <h1 className="text-2xl text-black font-semibold text-center mb-6">
        กรุณากรอก OTP
      </h1>

      {/* Description */}
      <p className="text-sm text-black text-center mb-4">
        โปรดตรวจสอบอีเมลของคุณเพื่อดูรหัสของคุณ รหัสของคุณมีความยาว 6 หลัก
      </p>

    <div className="mx-auto mb-6 w-fit">
      {formMessage && (
        <div className="mb-4 px-3 py-2 text-sm text-center rounded-md
          bg-red-50 border border-red-400 text-red-700">
          {formMessage}
        </div>
      )}

      <p className="text-s font-bold text-black text-left mb-1">
        กรุณากรอก OTP 6 หลัก
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-5">
        {otp.map((value, index) => (
          <input
            key={index}
            ref={(el) => {(inputsRef.current[index] = el)}}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => {
              handleChange(e.target.value, index);
              setOtpError(false);
              setFormMessage("");
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              w-12 h-12 text-center text-lg text-black
              border rounded-md
              focus:outline-none focus:ring-2
              ${otpError ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}
            `}
          />
        ))}
      </div>
        
      <div className="text-right mb-4">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={cooldown > 0}
          className="text-xs text-black cursor-pointer hover:underline"
        >
          {cooldown > 0
            ? `ส่ง OTP อีกครั้ง (${cooldown})`
            : "ส่ง OTP อีกครั้ง"}
        </button>
      </div>
    

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-[#0D7C66] text-white 
        py-2 rounded-md hover:bg-emerald-800 transition mb-6 cursor-pointer"
      >
        ดำเนินการต่อ
      </button>

      {/* Cancel */}
      <Link href="/login">
        <button
          className="w-full border border-[#0D7C66]
          text-[#0D7C66] py-2 rounded-md 
          hover:bg-emerald-50 transition cursor-pointer"
        >
          ยกเลิก
        </button>
      </Link>
      </div>
    </div>
  );
}
