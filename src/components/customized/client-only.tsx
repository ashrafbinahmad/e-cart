"use client";

import React, { useEffect, useState } from "react";

type props = {
  children: React.ReactNode;
  className?: string;
};
export default function ClientOnly({ children, className }: props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return <div className={className}> {mounted && children}</div>;
}
