import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const Page2 = ({
  position,
  userRole,
  setCatergory,
  catergory,
  setProjectDesc,
  projectDesc,
  setProjectName,
  projectName,
}: {
  position: string;
  userRole: string;
  catergory: string;
  setCatergory: React.Dispatch<React.SetStateAction<string>>;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  projectDesc: string;
  setProjectDesc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  const isComplete = userRole && projectName && projectDesc && catergory ? true : false;
 
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex items-center justify-center flex-1">
        <Image src="/page-1.svg" width={766} height={750} alt="page-1-main" />
      </div>
      <div className="bg-white w-120 min-h-screen relative">
        <div className="mb-10 mt-20 px-6 space-y-8">
          <div className="flex flex-col space-y-2">
            <label htmlFor="projectName" className="text-xl font-medium">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              className="p-2 text-zinc-600 border border-zinc-600 rounded-lg"
              placeholder="e.g Zurixmedia"
              onChange={(e) => {
                setProjectName(e.target.value)
              }}
            />
          </div>
          <div className="">
            <label htmlFor="catergory" className="text-xl font-medium">
              Catergory
            </label>
            <div className="space-y-1 mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setCatergory("AI");
                }}
              >
                <div
                  className={`${catergory === "AI" ? " bg-black border-zinc-400" : "bg-white border-black"} w-3 h-3 border-2 rounded-full`}
                />
                <p className="text-lg font-medium">AI</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setCatergory("Fintech");
                }}
              >
                <div
                  className={`${catergory === "Fintech" ? " bg-black border-zinc-400" : "bg-white border-black"} w-3 h-3 border-2 rounded-full`}
                />
                <p className="text-lg font-medium">Fintech</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setCatergory("Health");
                }}
              >
                <div
                  className={`${catergory === "Health" ? " bg-black border-zinc-400" : "bg-white border-black"} w-3 h-3 border-2 rounded-full`}
                />
                <p className="text-lg font-medium">Health</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setCatergory("Dev tools");
                }}
              >
                <div
                  className={`${catergory === "Dev tools" ? " bg-black border-zinc-400" : "bg-white border-black"} w-3 h-3 border-2 rounded-full`}
                />
                <p className="text-lg font-medium">Dev tools</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setCatergory("Web 3");
                }}
              >
                <div
                  className={`${catergory === "Web 3" ? " bg-black border-zinc-400" : "bg-white border-black"} w-3 h-3 border-2 rounded-full`}
                />
                <p className="text-lg font-medium">Web 3</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setCatergory("Other");
                }}
              >
                <div
                  className={`${catergory === "Other" ? " bg-black border-zinc-400" : "bg-white border-black"} w-3 h-3 border-2 rounded-full`}
                />
                <p className="text-lg font-medium">Other</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="projectDescription"
              className="text-xl font-medium"
            >
              Project Description
            </label>
            <textarea
            value={projectDesc}
            onChange={(e) => {setProjectDesc(e.target.value)}}
              name="projectDescription"
              className="p-2 text-zinc-600 border border-zinc-600 rounded-lg w-full h-30"
              placeholder="Short summary"
              id="projectDescription"
            ></textarea>
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

export default Page2;
