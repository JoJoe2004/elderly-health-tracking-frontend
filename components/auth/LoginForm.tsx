"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formMessage, setFormMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
  if (!formMessage) return;

  const timer = setTimeout(() => {
    setFormMessage("");
    setMessageType("");
  }, 3000);

  return () => clearTimeout(timer);
}, [formMessage]);


const handleLogin = async () => {
   let hasError  = false;

    if (!email) {
    setEmailError("กรุณากรอกอีเมล");
    hasError = true;
  } else setEmailError("");

  if (!password) {
    setPasswordError("กรุณากรอกรหัสผ่าน");
    hasError = true;
  } else setPasswordError("");

  if (hasError) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessageType("error");
      setFormMessage(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    
     // login สำเร็จ
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("email", email);

    localStorage.setItem("username", data.username || "");
    localStorage.setItem("avatar", data.avatar || ""); // ชั่วคราว
    router.push("/dashboard");
   
  } catch {
    setMessageType("error");
    setFormMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
  }
  
};

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
      <div className="flex flex-col items-center">
      <Image
        src="/EHT_logo.png"
        alt="EHT Logo"
        width={180}
        height={180}
        priority
        className="-mb-10" 
      />
      <h1 className="text-2xl text-black font-semibold text-center mb-6">
        เข้าสู่ระบบ
      </h1>
    </div>

    <div className="mx-auto max-w-sm mb-6">
      {formMessage && (
        <div
          className={`relative mb-4 w-full px-3 py-2 rounded-md text-sm text-center
            ${
              messageType === "error"
                ? "bg-red-50 border border-red-400 text-red-700"
                : "bg-emerald-50 border border-emerald-400 text-emerald-700"
            }`}
        >
          <span>{formMessage}</span>
          <button
            onClick={() => {
              setFormMessage("");
              setMessageType("");
            }}
            className="absolute right-3 top-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

    
      {/* Email */}
      <div className="mb-4 relative">
        <label className="block text-black text-sm font-bold mb-1">อีเมล</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => {setEmail(e.target.value);
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
      <div className="mb-2 relative">
        <label className="block text-black text-sm font-bold mb-1">รหัสผ่าน</label>
        <input
          type="password"
          value={password}
          placeholder="Enter your password"         
          onChange={(e) => {setPassword(e.target.value);
            setPasswordError("");
          }}
          className={`placeholder-gray-500 text-black w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2
              ${passwordError ? "border-red-500 focus:ring-red-500" : "focus:ring-emerald-500"}`}
        />

        {passwordError && (
          <span className="absolute -bottom-5 right-0 text-xs text-red-600">
          {passwordError}
        </span>
        )}

      </div>

      {/* Forgot password */}
      <Link href="/recovery">
        <div className="text-left text-xs text-gray-500 mb-4 cursor-pointer hover:underline">
          ลืมรหัสผ่าน?
        </div>
      </Link>

      {/* Login button */}
      <button  
        onClick={handleLogin} 
        className="w-full bg-[#0D7C66] text-white 
          py-2 rounded-md hover:bg-emerald-800 transition cursor-pointer"
      >
        เข้าสู่ระบบ
      </button>


      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-500">หรือ</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Register Link */}
      <Link href="/register">
        <button className="w-full border border-[#0D7C66]
        text-[#0D7C66] py-2 rounded-md hover:bg-emerald-50 transition cursor-pointer">
          ลงทะเบียน
        </button>
      </Link>
      </div>
    </div>
  );
}
