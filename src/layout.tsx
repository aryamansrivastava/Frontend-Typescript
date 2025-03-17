import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex bg-gray-900  w-[90%] min-h-screen ">
      <div className="fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>

      <div className="flex-1 ml-16 md:ml-64 p-5">{children}</div>
    </div>
  );
};

export default AppLayout;
