"use client";
import { sidebarNav } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { PanelLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
  const [isCollasped, setIsCollasped] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const altImage = user?.name.charAt(0).toUpperCase();
  return (
    <div
      className={`fixed top-0 left-0 ${isCollasped ? "w-15 p-1 mx-auto" : "w-50 p-4"} border-r border-zinc-200 min-h-screen transition-all`}
    >
      <div className="">
        <div
          className={`flex items-center  ${isCollasped ? "justify-center mt-2" : "justify-between"} group`}
        >
          <h1
            className={`flex items-center space-x-1 font-semibold text-xl ${isCollasped ? "cursor-ew-resize group-hover:hidden" : ""}`}
          >
            <Image src="neutral-logo.svg" alt="logo" width={25} height={25} />
            {!isCollasped && <p className="">kiwiko</p>}
          </h1>
          <PanelLeft
            onClick={() => {
              setIsCollasped(!isCollasped);
            }}
            width={28}
            height={28}
            className={`cursor-ew-resize text-zinc-600 hover:bg-zinc-200 p-1 transition rounded-md ${isCollasped ? "group-hover:flex hidden" : ""}`}
          />
        </div>
        <div className="space-y-1 mt-7 font-medium">
          {sidebarNav.map((item) => {
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center ${isCollasped ? "justify-center py-2.5" : "py-1"} gap-3 px-2 rounded-lg hover:bg-zinc-200 transition`}
              >
                <item.icon className="w-5 h-5 text-zinc-600" />
                {isCollasped ? "" : <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
      <div  className="text-black mt-auto">
        <div className="flex">
          <div className="">{altImage}</div>
          <div className="">
            <p className="">{user?.name}</p>
            <span className="">{user?.email}</span>kjn
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
