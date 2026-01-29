"use client";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import Page1 from "@/components/setup-pages/Page1";
import Page2 from "@/components/setup-pages/Page2";
import Page3 from "@/components/setup-pages/Page3";
import Page4 from "@/components/setup-pages/Page4";
import Page5 from "@/components/setup-pages/Page5";
import Page6 from "@/components/setup-pages/Page6";
import Page7 from "@/components/setup-pages/Page7";
import LastPage from "@/components/setup-pages/LastPage";
import Page8 from "@/components/setup-pages/Page8";

const SignUpPage = () => {
  const [userRole, setUserRole] = useState<"investor" | "founder" | "">("");
  const [projectName, setProjectName] = useState<string>("");
  const [projectDesc, setProjectDesc] = useState<string>("");
  const [catergory, setCatergory] = useState<string>("");
  const [theProblem, setTheProblem] = useState<string>("");
  const [theSolution, setTheSolution] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [linkToProduct, setLinkToProduct] = useState<string>("");
  const [userCount, setUserCount] = useState<string>("");
  const [revenue, setRevenue] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [leaderStatus, setLeaderStatus] = useState<string | null>("");
  const [fundsSeekingStatus, setFundsSeekingStatus] = useState<string>("");
  const [fundingStage, setFundingStage] = useState<string>("");
  const [benefits, setBenefits] = useState<string>( "");
  const [consent, setConsent] = useState(true)
  const position = useSearchParams().get("page");

  if (position === null) {
    redirect("/onboarding/setup?page=1");
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
        projectName={projectName}
        setProjectName={setProjectName}
        projectDesc={projectDesc}
        setProjectDesc={setProjectDesc}
        catergory={catergory}
        setCatergory={setCatergory}
      />
    );
  } else if (position == "3") {
    return (
      <Page3
        position={position}
        userRole={userRole}
        theProblem={theProblem}
        setTheProblem={setTheProblem}
        theSolution={theSolution}
        setTheSolution={setTheSolution}
      />
    );
  } else if (position == "4") {
    return (
      <Page4
        position={position}
        userRole={userRole}
        stage={stage}
        setStage={setStage}
        setLinkToProduct={setLinkToProduct}
        linkToProduct={linkToProduct}
      />
    );
  } else if (position == "5") {
    return (
      <Page5
        position={position}
        userRole={userRole}
        userCount={userCount}
        setUserCount={setUserCount}
        revenue={revenue}
        setRevenue={setRevenue}
      />
    );
  } else if (position == "6") {
    return (
      <Page6
        position={position}
        userRole={userRole}
        teamSize={teamSize}
        setTeamSize={setTeamSize}
        leaderStatus={leaderStatus}
        setLeaderStatus={setLeaderStatus}
      />
    );
  } else if (position == "7") {
    return (
      <Page7
        position={position}
        userRole={userRole}
        fundsSeekingStatus={fundsSeekingStatus}
        setFundsSeekingStatus={setFundsSeekingStatus}
        fundingStage={fundingStage}
        setFundingStage={setFundingStage}
      />
    );
  } else if (position == "8") {
    return (
      <Page8
        position={position}
        userRole={userRole}
        benefits={benefits}
        setBenefits={setBenefits}
      />
    );
  } else if (position == "finished") {
    return (
      <LastPage
        position={position}
        userRole={userRole}
        catergory={catergory}
        projectDesc={projectDesc}
        projectName={projectName}
        theProblem={theProblem}
        theSolution={theSolution}
        stage={stage}
        linkToProduct={linkToProduct}
        userCount={userCount}
        revenue={revenue}
        teamSize={teamSize}
        leaderStatus={leaderStatus}
        fundsSeekingStatus={fundsSeekingStatus}
        fundingStage={fundingStage}
      />
    );
  }
};

export default SignUpPage;
