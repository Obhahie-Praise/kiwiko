import FundingDashboard from "@/components/FundingDashboard";
import Sidebar from "@/components/Sidebar";
import { BanknoteArrowUp, Search } from "lucide-react";
import React from "react";

const FundingPage = () => {
  return (
    <div className="">
      <nav className="px-3 py-2 flex items-center justify-between w-full">
        <div className="">
          <h1 className="text-xl uppercase font-bold italic text-zinc-900">Funding</h1>
        </div>
        <div className="">
          {/* <form
          action={""}
          className="py-1.5 px-3 focus:outline-2 focus:outline-zinc-300 rounded-lg flex items-center gap-2"
        >
          <Search width={15} height={15} className="text-zinc-500" />
          <input
            type="text"
            className="focus:outline-none placeholder:text-zinc-500 placeholder:text-sm text-sm text-zinc-700"
            placeholder="Search startups..."
          />
        </form> */}
        </div>
      </nav>
      <FundingDashboard />
    </div>
  );
};

export default FundingPage;