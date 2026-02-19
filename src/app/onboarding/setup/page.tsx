"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import Page1 from "@/components/setup-pages/Page1";
import LastPage from "@/components/setup-pages/LastPage";

const SignUpPage = () => {
  const [userRole, setUserRole] = useState<"investor" | "founder" | "">("");
  const position = useSearchParams().get("page");

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
    return <LastPage userRole={userRole} />;
  }

  // Default redirect for any other page index (minimal onboarding)
  redirect("/onboarding/setup?page=finished");
};

export default SignUpPage;
