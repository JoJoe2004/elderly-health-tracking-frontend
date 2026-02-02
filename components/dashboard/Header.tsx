import Image from "next/image";

export default function Header() {
  return (
    <header className="h-14 bg-[#0D7C66] text-white flex items-center justify-center px-4">
      <Image
        src="/EHT_logo_header.png"
        alt="EHT Logo"
        width={280}
        height={40}
        className="object-contain"
        priority
      />
    </header>
  );
}
