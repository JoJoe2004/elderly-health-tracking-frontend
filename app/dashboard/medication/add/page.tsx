import { Suspense } from "react";
import MedicationPageClient from "@/components/medication/MedicationPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <MedicationPageClient />
    </Suspense>
  );
}
