"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "auto"
    });

    // Optional: reset body margin/padding if layout issue
    document.body.style.marginTop = "0px";
  }, [pathname]);

  return <>{children}</>;
}
