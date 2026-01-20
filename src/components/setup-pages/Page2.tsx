import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Page2 = ({
  position,
  userRole,
  stage,
  niche,
  setNiche,
  setStage,
  startupName,
  setstartupName,
  startupDesc,
  setstartupDesc,
}: {
  position: string;
  userRole: string;
  stage: string;
  niche: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  setNiche: React.Dispatch<React.SetStateAction<string>>;
  startupName: string;
  setstartupName: React.Dispatch<React.SetStateAction<string>>;
  startupDesc: string;
  setstartupDesc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  const [stageDrop, setStageDrop] = useState(false);
  const [nicheDrop, setNicheDrop] = useState(false);
  const isComplete = userRole && startupName && startupDesc && stage && niche;

  return (
    <div className="flex justify-center my-20 overflow-y-hidden h-screen">
      <div className="">
        <h1 className="text-4xl font-semibold bg-linear-to-b text-center from-zinc-300 to-zinc-700 bg-clip-text text-transparent">
          Tell us about what you are building
        </h1>
        <h2 className="text-xl font-medium text-center">
          Optimize your executions
        </h2>
        <div className="mx-30 space-y-3 mt-10">
          <div className="flex flex-col space-y-1">
            <label htmlFor="project-name" className="font-medium">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Whats your startups name?"
              value={startupName as string}
              onChange={(e) => setstartupName(e.target.value)}
              id="project-name"
              className="border border-zinc-500 p-2 rounded-lg focus:outline-2 outline-zinc-300 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="project-name" className="font-medium">
              Project Description
            </label>
            <textarea
              placeholder="What does it do?"
              id="project-name"
              onChange={(e) => setstartupDesc(e.target.value)}
              value={startupDesc as string}
              className="border border-zinc-500 p-2 rounded-lg focus:outline-2 outline-zinc-300 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="niche" className="font-medium">
              Project Niche
            </label>

            <div className="relative" onClick={() => setNicheDrop(!nicheDrop)}>
              <div className="p-2 border border-zinc-400 font-medium rounded-lg text-zinc-600 flex justify-between items-center cursor-pointer">
                <p>{niche || "Select a niche"}</p>
                <ChevronDown />
              </div>

              <ul
                className={`${
                  nicheDrop ? "block" : "hidden"
                } z-10 p-2 border-2 border-zinc-300 rounded-xl bg-zinc-200 absolute -bottom-48 w-full
  max-h-48 overflow-y-auto`}
              >
                <s></s>
                {[
                  "Fintech",
                  "Healthtech",
                  "Edtech",
                  "SaaS / Developer Tools",
                  "AI / Data",
                  "E-commerce",
                  "Climate / Sustainability",
                  "Logistics / Mobility",
                  "Media / Creator Economy",
                  "Web3 / Blockchain",
                ].map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setNiche(item);
                      setNicheDrop(false);
                    }}
                    className="py-2 px-3 text-zinc-700 hover:bg-zinc-300 rounded-lg transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="stage" className="font-medium">
              Project Stage
            </label>

            <div className="relative" onClick={() => setStageDrop(!stageDrop)}>
              <div className="p-2 border border-zinc-400 font-medium rounded-lg text-zinc-600 flex justify-between items-center cursor-pointer">
                <p>{stage || "Select a stage"}</p>
                <ChevronDown />
              </div>

              <ul
                className={`${
                  stageDrop ? "block" : "hidden"
                } z-10 p-2 border-2 border-zinc-300 rounded-xl bg-zinc-200 absolute -bottom-48 w-full
      max-h-48 overflow-y-auto`}
              >
                {[
                  "Idea",
                  "MVP",
                  "Early Traction",
                  "Growth",
                  "Scaling",
                  "Pre-Seed",
                  "Seed",
                  "Unsure",
                ].map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setStage(item);
                      setStageDrop(false);
                    }}
                    className="py-2 px-3 text-zinc-700 hover:bg-zinc-300 rounded-lg transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <div className=" flex items-center gap-10">
          <Link
            href={`/onboarding/setup?page=${Number(position) - 1}`}
            className="flex items-center font-medium bg-zinc-300 border border-zinc-400 rounded-full  py-2 px-3"
          >
            <ChevronLeft />
            <p className="">Prev</p>
          </Link>
          <Link
            href={`${isComplete && `/onboarding/setup?page=${Number(position) + 1}`}`}
            aria-disabled={isComplete}
            
            className={`flex items-center font-medium bg-black border border-black text-white rounded-full  py-2 px-3 ${isComplete ? "" : "opacity-20 cursor-not-allowed"}`}
          >
            <p className="">Next</p>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page2;
