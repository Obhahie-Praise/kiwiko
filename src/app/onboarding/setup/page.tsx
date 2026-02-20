"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Page1 from "@/components/setup-pages/Page1";
import LastPage from "@/components/setup-pages/LastPage";

const SignUpPage = () => {
  const [userRole, setUserRole] = useState<"investor" | "founder" | "">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kiwiko_onboarding_role");
      return (saved as any) || "";
    }
    return "";
  });
  const position = useSearchParams().get("page");

  useEffect(() => {
    if (userRole) {
      localStorage.setItem("kiwiko_onboarding_role", userRole);
    }
  }, [userRole]);

  if (!position) {
    redirect("/onboarding/setup?page=1");
  }

  if (position === "1") {
    return (
      <Page1
        position={position}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    );
  }

  if (position === "finished") {
    if (!userRole) {
      redirect("/onboarding/setup?page=1");
    }
    return <LastPage userRole={userRole} />;
  }

  // Default redirect for any other page index (minimal onboarding)
  redirect("/onboarding/setup?page=finished");
};

export default SignUpPage;
