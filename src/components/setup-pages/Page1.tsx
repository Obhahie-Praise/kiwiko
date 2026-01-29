import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page1 = ({
  position,
  userRole,
  setUserRole,
}: {
  position: string;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<"founder" | "investor" | "">>;
}) => {
  return (
    <div className="flex justify-center my-20 overflow-y-hidden h-screen">
      <div className="">
        <h1 className="text-2xl font-semibold bg-linear-to-b text-center from-zinc-300 to-zinc-700 bg-clip-text text-transparent">
          Let's get you started!
        </h1>
        <h2 className="text-normal font-medium text-center">
          How will you use kiwiko?
        </h2>
        <div className="">
          <div className="mt-5 grid grid-cols-2 gap-8 w-300">
            <Link
              href="/onboarding/setup?page=2"
              onClick={() => {
                setUserRole("investor");
              }}
              className={`border-2 group border-zinc-400 h-fit text-center flex flex-col items-center justify-between rounded-2xl shadow-2xl shadow-zinc-400 relative overflow-hidden group transition-all hover:shadow-xl ${position == "2" ? "cursor-not-allowed text-zinc-300 bg-zinc-300 border-zinc-300" : ""}`}
            >
              <Image src="/investor.svg" alt="investor" width={448} height={448} className="" />
              <Image src="/investor-grid.svg" alt="investor" width={246} height={246} className="absolute top-0 left-0" />
              <Image src="/dark-sparkle.svg" alt="investor" width={246} height={246} className="absolute bottom-20 right-20" />
              <button className="mb-10 font-medium px-6 text-white py-2 rounded-full group-hover:bg-zinc-800 transition bg-black">I am an Investor</button>
              <p className="-z-10 w-50 h-200 bg-linear-to-r from-zinc-200 via-zinc-700/40 to-zinc-200 absolute -top-30 -left-full blur-2xl rotate-45 group-hover:left-200 transition-all duration-700"></p>
            </Link>
            <Link
              href="/onboarding/setup?page=2"
              onClick={() => setUserRole("founder")}
              className="border-2 group border-zinc-400 h-fit text-center flex flex-col items-center justify-between rounded-2xl shadow-2xl shadow-zinc-400 relative overflow-hidden group transition-all hover:shadow-xl"
            >
              <Image src="/founder.svg" alt="investor" width={448} height={448} className="" />
              <Image src="/cyberbox.svg" alt="investor" width={246} height={246} className="absolute top-0 left-0" />
              <Image src="/dark-sparkle.svg" alt="investor" width={246} height={246} className="absolute bottom-8 right-15" />
              <Image src="/airplane-trace.svg" alt="investor" width={246} height={246} className="absolute -top-5 right-27" />
              <Image src="/sparkle.svg" alt="investor" width={246} height={246} className="absolute bottom-5 left-10" />
              <button className="mb-10 font-medium px-6 text-white py-2 rounded-full group-hover:bg-zinc-800 transition bg-black">I am a Founder</button>
              <p className="-z-10 w-50 h-200 bg-linear-to-r from-zinc-200 via-zinc-700/40 to-zinc-200 absolute -top-30 -left-full blur-2xl rotate-45 group-hover:left-200 transition-all duration-700"></p>
            </Link>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Page1;
