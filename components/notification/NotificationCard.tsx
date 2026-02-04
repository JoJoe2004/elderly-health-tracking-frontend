
import Image from "next/image";
import NotificationToggle from "./NotificationToggle";

type Reminder = {
  id: number;
  medicine_name: string;
  dose: number;
  dose_type: string;
  method: string;
  time: string;
  image: string;
  start_date: string;
  end_date: string | null;
  is_notify: number;
};

const doseTypeMap: Record<string, string> = {
  tablet: "เม็ด",
  capsule: "แคปซูล",
  liquid: "มล.",
  spoon: "ช้อน",
};

const methodMap: Record<string, string> = {
  before: "ก่อนอาหาร",
  after: "หลังอาหาร",
  with_food: "พร้อมอาหาร",
  bedtime: "ก่อนนอน",
};

type Props = {
  data: Reminder;
  onToggle: (id: number) => void;
};

export default function NotificationCard({ data, onToggle }: Props) {
  const calcDuration = (start: string, end: string | null) => {
  if (!end) return "ไม่ระบุ";

  const s = new Date(start);
  const e = new Date(end);
  const diffDays = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays >= 30) {
    const months = Math.round(diffDays / 30);
    return `${months} เดือน`;
  }

  return `${diffDays} วัน`;
};
const imageSrc = data.image || "/icons/no-medicine.png";

  return (
    <div className="bg-white rounded-xl p-4 shadow flex justify-between relative">
      <div className="flex gap-4">
        <div className="relative w-38 h-40">
          <Image
            src={imageSrc}
            alt="medicine"
            fill
            unoptimized
            className="object-cover rounded"
          />
        </div>

        <div className="text-base space-y-2 text-black">
          <p className="text-lg  font-semibold">{data.medicine_name}</p>
          <p>
            ปริมาณยาที่ใช : {data.dose} {doseTypeMap[data.dose_type]}
          </p>
          <p>วิธีทานยา : {methodMap[data.method]}</p>
          <p>ระยะเวลาการใช้ยา : {calcDuration(data.start_date, data.end_date)}</p>
          <p className="text-2xl  font-semibold">{data.time.slice(0,5)} น.</p>
        </div>
      </div>

      <div className="absolute bottom-3 right-3">
        <NotificationToggle
          enabled={data.is_notify === 1}
          onToggle={() => onToggle(data.id)}
        />
      </div>
    </div>
  );
}
