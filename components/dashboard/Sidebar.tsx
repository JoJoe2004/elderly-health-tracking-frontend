"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import ProfileModal from "../ui/ProfileModal";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Pill,
  LogOut,
  Bell,
  ClipboardList,
  MessageCircle,
  User,
} from "lucide-react";

export default function Sidebar({ onCloseAction }: { onCloseAction?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔥 fetch user profile จาก backend จริง
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("fetch profile failed");

        const data = await res.json();

        setEmail(data.email);
        setUsername(data.username ?? "");
        setAvatar(data.avatarUrl ?? null);

        // cache ลง localStorage
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username ?? "");
        if (data.avatarUrl) {
          localStorage.setItem("avatar", data.avatarUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const displayName = username || email;

  const avatarUrl =
    avatar?.startsWith("http")
      ? avatar
      : avatar
      ? `${process.env.NEXT_PUBLIC_API_URL}${avatar}`
      : null;

  if (loading) return null;

  return (
    <>
      {onCloseAction && (
        <button
          onClick={onCloseAction}
          className="absolute top-3 right-3 text-white lg:hidden"
        >
          ✕
        </button>
      )}
      <aside className="w-64 h-full bg-[#0D7C66] text-white flex flex-col relative">
        {/* Profile */}
        <div
          onClick={() => setOpenProfile(true)}
          className="p-4 border-b border-gray-400 cursor-pointer hover:bg-emerald-600"
        >
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <div className="w-10 h-10 relative rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt="profile"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-700">
                <User size={20} />
              </div>
            )}

            <span className="text-sm truncate">
              {displayName || "ไม่พบผู้ใช้"}
            </span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="แดชบอร์ด" href="/dashboard" 
            active={pathname === "/dashboard"} 
            onClick={onCloseAction} 
          />

          <SidebarItem 
          icon={<Users size={18} />} 
          label="รายชื่อผู้สูงอายุ" href="/dashboard/elderly" 
          active={pathname.startsWith("/dashboard/elderly")}
          onClick={onCloseAction} 
          />

          <SidebarItem 
          icon={<MessageCircle size={18} />} 
          label="ผูกบัญชี Line" href="/dashboard/line" 
          active={pathname.startsWith("/dashboard/line")}
          onClick={onCloseAction} 
          />

          <SidebarItem 
          icon={<ClipboardList size={18} />} 
          label="บันทึกสุขภาพ" href="/dashboard/health" 
          active={pathname.startsWith("/dashboard/health")} 
          onClick={onCloseAction} 
          />

          <SidebarItem 
          icon={<Pill size={18} />} 
          label="จัดการตารางยา" href="/dashboard/medication" 
          active={pathname.startsWith("/dashboard/medication")} 
          onClick={onCloseAction} 
          />

          <SidebarItem 
          icon={<Bell size={18} />} 
          label="ตั้งค่าแจ้งเตือน" href="/dashboard/notification" 
          active={pathname.startsWith("/dashboard/notification")} 
          onClick={onCloseAction} 
          />
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-400">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-6 cursor-pointer text-white hover:bg-emerald-600 w-full"
          >
            <LogOut size={18} />
            <span className="text-sm">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Profile Modal */}
      {openProfile && (
        <ProfileModal
        email={email}
        username={username}
        avatar={avatar}
        onClose={() => setOpenProfile(false)}
        onSave={async ({ username, avatar }) => {
          const formData = new FormData();

            formData.append("username", username);

          if (avatar) {
            formData.append("avatar", avatar); // File
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );

          if (!res.ok) {
            console.error("Update profile failed");
            return;
          }

          const data = await res.json();

          // ✅ update state จาก backend
          setUsername(data.username ?? "");
          if (data.avatarUrl) {
            setAvatar(data.avatarUrl);
          }

          // ✅ sync localStorage
          localStorage.setItem("username", data.username ?? "");
          if (data.avatarUrl) {
            localStorage.setItem("avatar", data.avatarUrl);
          }
        }}
      />

      )}
    </>
  );
}
