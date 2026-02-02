import Image from "next/image";
type StatCardProps = {
  value: number;
  unit: string;
  iconSrc: string;
};

export default function StatCard({ value, unit, iconSrc }: StatCardProps) {
  return (
    <div className="flex items-center bg-white rounded-xl px-3 py-2 gap-16">
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
      <div className="flex items-baseline gap-16">
        <span className="text-2xl font-semibold text-gray-800">
          {value}
        </span>
        <span className="text-lg font-semibold text-gray-800 w-16 ">
          {unit}
        </span>
      </div>

    </div>
  );
}
