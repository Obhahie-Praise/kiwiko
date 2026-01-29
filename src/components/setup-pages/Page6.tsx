import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page6 = ({
  position,
  userRole,
  teamSize,
  setTeamSize,
  leaderStatus,
  setLeaderStatus,
}: {
  position: string;
  userRole: string;
  teamSize: string;
  setTeamSize: React.Dispatch<React.SetStateAction<string>>;
  leaderStatus: string | null;
  setLeaderStatus: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const isComplete = teamSize && leaderStatus ? true : false;
  const completed = isComplete;
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex items-center justify-center flex-1">
        <Image src="/page-6.svg" width={766} height={750} alt="page-1-main" />
      </div>
      <div className="bg-white w-120 min-h-screen relative">
        <div className="mb-10 mt-20 px-6 space-y-20">
          <div className="">
            <label htmlFor="revenue" className="text-2xl font-medium">
              Team size
            </label>
            <div className="space-y-3 mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setTeamSize("Solo");
                }}
              >
                <div
                  className={`${teamSize === "Solo" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Solo</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setTeamSize("2-3");
                }}
              >
                <div
                  className={`${teamSize === "2-3" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">2-3</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setTeamSize("4+");
                }}
              >
                <div
                  className={`${teamSize === "4+" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">4+</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="the-solution" className="text-2xl font-medium">
              Are you leading development on this project?
            </label>
            <div className="space-y-3 mt-3">
                <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setLeaderStatus("Yes");
                }}
              >
                <div
                  className={`${leaderStatus === "Yes" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">Yes</p>
              </div>
                <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setLeaderStatus("No");
                }}
              >
                <div
                  className={`${leaderStatus === "No" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">No</p>
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

export default Page6;
