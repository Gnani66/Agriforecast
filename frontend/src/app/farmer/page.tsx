"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FarmerHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/farmer/login");
  }, [router]);

  return null;
}
