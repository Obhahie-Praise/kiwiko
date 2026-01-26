import { submitSetup } from "@/lib/actions/server-actions";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page3 = ({
  position,
  userRole,
  startupName,
  startupDesc,
  niche,
  stage,
  firstUpdateTitle,
  setfirstUpdateTitle,
  firstUpdateDesc,
  setfirstUpdateDesc,
}: {
  position: string;
  stage: string;
  niche: string;
  userRole: string;
  firstUpdateTitle: string;
  setfirstUpdateTitle: React.Dispatch<React.SetStateAction<string>>;
  firstUpdateDesc: string;
  setfirstUpdateDesc: React.Dispatch<React.SetStateAction<string>>;
  startupName: string;

  startupDesc: string;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const isComplete = firstUpdateTitle != "" && firstUpdateDesc != "";
  const completed = isComplete;
  const info = {
    userRole,
    startupName,
    startupDesc,
    stage,
    niche,
    firstUpdateTitle,
    firstUpdateDesc,
  };
  console.log(info);
  return (
    <div className="flex justify-center my-20 overflow-y-hidden h-screen">
      <div className="">
        <h1 className="text-4xl font-semibold bg-linear-to-b text-center from-zinc-300 to-zinc-700 bg-clip-text text-transparent">
          Executions speaks louder than clout!
        </h1>
        <h2 className="text-xl font-medium text-center">
          SHare the latest update to get you started
        </h2>
        <div className="mx-30 space-y-3 mt-10">
          <div className="flex flex-col space-y-1">
            <label htmlFor="update-title" className="font-medium">
              Update Title
            </label>
            <input
              type="text"
              placeholder="What did you update?"
              value={firstUpdateTitle as string}
              onChange={(e) => setfirstUpdateTitle(e.target.value)}
              id="update-title"
              className="border border-zinc-500 p-2 rounded-lg focus:outline-2 outline-zinc-300 transition-all"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="update-desc" className="font-medium">
              Short Description
            </label>
            <textarea
              placeholder="Could you describe it?"
              value={firstUpdateDesc as string}
              onChange={(e) => setfirstUpdateDesc(e.target.value)}
              id="update-desc"
              className="border border-zinc-500 p-2 rounded-lg focus:outline-2 outline-zinc-300 transition-all"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2">
        <div className=" flex items-center gap-10">
          <Link
            href={`/onboarding/setup?page=${Number(position) - 1}`}
            className="flex items-center font-medium bg-zinc-300 border border-zinc-400 rounded-full  py-2 px-3"
          >
            <ChevronLeft />
            <p className="">Prev</p>
          </Link>
          <button
            onClick={ async () => {
              const result = await submitSetup({
                userRole,
                startupName,
                startupDesc,
                stage,
                niche,
                firstUpdateTitle,
                firstUpdateDesc,
                completed,
              });
              setIsSubmiting(true);

              if (!result.success) {
                setError(result.error)
                return
              }

              redirect("/onboarding/setup?page=4")
            }}
            className={`flex items-center font-medium bg-black border border-black text-white rounded-full  py-2 px-3 ${
              isComplete ? "cursor-pointer" : "opacity-20 cursor-not-allowed"
            }`}
          >
            <p className="">Finish</p>
            <ChevronRight />
          </button>
        </div>
        <p className="flex items-center justify-center mt-20">
          {isSubmiting ? (
            <LoaderCircle className="animate-spin text-zinc-600" />
          ) : null }
        </p>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    </div>
  );
};

export default Page3;
