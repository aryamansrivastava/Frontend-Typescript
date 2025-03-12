import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return <div className="max-w-7xl w-full mx-auto">{children}</div>;
};

export default AppLayout;
