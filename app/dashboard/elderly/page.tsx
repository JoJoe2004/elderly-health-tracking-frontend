"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ElderlyTable from "@/components/elderly/ElderlyTable";

export default function ElderlyPage() {
  const [elderlyCount, setElderlyCount] = useState(0);
  
    useEffect(() => {
      const userId = localStorage.getItem("userId");
  
      if (userId) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/count/${userId}`)
          .then(res => res.json())
          .then(data => setElderlyCount(data.total));
      }
    }, []);
return (
    <div className="space-y-4">
   
        <div>
          <h3 className="font-semibold mb-1 text-black">
            จำนวนผู้สูงอายุในความดูแล
          </h3>
          <StatCard
            value={elderlyCount}
            unit="คน"
            iconSrc="/icons/icon_elderly.png"
          />
        </div>       

      {/* Table */}
      <ElderlyTable />
    </div>
  );
}
