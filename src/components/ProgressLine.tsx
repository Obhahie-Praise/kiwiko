"use client";

import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

const steps = [1, 2, 3, 4];

const ProgressLine = () => {
  const searchParams = useSearchParams();
  const currentStep = Number(searchParams.get("page")) || 1;

  return (
    <div>
      <div className="w-150 h-0.5 bg-black rounded-full flex items-center justify-between">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div
              key={step}
              className={`
                w-15 h-15 flex items-center justify-center rounded-full text-2xl font-semibold
                transition-all
                ${
                  isCompleted
                    ? "bg-black text-white"
                    : isCurrent
                    ? "bg-black text-white"
                    : "bg-zinc-100 text-black"
                }
              `}
            >
              {isCompleted ? <Check /> : step}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressLine;
