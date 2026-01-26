"use client";
import { sidebarNav } from "@/constants";
import { useSession } from "@/lib/auth-client";
import {
  LoaderCircle,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Sidebar = () => {
  const currentPath = usePathname();
  const [isCollasped, setIsCollasped] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const altImage = user?.name.charAt(0).toUpperCase();
  const truncateEmail =
    String(user?.email).length > 15
      ? String(user?.email).slice(0, 15).padEnd(22, " . . . ")
      : String(user?.email);
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    setIsCollasped(stored === "true");
  }, []);
  useEffect(() => {
    if (isCollasped === null) return;
    localStorage.setItem("sidebar-collapsed", String(isCollasped));
  }, [isCollasped]);
  if (isCollasped === null) return null;

  return (
    <div
      className={`${isCollasped ? "w-15 p-2.5 mx-auto" : "w-50 p-4"} min-h-screen transition-all flex flex-col justify-between`}
    >
      <div className="">
        <div
          className={`flex items-center  ${isCollasped ? "justify-center mt-2" : "justify-between"} group`}
        >
          <h1
            className={`flex items-center space-x-1 font-semibold text-xl ${isCollasped ? "cursor-ew-resize group-hover:hidden" : ""}`}
          >
            <Image src="neutral-logo.svg" alt="logo" width={28} height={28} />
            {!isCollasped && <p className="">kiwiko</p>}
          </h1>
          {!isCollasped ? (
            <PanelLeftClose
              onClick={() => setIsCollasped((prev) => !prev)}
              width={28}
              height={28}
              className={`cursor-ew-resize text-zinc-600 hover:bg-zinc-200 p-1 transition rounded-md ${isCollasped ? "group-hover:flex hidden" : ""}`}
            />
          ) : (
            <PanelLeftOpen
              onClick={() => setIsCollasped((prev) => !prev)}
              width={28}
              height={28}
              className={`cursor-ew-resize text-zinc-600 hover:bg-zinc-200 p-1 transition rounded-md ${isCollasped ? "group-hover:flex hidden" : ""}`}
            />
          )}
        </div>
        <div className="space-y-1 mt-7 font-medium">
          {sidebarNav.map((item) => {
            const isActive = item.href === currentPath;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`relative flex items-center ${isCollasped ? "justify-center py-2.5" : "py-1.5"} gap-3 px-2 rounded-lg hover:bg-zinc-200 transition text-sm ${isActive ? "bg-black text-white hover:bg-zinc-800 transition" : ""}`}
              >
                <item.icon
                  className={`w-4.5 h-4.5 ${isActive ? "text-zinc-300" : "text-zinc-600"}`}
                />
                {isCollasped ? "" : <span>{item.label}</span>}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 text-[8px] w-4 h-4 flex items-center justify-center text-white rounded-full bg-red-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="text-black w-full">
        {isCollasped ? (
          ""
        ) : (
          <div className="mb-5">
            <button className="text-center bg-black text-white font-medium w-full py-2 text-sm rounded-xl cursor-pointer hover:bg-zinc-800 transition">
              Share an Update
            </button>
          </div>
        )}
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <LoaderCircle className="animate-spin" />
            </div>
          }
        >
          <div className="flex space-x-2 items-center">
            {user?.image ? (
              <img
                src={user?.image as string}
                alt="user-profile"
                className="w-10 h-10 rounded-full border-2 border-zinc-400 flex items-center justify-center"
              />
            ) : (
              <div className="px-3 h-10 rounded-full border-2 border-zinc-400 flex items-center justify-center bg-black text-white font-bold text-xl">
                {altImage}
              </div>
            )}

            {isCollasped ? (
              ""
            ) : (
              <div className="">
                <p className="text-zinc-700 text-sm font-medium capitalize">
                  {user?.name}
                </p>
                <span className="text-xs text-zinc-400 truncate">
                  {truncateEmail}
                </span>
              </div> 
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Sidebar;
