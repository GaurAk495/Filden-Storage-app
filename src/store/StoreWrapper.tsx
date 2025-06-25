"use client";

import { useEffect } from "react";
import { useUserStore } from "./userStore";

function StoreWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}

export default StoreWrapper;
