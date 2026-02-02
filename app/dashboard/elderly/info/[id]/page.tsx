"use client";
import ElderlyProfile from "@/components/elderly/ElderlyProfile";
import InfoBox from "@/components/elderly/InfoBox";
import StatusBox from "@/components/elderly/StatusBox";
import HealthChart from "@/components/health/HealthChart";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ElderlyInfoPage() {
  const { id } = useParams(); // id จาก URL

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-6 items-stretch">
        
          <div className="h-full">
            <ElderlyProfile elderlyId={id as string} />
          </div>

          <div className="h-full">
            <InfoBox elderlyId={id as string} type="disease" title="ข้อมูลโรคประจำตัว" />
          </div>

          <div className="flex flex-col h-full">
            <InfoBox
              elderlyId={id as string}
              type="allergy"
              title="ประวัติแพ้ยา"
            />

            <div className="mt-1">
            <StatusBox elderlyId={id as string} />
            </div>
          </div>
      </div>
      <div>
        <h3 className="font-semibold text-black mb-2">
          กราฟสุขภาพโดยรวมผู้สูงอายุ
        </h3>
        <HealthChart elderlyId={Number(id)} />
      </div>
      {/* ปุ่มแก้ไข */}
      <div className="flex justify-end">
        <Link href={`/dashboard/elderly/edit/${id}`}>
          <button className="bg-[#0D7C66] text-white px-4 py-2 rounded-md hover:bg-emerald-800">
            แก้ไขข้อมูล
          </button>
        </Link>
      </div>
    </div>
  );
}
