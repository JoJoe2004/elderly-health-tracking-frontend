import { Suspense } from "react";
import HealthTable from "@/components/health/HealthTable";

export default function Page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <HealthTable />
    </Suspense>
  );
}
