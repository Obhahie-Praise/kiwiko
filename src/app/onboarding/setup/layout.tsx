"use client"
import ProgressLine from "@/components/ProgressLine";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentPage = useSearchParams().get("page")
  console.log(currentPage)
  return (
    <div>
      <Link href="/" className="absolute top-8 left-8">
        <Image src="/neutral-logo.svg" alt="logo" width={40} height={40} />
      </Link>
      {children}
      <div
        className={`absolute  z-10 ${currentPage == '1' ? "top-10 left-1/2 -translate-x-1/2" : "top-10 right-20 "}`}
      >
        <ProgressLine />
      </div>
    </div>
  );
};

export default layout;
