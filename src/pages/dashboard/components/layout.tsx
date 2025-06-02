import { ReactNode, FC } from "react";
import Appbar from "./appbar";
import Footer from "./footer";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gray-100">
      <Appbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
