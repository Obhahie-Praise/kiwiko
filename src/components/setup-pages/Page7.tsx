import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page7 = ({
  position,
  userRole,
  fundsSeekingStatus,
  setFundsSeekingStatus,
  fundingStage,
  setFundingStage,
}: {
  position: string;
  userRole: string;
  fundsSeekingStatus: string;
  setFundsSeekingStatus: React.Dispatch<React.SetStateAction<string>>;
  fundingStage: string;
  setFundingStage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const isComplete = fundsSeekingStatus && fundingStage ? true : false;
  const completed = isComplete;
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex items-center justify-center flex-1">
        <Image src="/page-7.svg" width={766} height={750} alt="page-1-main" />
      </div>
      <div className="bg-white w-120 min-h-screen relative">
        <div className="mb-10 mt-20 px-6 space-y-20">
          <div className="">
            <label htmlFor="revenue" className="text-2xl font-medium">
              Are you seeking funding for this project?
            </label>
            <div className="space-y-3 mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFundsSeekingStatus("Yes");
                }}
              >
                <div
                  className={`${fundsSeekingStatus === "Yes" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Yes</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFundsSeekingStatus("Soon");
                }}
              >
                <div
                  className={`${fundsSeekingStatus === "Soon" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Soon</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFundsSeekingStatus("Not currently");
                }}
              >
                <div
                  className={`${fundsSeekingStatus === "Not currently" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Not currently</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="the-solution" className="text-2xl font-medium">
              Funding stage{" "}
            </label>
            <div className="space-y-3 mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFundingStage("Pre-seed");
                }}
              >
                <div
                  className={`${fundingStage === "Pre-seed" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Pre-seed</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFundingStage("Seed");
                }}
              >
                <div
                  className={`${fundingStage === "Seed" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Seed</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFundingStage("Not decided");
                }}
              >
                <div
                  className={`${fundingStage === "Not decided" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Not decided</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Link
            href={`/onboarding/setup?page=${Number(position) - 1}`}
            className="flex items-center gap-1 text-sm cursor-pointer hover:text-zinc-700 transition font-medium"
          >
            <ChevronLeft width={17} height={17} />
            <p className="">Previous</p>
          </Link>
          <div className="h-5 w-px bg-black" />
          <Link
            aria-disabled={isComplete}
            href={`${isComplete && `/onboarding/setup?page=${Number(position) + 1}`}`}
            className={`flex items-center gap-1 text-sm ${isComplete ? "cursor-pointer text-black hover:text-zinc-700" : "text-zinc-400 cursor-not-allowed"} transition font-medium`}
          >
            <p className="">Next</p>
            <ChevronRight width={17} height={17} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page7;
