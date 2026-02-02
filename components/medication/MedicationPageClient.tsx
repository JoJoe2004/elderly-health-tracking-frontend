"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MedicineForm from "@/components/medication/MedicineForm";

type Elderly = {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
};

export default function AddMedicinePage() {
  const params = useSearchParams();
  const elderlyId = params.get("elderlyId");

  const [elderly, setElderly] = useState<Elderly | null>(null);

  useEffect(() => {
    if (!elderlyId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}`)
      .then(res => res.json())
      .then(data => setElderly(data));
  }, [elderlyId]);

  if (!elderlyId) return null;

  return (
    <>
      <h2 className="text-lg font-semibold text-black mb-4">
        ชื่อผู้สูงอายุ: {elderly?.title}{elderly?.first_name} {elderly?.last_name}
      </h2>

      <MedicineForm elderlyId={Number(elderlyId)} />

    </>
  );
}
