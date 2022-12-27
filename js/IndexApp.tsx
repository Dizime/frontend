import React, { StrictMode, useState, useEffect } from "react";
import Header from "./components/Header";
import { TypeAnimation } from "react-type-animation";
import Button from './components/Button';
import { Colors } from "./interfaces/Common";

export default function IndexApp() {
  return (
    <StrictMode>
      <div className="bg-gradient-2 h-full text-white">
        <Header />
        <h1 className="font-display pt-12 text-9xl text-center">Chat over the world</h1>
        <p className="pt-4 text-center text-xl">The open source project Dizime allows free communication between people around the world or among friends for&nbsp;
          <TypeAnimation
            sequence={[
              "You",
              "Your friends",
              "Your family",
              "Your colleagues",
              "Your classmates",
              "Your community",
              "Your country",
              "Your continent",
              "Your planet",
              "Your galaxy",
              "Your universe",
              "Your multiverse",
              "Your omniverse",
            ].map((text) => [`${text}.`, 1300, "", 300]).flat()}
            cursor={true}
            speed={45}
            wrapper="span"
            repeat={Infinity}
          /></p>
          <div className="flex justify-center">
            <Button text="Get started" id="get-started" priority={Colors.PRIMARY} type="button" onClick={() => window.location.href = "/download"} />
            <Button text="Open in Browser" id="openinbrowser" priority={Colors.SECONDARY} type="button" onClick={() => window.location.href = "/login"} />
          </div>
      </div>
    </StrictMode>
  )
}