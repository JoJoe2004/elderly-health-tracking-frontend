"use client";
import { useParams } from "next/navigation";
import ElderlyForm from "@/components/elderly/ElderlyForm";

export default function EditElderlyPage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <ElderlyForm mode="edit" elderlyId={id as string} />
    </div>
  );
}
