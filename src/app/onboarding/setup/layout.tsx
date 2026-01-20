import ProgressLine from "@/components/ProgressLine";
import StatsSemiCircle from "@/components/StatsSemiCircle";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Link href="/" className="absolute top-8 left-8">
        <Image src="/neutral-logo.svg" alt="logo" width={50} height={50} />
      </Link>
      {children}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10">
        <ProgressLine />
      </div>
      
    </div>
  );
};

export default layout;
