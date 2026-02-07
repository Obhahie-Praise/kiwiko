import NotificationsPage from "@/components/NotificationsPage";
import Sidebar from "@/components/Sidebar";
import React from "react";

const UpdatesPage = () => {
  return (
    <div className="">
      <nav className="px-3 py-2 flex items-center justify-between w-full">
        <div className="">
          <h1 className="text-lg font-semibold text-zinc-900">Notifications</h1>
        </div>
      </nav>{" "}
      <NotificationsPage />
    </div>
  );
};

export default UpdatesPage;