import Sidebar from "@/components/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <aside className="sticky top-0 h-screen">
        <Sidebar />
      </aside>
      <div className="overflow-y-auto min-h-screen">{children}</div>
    </div>
  );
};

export default layout;
