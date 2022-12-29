import React, { StrictMode } from "react";
import TransparentWhite from "../assets/images/transparentwhite.webp";

export default function AppApp() {
  return (
    <StrictMode>
      <div className="overflow-hidden h-full w-full">
        <div className="flex h-full w-full">
          <div id="guild-sidebar" className="w-18 h-full bg-dark-sidebar overflow-scroll">
            <div className="flex w-16 h-14 items-center mt-2">
              <div className="w-1/6 h-12">
                <span></span>
              </div>
              <div className="w-5/6 h-12 grid place-items-center">
                <div className="rounded-xl bg-dark-sideicon w-11 h-11">
                  <img src={TransparentWhite} alt="Direct Messages" className="w-11 h-11" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StrictMode>
  );
};