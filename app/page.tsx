"use client";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return null;
}
