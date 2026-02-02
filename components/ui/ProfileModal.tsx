"use client";

import Image from "next/image";
import { useState } from "react";
import { User } from "lucide-react";

interface ProfileModalProps {
  email: string;
  username: string;
  avatar?: string | null;
  onClose: () => void;
  onSave: (data: {
    username: string;
    avatar?: File | null;
  }) => void;
}

export default function ProfileModal({
  email,
  username,
  avatar,
  onClose,
  onSave,
}: ProfileModalProps) {
  const [name, setName] = useState(username || ""); 
  const [file, setFile] = useState<File | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [preview, setPreview] = useState<string | null>(() => {
    if (!avatar) return null;
    if (avatar.startsWith("blob:") || avatar.startsWith("data:")) return avatar;
    return `${API_URL}${avatar}`;
  });

  const handleImageChange = (file?: File) => {
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleSave = () => {
    onSave({
      username: name.trim(),
      avatar: file ?? null,
    });
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#0D7C66] rounded-lg w-105  px-8 py-6 text-black relative">
        
        {/* Avatar */}
        <div className="flex flex-col items-center mt-6 mb-4">
          <label
            htmlFor="avatar-upload"
            className="relative w-40 h-40 rounded-full cursor-pointer group overflow-hidden"
          >
            {preview ? (
              <Image
                src={preview}
                alt="avatar preview"
                fill
                unoptimized
                className="w-40 h-40 object-cover rounded-full"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <User size={64} />
              </div>
            )}

            {/* overlay */}
            <div
              className="absolute inset-0 rounded-full bg-black/40 
                        opacity-0 group-hover:opacity-100 
                        flex items-center justify-center
                        text-white text-sm transition"
            >
              เปลี่ยนรูป
            </div>
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleImageChange(e.target.files?.[0])}
          />
        </div>


          
        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm mb-1 block text-white">ชื่อผู้ใช้</label>
            <input  
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="กรอกชื่อที่ต้องการแสดง"
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-1 block text-white">อีเมล</label>
            <input
              value={email}
              disabled
              className="w-full border rounded px-3 py-2 text-sm bg-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-sm text-white border rounded-md hover:bg-emerald-700"
            >
              ยกเลิก
            </button> 
            <button
              onClick={handleSave}
              className="flex-1 py-2 text-[#0D7C66] bg-white rounded-md text-sm hover:bg-gray-100"
            >
              บันทึก
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
