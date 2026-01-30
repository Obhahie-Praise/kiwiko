import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page3 = ({
  position,
  userRole,
  theProblem,
  setTheProblem,
  theSolution,
  setTheSolution,
}: {
  position: string;
  userRole: string;
  theProblem: string;
  theSolution: string;
  setTheProblem: React.Dispatch<React.SetStateAction<string>>;
  setTheSolution: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const isComplete = theProblem && theSolution ? true : false;
  const info = {
    userRole,
    theProblem,
    theSolution,
  };
  console.log(info);
  return (
    <div className="min-h-screen flex items-center">
      <div className="flex items-center justify-center flex-1">
        <Image src="/page-3.svg" width={766} height={750} alt="page-1-main" />
      </div>
      <div className="bg-white w-120 min-h-screen relative">
        <div className="mb-10 mt-20 px-6 space-y-20">
          <div className="flex flex-col space-y-2">
            <label htmlFor="the-problem" className="text-xl font-medium">
              What problem does this solve?
            </label>
            <textarea
              value={theProblem}
              onChange={(e) => {
                setTheProblem(e.target.value);
              }}
              name="the-problem"
              id="the-problem"
              className="p-2 text-zinc-600 border border-zinc-600 rounded-lg w-full h-30"
              placeholder="The problem is ..."
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="the-solution" className="text-xl font-medium">
              How are you solving it?
            </label>
            <textarea
              value={theSolution}
              onChange={(e) => {
                setTheSolution(e.target.value);
              }}
              name="the-solution"
              className="p-2 text-zinc-600 border border-zinc-600 rounded-lg w-full h-30"
              placeholder="The solution is ..."
              id="the-solution"
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

export default Page3;
