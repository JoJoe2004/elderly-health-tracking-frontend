import Image from "next/image";
import { Menu } from "lucide-react";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="h-14 bg-[#0D7C66] text-white flex items-center px-4">
      {/* ปุ่มเมนู — แสดงเฉพาะจอเล็ก */}
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-3 cursor-pointer"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1 flex justify-center">
        <Image
          src="/EHT_logo_header.png"
          alt="EHT Logo"
          width={280}
          height={40}
          className="object-contain"
          priority
        />
      </div>
    </header>
  );
}
