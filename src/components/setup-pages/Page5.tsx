import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page5 = ({
  position,
  userRole,
  userCount,
  setUserCount,
  revenue,
  setRevenue,
}: {
  position: string;
  userRole: string;
  userCount: string;
  setUserCount: React.Dispatch<React.SetStateAction<string>>;
  revenue: string;
  setRevenue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  const isComplete = revenue && userCount ? true : false;
  const completed = isComplete;
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex items-center justify-center flex-1">
        <Image src="/page-5.svg" width={766} height={750} alt="page-1-main" />
      </div>
      <div className="bg-white w-120 min-h-screen relative">
        <div className="mb-10 mt-20 px-6 space-y-20">
          <div className="">
            <label htmlFor="revenue" className="text-2xl font-medium">
              Users or customers
            </label>
            <div className="space-y-3 mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setUserCount("None yet");
                }}
              >
                <div
                  className={`${userCount === "None yet" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">None yet</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setUserCount("< 50");
                }}
              >
                <div
                  className={`${userCount === "< 50" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">{"< 50"}</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setUserCount("50-500");
                }}
              >
                <div
                  className={`${userCount === "50-500" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">50-500</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setUserCount("500+");
                }}
              >
                <div
                  className={`${userCount === "500+" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">500+</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="the-solution" className="text-2xl font-medium">
              Revenue{" "}
              <span className="text-sm text-zinc-500"> (if any)</span>
            </label>
            <div className="space-y-3 mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setRevenue("$0");
                }}
              >
                <div
                  className={`${revenue === "$0" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">$0</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setRevenue("<$500/mo");
                }}
              >
                <div
                  className={`${revenue === "<$500/mo" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">{"<$500/mo"}</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setRevenue("$500–$5k/mo");
                }}
              >
                <div
                  className={`${revenue === "$500–$5k/mo" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">$500–$5k/mo</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setRevenue("$5k+/mo");
                }}
              >
                <div
                  className={`${revenue === "$5k+/mo" ? " bg-black border-zinc-400" : "bg-white border-black"} w-5 h-5 border-2 rounded-full`}
                />
                <p className="text-2xl font-medium">$5k+/mo</p>
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

export default Page5;
