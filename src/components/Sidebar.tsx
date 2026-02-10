"use client";
import { sidebarNav, projects } from "@/constants";
import { organizations } from "@/components/common/Navbar";
import { useSession } from "@/lib/auth-client";
import {
  ChevronsUpDown,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const Sidebar = () => {
  const currentPath = usePathname();
  const params = useParams();

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

  // Derive organization and project names from the URL slugs
  const currentOrg = organizations.find((o) => o.slug === orgSlug);
  // Find project by slug (assuming project name sluggified matches)
  const currentProject = projects.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
  );

  const organizationName =
    currentOrg?.name ||
    (orgSlug
      ? orgSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "Organization");
  const projectName =
    currentProject?.name ||
    (projectSlug
      ? projectSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "Project");

  if (isCollasped === null) return null;

  return (
    <div
      className={`${isCollasped ? "w-15 p-2.5 mx-auto" : "w-50 p-4"} border-r border-zinc-200 min-h-screen transition-all flex flex-col justify-between bg-white`}
    >
      <div className="">
        <div
          className={`flex items-center ${isCollasped ? "justify-center mt-2" : "justify-between"} group`}
        >
          <Link
            href={`/${orgSlug}/projects`}
            className={`flex items-center space-x-1 ${isCollasped ? "cursor-pointer" : ""}`}
          >
            <Image src="/neutral-logo.svg" alt="logo" width={25} height={25} />
            {!isCollasped && (
              <div className="">
                <p className="font-bold uppercase text-zinc-900">kiwiko</p>
              </div>
            )}
          </Link>

          {!isCollasped ? (
            <PanelLeftClose
              onClick={() => setIsCollasped((prev) => !prev)}
              width={27}
              height={27}
              className="cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 p-1 transition rounded-md"
            />
          ) : (
            <PanelLeftOpen
              onClick={() => setIsCollasped((prev) => !prev)}
              width={27}
              height={27}
              className="cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 p-1 transition rounded-md group-hover:flex hidden absolute top-4 left-5 bg-white border shadow-sm"
            />
          )}
        </div>

        {!isCollasped && (
          <div className="text-[10px] font-semibold py-1.5 px-2 text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-lg mt-6 flex items-center justify-between shadow-sm cursor-default hover:border-zinc-300 transition-colors">
            <p className="truncate uppercase tracking-tight">
              {organizationName} <span className="text-zinc-300 mx-1">/</span>{" "}
              {projectName}
            </p>
            <div className="text-zinc-400">
              <ChevronsUpDown size={10} />
            </div>
          </div>
        )}

        <div className="space-y-1 mt-6 font-medium">
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

      <div className="w-full pt-4 border-t border-zinc-100">
        {!isCollasped && (
          <div className="mb-4 px-1">
            <button className="flex items-center justify-center gap-2 bg-zinc-900 text-white font-semibold w-full py-2.5 text-xs rounded-xl cursor-pointer hover:bg-zinc-800 transition-all shadow-sm active:scale-95">
              <span>Share Update</span>
            </button>
          </div>
        )}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-2">
              <LoaderCircle className="animate-spin text-zinc-400" size={20} />
            </div>
          }
        >
          <div
            className={`flex items-center ${isCollasped ? "justify-center" : "space-x-3 px-1"}`}
          >
            {user?.image ? (
              <img
                src={user?.image as string}
                alt="user-profile"
                className="w-8 h-8 rounded-full border border-zinc-200 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center bg-zinc-100 text-zinc-600 font-bold text-sm shadow-sm">
                {altImage}
              </div>
            )}

            {!isCollasped && (
              <div className="flex-1 min-w-0">
                <p className="text-zinc-900 text-sm font-semibold truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default Sidebar;
