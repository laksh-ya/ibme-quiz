import "./styles/index.css";
import { mount } from "./app";
import { startUpdateCheck } from "./lib/update";
import questions from "./data/questions.json";
import w1q3 from "./assets/w1q3.png";
import w1q9 from "./assets/w1q9.png";
import w2q2 from "./assets/w2q2.png";
import w4q10 from "./assets/w4q10.png";

startUpdateCheck();
mount(document.getElementById("root")!, questions, { w1q3, w1q9, w2q2, w4q10 });
