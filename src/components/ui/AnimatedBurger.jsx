import React from "react";

export default function AnimatedBurger({ isOpen, toggleSidebar }) {
  return (
    <div
      className="absolute top-4 right-4 cursor-pointer text-black pt-4 pl-2 pr-2"
      onClick={toggleSidebar}
    >
      <div className="relative w-5 h-5">
        {/* Верхняя линия */}
        <span
          className={`block absolute h-0.5 w-full bg-black transform transition duration-300 ease-in-out
            ${isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"}`}
        ></span>
        {/* Средняя линия */}
        <span
          className={`block absolute h-0.5 w-full bg-black transition duration-300 ease-in-out
            ${isOpen ? "opacity-0" : "opacity-100"}`}
        ></span>
        {/* Нижняя линия */}
        <span
          className={`block absolute h-0.5 w-full bg-black transform transition duration-300 ease-in-out
            ${isOpen ? "-rotate-45 -translate-y-0" : "translate-y-1.5"}`}
        ></span>
      </div>
    </div>
  );
}
