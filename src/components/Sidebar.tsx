"use client";
import { sidebarNav, projects } from "@/constants";
import { useSession } from "@/lib/auth-client";
import {
  ChevronsUpDown,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Sidebar = () => {
  const currentPath = usePathname();
  const params = useParams();
  const router = useRouter();

  const orgSlug = params?.orgSlug as string;
  const projectSlug = params?.projectSlug as string;

  const [isCollasped, setIsCollasped] = useState(false);

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const altImage = user?.name.charAt(0).toUpperCase();
  const truncateEmail =
    String(user?.email).length > 20
      ? String(user?.email).slice(0, 20).padEnd(25, " . . . ")
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
      className={`${isCollasped ? "w-16" : "w-60"} border-r border-zinc-200 h-[calc(100vh-56px)] transition-all flex flex-col justify-between bg-white relative pt-4`}
    >
      <div className="px-3 flex-1 overflow-y-auto no-scrollbar">
        <div
          className={`flex items-center ${isCollasped ? "justify-center" : "justify-end mb-4"}`}
        >
          <button
            onClick={() => setIsCollasped((prev) => !prev)}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition rounded-lg"
          >
            {isCollasped ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <div className="space-y-1.5 font-medium">
          {sidebarNav.map((item) => {
            // Construct the dynamic href for the Link component
            let linkHref = `/${orgSlug}/${projectSlug}${item.href}`;
            let isActive = false;

            // Special cases
            if (item.href === "/teams") {
              linkHref = `/${orgSlug}/${projectSlug}/teams/board`;
              const baseRoute = `/${orgSlug}/${projectSlug}${item.href}`;
              isActive =
                currentPath === baseRoute ||
                currentPath.startsWith(`${baseRoute}/`);
            } else if (item.href === "/profile") {
              // Public profile is at /[projectSlug]
              linkHref = `/${projectSlug}`;
              isActive =
                currentPath === linkHref || currentPath === `${linkHref}/mail`;
            } else if (item.label === "Settings") {
              const baseRoute = `/${orgSlug}/${projectSlug}`;
              isActive = currentPath === baseRoute;
              linkHref = baseRoute;
            } else {
              const baseRoute = `/${orgSlug}/${projectSlug}${item.href}`;
              isActive =
                currentPath === baseRoute ||
                currentPath.startsWith(`${baseRoute}/`);
            }

            return (
              <Link
                href={linkHref}
                key={item.label}
                className={`relative flex items-center ${isCollasped ? "justify-center py-2.5" : "py-2"} gap-3 px-2.5 rounded-xl transition-all text-sm group ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <div
                  className={`transition-colors ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-700"}`}
                >
                  {" "}
                  <item.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>

                {!isCollasped && (
                  <span className="font-bold italic uppercase tracking-tight">
                    {item.label}
                  </span>
                )}
                {item.badge && !isCollasped && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 flex items-center justify-center text-white font-bold rounded-full bg-red-500">
                    {item.badge}
                  </span>
                )}
                {item.badge && isCollasped && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 border-t border-zinc-100">
        {!isCollasped && (
          <button className="flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold w-full py-2.5 text-xs rounded-xl cursor-pointer hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 active:scale-[0.98] uppercase italic tracking-wider">
            <span>Share Update</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
