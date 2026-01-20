"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import Page1 from "@/components/setup-pages/Page1";
import Page2 from "@/components/setup-pages/Page2";
import Page3 from "@/components/setup-pages/Page3";
import Page4 from "@/components/setup-pages/Page4";

const SignUpPage = () => {
  const [userRole, setUserRole] = useState<string>("");
  const [startupName, setstartupName] = useState<string>("");
  const [startupDesc, setstartupDesc] = useState<string>("");
  const [stage, setStage] = useState<string>("FinTech");
  const [niche, setNiche] = useState<string>("An Idea");
  const [firstUpdateTitle, setfirstUpdateTitle] = useState<string>("");
  const [firstUpdateDesc, setfirstUpdateDesc] = useState<string>("");
  const position = useSearchParams().get("page");
  
  if (position === null) {
    redirect("/onboarding/setup?page=1")
  }
  if (position == "1") {
    return (
      <Page1
        position={position}
        userRole={userRole}
        setUserRole={setUserRole}
      />
    );
  } else if (position == "2") {
    return (
      <Page2
        position={position}
        userRole={userRole}
        startupName={startupName}
        setstartupName={setstartupName}
        startupDesc={startupDesc}
        setstartupDesc={setstartupDesc}
        niche={niche}
        setNiche={setNiche}
        stage={stage}
        setStage={setStage}
      />
    );
  } else if (position == "3") {
    return (
      <Page3
      startupName= {startupName}
  startupDesc={startupDesc}
  niche={niche}
  stage={stage}
        position={position}
        userRole={userRole}
        firstUpdateTitle={firstUpdateTitle}
        setfirstUpdateTitle={setfirstUpdateTitle}
        firstUpdateDesc={firstUpdateDesc}
        setfirstUpdateDesc={setfirstUpdateDesc}
      />
    );
  } else if (position == "4") {
    return <Page4 />;
  }
};

export default SignUpPage;
