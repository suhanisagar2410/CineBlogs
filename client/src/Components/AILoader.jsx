import React from "react";
import { ScaleLoader } from "react-spinners";

export default function AILoader() {
  return (
    <div className="w-full h-screen flex flex-col justify-start mt-[6rem] items-center bg-gradient-to-b from-black via-[#14061F] to-black text-white">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold animate-pulse">
          🤖 Generating Your AI-Powered Content...
        </h1>
        <p className="text-lg md:text-xl mt-4 text-gray-300">
          Sit tight, this won't take long! Creativity is brewing.
        </p>
      </div>
      <div className="mt-10">
        <div className="relative w-48 h-48 rounded-full bg-gradient-to-r from-teal-400 via-purple-400 to-indigo-500 animate-spin">
          <div className="absolute inset-0 m-4 border-4 border-dashed border-white rounded-full"></div>
        </div>
        {/* <ScaleLoader color="#ffffff" height={50} className="mt-8" /> */}
      </div>
    </div>
  );
}
