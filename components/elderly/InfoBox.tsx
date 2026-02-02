"use client";
import { useEffect, useState } from "react";

type Props = {
  elderlyId: string;
  type: "disease" | "allergy";
  title: string;
};

type Disease = {
  id: number;
  disease_name: string;
};

type Allergy = {
  id: number;
  allergy_name: string;
};

type Item = Disease | Allergy;

export default function InfoBox({ elderlyId, type, title }: Props) {
  const [items, setItems] = useState<Item[]>([]);


  useEffect(() => {
    const url =
      type === "disease"
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}/diseases`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}/allergies`;

    fetch(url)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [elderlyId, type]);



  return (
    <div className="h-full flex flex-col text-black">
      <h3 className="font-semibold mb-2">{title}</h3>

      <div className="bg-white rounded-xl p-4 text-base flex-1">
        {items.length === 0 ? (
          <ul className="list-disc list-inside">
            <li>ไม่มีข้อมูล</li>
          </ul>
        ) : (
          <ul className="list-disc pl-4 space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                {type === "disease"
                  ? (item as Disease).disease_name
                  : (item as Allergy).allergy_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
