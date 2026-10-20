import { $ } from "../lib/util";
import { save } from "../state";
import { I } from "../lib/icons";

export const PDFS = [{t:"IBME Quiz Bank - all 80 questions with answers",d:"25 pages - 332 KB - study compilation from the official PDFs, not an official NPTEL file",u:"pdfs/ibme-quiz-bank.pdf",f:"IBME-Quiz-Bank.pdf"},{t:"Week 1 - Assignment 1 Solutions (official NPTEL PDF)",d:"3 pages - 120 KB",u:"pdfs/week1-solution.pdf",f:"IBME-Week1-Solutions.pdf"},{t:"Week 2 - Assignment 2 Solutions (official NPTEL PDF)",d:"2 pages - 195 KB",u:"pdfs/week2-solution.pdf",f:"IBME-Week2-Solutions.pdf"},{t:"Week 3 - Assignment 3 Solutions (official NPTEL PDF)",d:"2 pages - 193 KB",u:"pdfs/week3-solution.pdf",f:"IBME-Week3-Solutions.pdf"},{t:"Week 4 - Assignment 4 Solutions (official NPTEL PDF)",d:"2 pages - 199 KB",u:"pdfs/week4-solution.pdf",f:"IBME-Week4-Solutions.pdf"},{t:"Week 5 - Assignment 5 Solutions (official NPTEL PDF)",d:"4 pages - 118 KB",u:"pdfs/week5-solution.pdf",f:"IBME-Week5-Solutions.pdf"},{t:"Week 6 - Assignment 6 Solutions (official NPTEL PDF)",d:"3 pages - 137 KB",u:"pdfs/week6-solution.pdf",f:"IBME-Week6-Solutions.pdf"},{t:"Week 7 - Assignment 7 Solutions (official NPTEL PDF)",d:"4 pages - 114 KB",u:"pdfs/week7-solution.pdf",f:"IBME-Week7-Solutions.pdf"},{t:"Week 8 - Assignment 8 Solutions (official NPTEL PDF)",d:"4 pages - 116 KB",u:"pdfs/week8-solution.pdf",f:"IBME-Week8-Solutions.pdf"}];

export function pgPdfs() {
  return `<h1 class="pg">Official PDFs</h1><p class="sub">The original NPTEL course PDFs these questions and answers come from. Open one in the browser or save it for offline.</p>
<div class="plist">${PDFS.map((p) => `<div class="pdfrow"><div class="pic">${I.book}</div><div class="pmeta"><b>${p.t}</b><span>${p.d}</span></div><div class="pacts"><a class="btn white g" href="${p.u}" target="_blank" rel="noopener">Open</a><a class="btn g" href="${p.u}" download="${p.f}">Save</a></div></div>`).join("")}</div>
<div style="color:var(--sub);font-size:13px;margin-top:14px">Wave transitions use the <a href="https://glimm.dev" target="_blank" rel="noopener" style="color:var(--blue-d)">glimm</a> library (MIT, (c) Noman Ijaz), installed from npm.</div>`;
}
