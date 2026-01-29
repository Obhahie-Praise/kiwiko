"use client";

import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

const steps = [1, 2, 3, 4];

const ProgressLine = () => {
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("page"));
  console.log(currentStep)

  return (
    <div>
      <div
        className={`${currentStep == 1 ? "w-150" : "w-80"}  h-1 bg-zinc-300 rounded-full flex items-center justify-between transition-all`}
      >
        <div
          className={`
                transition-all h-full ${currentStep == 1 ? " w-[11.11%]" : currentStep == 2 ? " w-[22.22%]" : currentStep == 3 ? " w-[33.33%]" : currentStep == 4 ? " w-[44.44%]" : currentStep == 5 ? " w-[55.55%]" : currentStep == 6 ? " w-[66.66%]" : currentStep == 7 ? " w-[77.77%]": currentStep == 8 ? " w-[88.88%]": "w-full"} bg-black
              `}
        ></div>
      </div>
    </div>
  );
};

export default ProgressLine;
