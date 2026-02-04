"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  elderlyId?: number;
};

type HealthGraphRow = {
  record_date: string;
  created_at: string;
  weight: number | null;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
  oxygen: number | null;
  temperature: number | null;
  blood_sugar: number | null;
};

export default function HealthChart({
  elderlyId,
}: Props) {
  const [data, setData] = useState<HealthGraphRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!elderlyId) return;

  let ignore = false;

  async function loadGraph() {
    try {
      setLoading(true);
      setData([]); // ⭐ สำคัญมาก

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/elderly/${elderlyId}/health-graph`
      );

      const json = await res.json();

      const rows: HealthGraphRow[] = Array.isArray(json)
        ? json
        : json?.data ?? [];

      if (!ignore) {
        setData(rows.slice(-7));
      }
    } catch (err) {
      console.error("health graph error:", err);
      if (!ignore) setData([]);
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  loadGraph();

  return () => {
    ignore = true;
  };
}, [elderlyId]);

  return (
    <div className="space-y-2">
      {/* Card */}
      <div className="bg-white rounded-xl p-4 h-72">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            กำลังโหลดข้อมูล...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            ไม่มีข้อมูลสุขภาพ
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="created_at"
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "short",
                  })
                }
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                labelStyle={{ color: "#000" }}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                }
                formatter={(value, name) => {
                  const unitMap: Record<string, string> = {
                    น้ำหนัก: "kg",
                    ชีพจร: "bpm",
                    ความดันบน: "mmHg",
                    ความดันล่าง: "mmHg",
                    ออกซิเจน: "%",
                    อุณหภูมิ: "°C",
                  };

                  const labelName = String(name);
                  return [`${value} ${unitMap[labelName] ?? ""}`, labelName];
                }}
              />
              <Legend />

              {/* กลุ่ม scale ใกล้กัน */}
              <Line
                type="monotone"
                dataKey="weight"
                name="น้ำหนัก"
                stroke="#0D7C66"
              />
              <Line
                type="monotone"
                dataKey="pulse"
                name="ชีพจร"
                stroke="#F59E0B"
              />

              {/* ความดัน */}
              <Line
                type="monotone"
                dataKey="systolic"
                name="ความดันบน"
                stroke="#EF4444"
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="ความดันล่าง"
                stroke="#FB7185"
              />

              {/* ค่าอื่น */}
              <Line
                type="monotone"
                dataKey="oxygen"
                name="ออกซิเจน"
                stroke="#3B82F6"
              />
              <Line
                type="monotone"
                dataKey="temperature"
                name="อุณหภูมิ"
                stroke="#8B5CF6"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
