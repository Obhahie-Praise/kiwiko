"use client";
import { sidebarNav } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { LogOut, Settings, User, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Sidebar = () => {
  const currentPath = usePathname();
  const params = useParams();
  const router = useRouter();

  const orgSlug = params?.orgSlug as string;
  const projectSlug = params?.projectSlug as string;

  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const user = session?.user;

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    setIsCollapsed(stored === "true");
  }, []);

  useEffect(() => {
    if (isCollapsed === null) return;
    localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: isCollapsed }));
  }, [isCollapsed]);

  // Listen for collapse toggles from the nav bar
  useEffect(() => {
    const handle = (e: CustomEvent) => setIsCollapsed(e.detail);
    window.addEventListener("sidebar-toggle" as any, handle);
    return () => window.removeEventListener("sidebar-toggle" as any, handle);
  }, []);

  const handleSignOut = async () => {
    const { signOut } = await import("@/lib/auth-client");
    await signOut({ fetchOptions: { onSuccess: () => router.push("/sign-in") } });
  };

  if (isCollapsed === null) return null;

  return (
    <div
      className={`${isCollapsed ? "w-[52px]" : "w-56"} border-r border-zinc-100 h-screen transition-all duration-200 flex flex-col bg-white shrink-0`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-3 py-4 border-b border-zinc-100 ${isCollapsed ? "justify-center" : ""}`}>
        <Image
          src="/neutral-logo.svg"
          width={28}
          height={28}
          alt="Kiwiko"
          className="rounded-md shrink-0"
        />
        {!isCollapsed && (
          <div>
            <span className="font-black text-base tracking-tight text-zinc-900 leading-none">kiwiko</span>
            {(user as any)?.role && (
              <p className="text-[10px] text-zinc-400 capitalize leading-tight mt-0.5">{(user as any).role.toLowerCase()}</p>
            )}
          </div>
        )}
      </div>

      {/* Nav links */}
      <div className="px-2 py-3 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-0.5">
          {sidebarNav.map((item) => {
            let linkHref = `/${orgSlug}/${projectSlug}${item.href}`;
            let isActive = false;

            if (item.href === "/teams") {
              linkHref = `/${orgSlug}/${projectSlug}/teams/board`;
              const baseRoute = `/${orgSlug}/${projectSlug}${item.href}`;
              isActive = currentPath === baseRoute || currentPath.startsWith(`${baseRoute}/`);
            } else if (item.href === "/profile") {
              linkHref = `/${projectSlug}`;
              isActive = currentPath === linkHref || currentPath === `${linkHref}/mail`;
            } else if (item.label === "Settings") {
              const baseRoute = `/${orgSlug}/${projectSlug}`;
              isActive = currentPath === baseRoute;
              linkHref = baseRoute;
            } else {
              const baseRoute = `/${orgSlug}/${projectSlug}${item.href}`;
              isActive = currentPath === baseRoute || currentPath.startsWith(`${baseRoute}/`);
            }

            return (
              <Link
                href={linkHref}
                key={item.label}
                title={isCollapsed ? item.label : undefined}
                className={`relative flex items-center ${isCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"} gap-2.5 rounded-lg transition-all text-sm group ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
                }`}
              >
                <div className={`transition-colors shrink-0 ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-600"}`}>
                  <item.icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                </div>
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {item.badge && !isCollapsed && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 flex items-center justify-center text-white font-bold rounded-full bg-red-500">
                    {item.badge}
                  </span>
                )}
                {item.badge && isCollapsed && (
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User profile section */}
      <div className="border-t border-zinc-100 p-2 relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen((p) => !p)}
          className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-50 transition-colors group ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? (user?.name || "Profile") : undefined}
        >
          {/* Avatar */}
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-200"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-zinc-800 truncate leading-tight">{user?.name || "User"}</p>
                <p className="text-[10px] text-zinc-400 truncate leading-tight">{user?.email}</p>
              </div>
              <ChevronUp
                size={13}
                strokeWidth={1.5}
                className={`text-zinc-400 shrink-0 transition-transform duration-150 ${isProfileOpen ? "" : "rotate-180"}`}
              />
            </>
          )}
        </button>

        {/* Dropdown */}
        {isProfileOpen && (
          <div className={`absolute ${isCollapsed ? "left-14 bottom-2" : "bottom-[calc(100%+4px)] left-2 right-2"} bg-white border border-zinc-200 rounded-xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 z-50`}>
            {!isCollapsed && (
              <div className="px-3 py-2 border-b border-zinc-50 mb-1">
                <p className="text-xs font-semibold text-zinc-800">{user?.name}</p>
                <p className="text-[10px] text-zinc-400">{user?.email}</p>
              </div>
            )}
            <div className="space-y-0.5">
              <Link
                href={`/${orgSlug}/settings`}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-600 hover:bg-zinc-50 transition-colors w-full"
              >
                <Settings size={13} strokeWidth={1.5} />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={13} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
