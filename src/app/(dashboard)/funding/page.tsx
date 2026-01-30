import Sidebar from "@/components/Sidebar";
import { BanknoteArrowUp, Search } from "lucide-react";
import React from "react";

const FundingPage = () => {
  return (
    <div className="">
      <nav className=" px-3 py-2 flex items-center justify-between w-full">
        <div className="">
          <h1 className="text-lg font-semibold text-zinc-900">Funding</h1>
          <p className="text-sm text-zinc-500">
            Start and track funding process for your startup
          </p>
        </div>
        <div className="">
          <button className="flex items-center gap-2 text-sm text-white bg-black py-1.5 px-3 rounded-lg">
            <BanknoteArrowUp width={18} height={18} strokeWidth={1.8} />
            <p className="">Start funding round</p>
          </button>
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
    </div>
  );
};

export default FundingPage;
