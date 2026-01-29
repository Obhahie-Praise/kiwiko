import { StartupOnboarding } from "@/lib/actions/server-actions";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const LastPage = ({
  position,
  userRole,
  catergory,
  projectDesc,
  projectName,
  theProblem,
  theSolution,
  stage,
  linkToProduct,
  userCount,
  revenue,
  teamSize,
  leaderStatus,
  fundsSeekingStatus,
  fundingStage,
  consent,
  setConsent,
}: StartupOnboarding) => {
  const [infoisaccurate, setinfoisaccurate] = useState(false);
  const [sharingisallowed, setsharingisallowed] = useState(false);
  const [fundingsnotguaranteed, setfundingsnotguaranteed] = useState(false);
  const isComplete =
    infoisaccurate && sharingisallowed && fundingsnotguaranteed ? true : false;
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex items-center justify-center flex-1">
        <Image src="/page-9.svg" width={766} height={750} alt="page-1-main" />
      </div>
      <div className="bg-white w-120 min-h-screen relative">
              <div className="absolute top-4 font-medium left-1/2 -translate-x-1/2 text-sm">Finished!</div>

        <div className="mb-10 mt-20 px-6 space-y-2">
          <p className="text-4xl text-center font-semibold bg-linear-to-b from-zinc-800 to-zinc-500 text-shadow-2xs shadow-zinc-500 text-transparent bg-clip-text">
            Welcome to kiwiko
          </p>
          <p className="text-center  text-gray-500 text-xl">
            Consent <span className="text-sm"> (required)</span>
          </p>
        </div>
        <div className="mx-10 space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="info-is-accurate"
              type="checkbox"
              className=""
              aria-selected={infoisaccurate}
              onChange={() => {
                setinfoisaccurate(!infoisaccurate);
              }}
            />
            <label htmlFor="info-is-accurate" className="">
              I confirm this project information is accurate
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="sharing-is-allowed"
              type="checkbox"
              className=""
              aria-selected={sharingisallowed}
              onChange={() => {
                setsharingisallowed(!sharingisallowed);
              }}
            />
            <label htmlFor="sharing-is-allowed" className="">
              I consent to sharing this project with verified investors
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="funding's-not-guaranteed"
              type="checkbox"
              className=""
              aria-selected={fundingsnotguaranteed}
              onChange={() => {
                setfundingsnotguaranteed(!fundingsnotguaranteed);
              }}
            />
            <label htmlFor="funding's-not-guaranteed" className="">
              I understand funding is not guaranteed
            </label>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            aria-disabled={isComplete}
            onClick={() => {
              
            }}
            className={`py-2 w-50 text-center rounded-lg ${isComplete ? "opacity-100  cursor-pointer  hover:text-zinc-200 hover:bg-zinc-800" : "opacity-50 cursor-not-allowed"} bg-black text-white text-xl transition font-semibold`}
          >
            <p className="">Dive in</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LastPage;
