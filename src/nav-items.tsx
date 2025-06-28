
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

export const navItems = [
  {
    title: "Home",
    to: "/",
    page: <Index />,
  },
  {
    title: "404", 
    to: "*",
    page: <NotFound />,
  },
];
