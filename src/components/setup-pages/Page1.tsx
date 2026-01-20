import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page1 = ({
  position,
  userRole,
  setUserRole,
}: {
  position: string;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<string>>;
}) => {
  console.log(Number(position));
  return (
    <div className="flex justify-center my-20 overflow-y-hidden h-screen">
      <div className="">
        <h1 className="text-4xl font-semibold bg-linear-to-b text-center from-zinc-300 to-zinc-700 bg-clip-text text-transparent">
          Let's get you started!
        </h1>
        <h2 className="text-xl font-medium text-center">
          How will you use kiwiko?
        </h2>
        <div className="">
          <div className="mt-30 grid grid-rows-2 gap-8 w-100">
            <Link
              href="/onboarding/setup?page=2"
              onClick={() => {
                setUserRole("founder");
              }}
              className={`border-2 border-zinc-400 h-20 text-center flex items-center justify-center rounded-2xl text-2xl shadow-2xl shadow-zinc-400 relative overflow-hidden group transition-all hover:shadow-xl ${position == "2" ? "cursor-not-allowed text-zinc-300 bg-zinc-300 border-zinc-300" : ""}`}
            >
              I’m building a startup
              <p className="w-50 h-120 bg-linear-to-r from-zinc-200 via-zinc-700/40 to-zinc-200 absolute -top-30 -left-full blur-2xl rotate-45 group-hover:left-full transition-all duration-500"></p>
            </Link>
            <Link
              href="/onboarding/setup?page=2"
              onClick={() => setUserRole("investor")}
              className="border-2 border-zinc-400 h-20 text-center flex items-center justify-center rounded-2xl text-2xl shadow-2xl shadow-zinc-400 relative overflow-hidden group transition-all hover:shadow-xl"
            >
              I’m looking to discover startups
              <p className="w-50 h-120 bg-linear-to-r from-zinc-200 via-zinc-700/40 to-zinc-200 absolute -top-30 -left-full blur-2xl rotate-45 group-hover:left-full transition-all duration-500"></p>
            </Link>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Page1;
