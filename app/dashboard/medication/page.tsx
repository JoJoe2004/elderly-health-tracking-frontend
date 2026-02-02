import { Suspense } from "react";
import MedicineTable from "@/components/medication/MedicineTable";

export default function MedicationPage() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <MedicineTable />
    </Suspense>
  );
}
