import { Suspense } from "react";
import HealthAdd from "@/components/health/HealthAdd";

export default function Page() {
  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <HealthAdd />
    </Suspense>
  );
}
