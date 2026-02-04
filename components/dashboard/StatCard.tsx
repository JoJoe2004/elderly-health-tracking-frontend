import Image from "next/image";
type StatCardProps = {
  value: number;
  unit: string;
  iconSrc: string;
};

export default function StatCard({ value, unit, iconSrc }: StatCardProps) {
  return (
    <div className="
    bg-white rounded-xl px-6 py-4
      flex items-center justify-between
      w-full h-24
    ">  
      <div className="w-20 h-20 flex items-center justify-center rounded-xl">
        <Image
          src={iconSrc}
          alt={unit}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Value + Unit */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-800 text-center min-w-8">
          {value}
        </span>
        <span className="text-lg font-semibold text-gray-800 w-16 ">
          {unit}
        </span>
      </div>

    </div>
  );
}
