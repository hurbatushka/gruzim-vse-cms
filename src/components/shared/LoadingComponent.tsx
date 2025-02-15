import React from "react";
import Loader from "../ui/Loader";

type LoadingC = {
  children: React.ReactNode;
  place: "up" | "down";
};

export default function LoadingComponent({ children, place = "up" }: LoadingC) {
  return (
    <div className="flex-col flex items-center justify-center h-screen">
      {place === "up" && <Loader radius={15.5} />}
      {children}
      {place === "down" && <Loader radius={15.5} />}
    </div>
  );
}
