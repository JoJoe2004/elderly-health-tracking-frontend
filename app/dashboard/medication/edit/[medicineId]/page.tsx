"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MedicineEdit from "@/components/medication/MedicineEdit";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
};

export default function EditMedicinePage() {
  const params = useParams<{ medicineId: string }>();
  const medicineId = Number(params.medicineId);

  const [elderly, setElderly] = useState<Elderly | null>(null);

  useEffect(() => {
    if (!medicineId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines/${medicineId}/elderly`)
      .then(res => res.json())
      .then(data => setElderly(data));
  }, [medicineId]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-black">
        ชื่อผู้สูงอายุ: {elderly?.title}{elderly?.first_name} {elderly?.last_name}
      </h2>

      <MedicineEdit medicineId={medicineId} elderlyId={elderly?.id} />
    </div>
  );
}
