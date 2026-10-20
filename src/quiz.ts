import { shuf } from "./lib/util";
import { S } from "./state";
import { I } from "./lib/icons";

export var Q = [];
export var IMGS = {};
export var qid = (q) => q.w + "-" + q.n;
export var stat = (q) => S.q[qid(q)] || (S.q[qid(q)] = { s: 0, r: 0, x: 0, m: 0 });
export var isMulti = (q) => q.ans.length > 1;
export var SAFE = /above|both|none of|all of|^[a-i][ -–]|^\(|^only|^example|^statement/i;
export var canShuffleOpts = (q) => !q.opts.some((o) => SAFE.test(o.trim()));
export var weekQs = (w) => Q.filter((q) => q.w === w);
export var wrongQs = () => Q.filter((q) => (S.q[qid(q)] || {}).m);
export var unseenQs = () => Q.filter((q) => !(S.q[qid(q)] || {}).s);
export var wkStat = (w) => {
  const b = S.best["w" + w];
  return b == null ? null : b;
};
export var MODES = [
  ["all", "All questions", "In order, week 1 to week 8.", I.all, "#1cb0f6"],
  ["shuffle", "Shuffle all", "Every question in random order, so nothing is memorised by position.", I.shuf, "#ce82ff"],
  ["daily", "Daily round", "Mistakes first, then unseen, then random. A quick daily round.", I.sun, "#ff9600"],
  ["mistakes", "Recent mistakes", "Everything you got wrong, across all weeks. Clear it to zero.", I.heartW, "#ff4b4b"],
  ["multi", "Multi-select only", "Questions with more than one correct option.", I.multi, "#58cc02"],
  ["single", "Single-answer only", "Questions with exactly one correct option.", I.one, "#2bd9c4"],
  ["unseen", "Not seen yet", "Only questions you have never answered.", I.new, "#ffc800"],
  ["boss", "Boss round", "20 random questions, quiz style, results at the end.", I.boss, "#a568cc"],
  ["hard", "Hard ones", "Questions you have missed more than once.", I.speed, "#ff86d0"]
];
export function modeList(k) {
  if (k === "all") return Q.slice();
  if (k === "shuffle") return shuf(Q);
  if (k === "mistakes") return shuf(wrongQs());
  if (k === "multi") return shuf(Q.filter(isMulti));
  if (k === "single") return shuf(Q.filter((q) => !isMulti(q)));
  if (k === "unseen") return shuf(unseenQs());
  if (k === "hard") return shuf(Q.filter((q) => (S.q[qid(q)] || {}).x > 1));
  if (k === "boss") return shuf(Q).slice(0, 20);
  if (k === "daily") {
    const o = [];
    [shuf(wrongQs()), shuf(unseenQs()), shuf(Q)].forEach((l) => l.forEach((q) => {
      if (o.length < 10 && !o.includes(q)) o.push(q);
    }));
    return o;
  }
  return [];
}
export var modeCount = (k) => k === "daily" ? 10 : k === "boss" ? 20 : modeList(k).length;
export function setData(data, images) {
  Q = data.map((q) => Object.assign({}, q, { ans: q.ans.slice() }));
  IMGS = images;
}
