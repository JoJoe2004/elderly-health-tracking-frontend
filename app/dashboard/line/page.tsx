"use client";

import { useEffect } from "react";
import liff from "@line/liff";
import LineTable from "@/components/line/LineTable";

export default function LinePage() {
  useEffect(() => {
    const bindLine = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
        });

        // ถ้ายังไม่ login → เด้งเข้า LINE
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const profile = await liff.getProfile();

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/line/bind`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              lineUserId: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
            }),
          }
        );
      } catch (err) {
        console.error("LIFF bind error:", err);
      }
    };

    bindLine();
  }, []);

  return (
    <div>
      <LineTable />
    </div>
  );
}
