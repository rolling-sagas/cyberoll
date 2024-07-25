"use client";

import {
  CinnamonRollIcon,
  CrownIcon,
  FavouriteIcon,
  Home02Icon,
  Menu08Icon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/react";

import Link from "next/link";

import "./navbar.css";
import NavButton from "./nav-button";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import PinButton from "./pin-button";

export default function NavBar() {
  const pathname = usePathname();
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (pathname === "/") {
      setActive("home");
    } else if (pathname.startsWith("/search")) {
      setActive("search");
    } else {
      setActive(null);
    }
  }, [pathname]);

  return (
    <div className="navbar">
      <Link className="logo" href="/">
        <CinnamonRollIcon strokeWidth="2.5" />
      </Link>
      <div className="nav flex-1">
        <NavButton href="/">
          <Home02Icon
            strokeWidth="2"
            variant={active === "home" ? "solid" : "stroke"}
            className={active === "home" ? "!text-rs-text" : ""}
          />
        </NavButton>
        <NavButton href="/">
          <Search01Icon
            strokeWidth={active === "search" ? "3" : "2"}
            className={active === "search" ? "!text-rs-text" : ""}
          />
        </NavButton>
        <NavButton href="/">
          <FavouriteIcon strokeWidth="2" />
        </NavButton>
        <NavButton href="/">
          <UserIcon strokeWidth="2" />
        </NavButton>
      </div>
      <div className="nav mb-6">
        <PinButton />
        <NavButton href="/">
          <CrownIcon
            strokeWidth="2"
            className="!text-amber-500"
            variant="duotone"
          />
        </NavButton>
        <NavButton href="/">
          <Menu08Icon strokeWidth="2" />
        </NavButton>
      </div>
    </div>
  );
}
