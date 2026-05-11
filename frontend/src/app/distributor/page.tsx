"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DistributorHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/distributor/login");
  }, [router]);

  return null;
}
