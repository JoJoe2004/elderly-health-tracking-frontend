import Link from "next/link";

export type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
};

export default function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 w-full  cursor-pointer
        transition-all duration-200 ease-in-out text-sm
        ${active
          ? "bg-[#93DA97] text-black"
          : "text-white hover:bg-emerald-600 hover:text-white"}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
