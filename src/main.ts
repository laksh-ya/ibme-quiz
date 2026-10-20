import { createElement, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GlimmProvider, useGlimm } from "glimm/react";
import { accentChain } from "glimm";

const limePalette = accentChain(["#A2E838", "#58CC02", "#85CC38"]);
import "./styles/index.css";
import { mount } from "./app";
import { startUpdateCheck } from "./lib/update";
import { setWaveDriver } from "./lib/wave";
import questions from "./data/questions.json";
import w1q3 from "./assets/w1q3.png";
import w1q9 from "./assets/w1q9.png";
import w2q2 from "./assets/w2q2.png";
import w4q10 from "./assets/w4q10.png";

function App() {
  const container = useRef<HTMLDivElement>(null);
  const { sweep } = useGlimm();
  useEffect(() => {
    setWaveDriver(sweep);
    return mount(container.current!, questions, { w1q3, w1q9, w2q2, w4q10 });
  }, [sweep]);
  return createElement("div", { ref: container });
}
startUpdateCheck();
createRoot(document.getElementById("root")!).render(
  createElement(GlimmProvider, { palette: limePalette, zIndex: 10002, children: createElement(App) })
);
