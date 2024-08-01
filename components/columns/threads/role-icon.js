import { RoboticIcon, UserCircle02Icon, Wrench01Icon } from "@hugeicons/react";

export default function RoleIcon({ role }) {
  if (role === "system") {
    return <Wrench01Icon />;
  }
  if (role === "assistant") {
    return <RoboticIcon />;
  }
  if (role === "user") {
    return <UserCircle02Icon />;
  }
}
