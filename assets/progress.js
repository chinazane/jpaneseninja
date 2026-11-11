/* ほしことば Hoshikotoba — shared local progress store.
   Plain script: exposes window.HK. Progress lives in this browser only
   (localStorage, no accounts). Shape:
   { words:{n5:[idx,...],...}, kanji:{...}, wrong:{n5:[idx,...]},
     days:{"2026-11-11":count,...}, lastDay:"YYYY-MM-DD", streak:0 } */
(function (global) {
  "use strict";

  var KEY = "hoshikotoba.progress.v1";
  var LEVELS = ["n5", "n4", "n3", "n2", "n1"];

  /* ---------- dates (local time) ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayKey() { return dayKey(new Date()); }
  function yesterdayKey() { var d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); }

  /* ---------- load / save (defensive) ---------- */
  function defaults() { return { words: {}, kanji: {}, wrong: {}, days: {}, lastDay: "", streak: 0 }; }

  function cleanArr(a) {
    var seen = {}, out = [];
    if (!Array.isArray(a)) return out;
    for (var i = 0; i < a.length; i++) {
      var v = a[i];
      if (typeof v === "number" && isFinite(v) && v >= 0) {
        v = Math.floor(v);
        if (!seen[v]) { seen[v] = 1; out.push(v); }
      }
    }
    return out;
  }

  function load() {
    var d = defaults();
    try {
      var raw = global.localStorage.getItem(KEY);
      if (!raw) return d;
      var p = JSON.parse(raw);
      if (!p || typeof p !== "object") return d;
      ["words", "kanji", "wrong"].forEach(function (kind) {
        if (p[kind] && typeof p[kind] === "object") {
          LEVELS.forEach(function (lv) {
            if (Array.isArray(p[kind][lv])) d[kind][lv] = cleanArr(p[kind][lv]);
          });
        }
      });
      if (p.days && typeof p.days === "object") {
        for (var k in p.days) {
          if (Object.prototype.hasOwnProperty.call(p.days, k) &&
              typeof p.days[k] === "number" && isFinite(p.days[k]) && p.days[k] > 0) {
            d.days[k] = Math.floor(p.days[k]);
          }
        }
      }
      if (typeof p.lastDay === "string") d.lastDay = p.lastDay;
      if (typeof p.streak === "number" && isFinite(p.streak) && p.streak >= 0) d.streak = Math.floor(p.streak);
    } catch (e) { /* corrupted storage -> start fresh */ }
    return d;
  }

  var S = load();

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full/blocked: keep in-memory */ }
  }

  function bucket(kind, lv) {
    if (!S[kind][lv]) S[kind][lv] = [];
    return S[kind][lv];
  }
  function has(kind, lv, idx) { return bucket(kind, lv).indexOf(idx) >= 0; }
  function add(kind, lv, idx) {
    var a = bucket(kind, lv);
    if (a.indexOf(idx) < 0) { a.push(idx); save(); }
  }
  function remove(kind, lv, idx) {
    var a = bucket(kind, lv), i = a.indexOf(idx);
    if (i >= 0) { a.splice(i, 1); save(); }
  }

  /* ---------- public API ---------- */
  var HK = {
    LEVELS: LEVELS.slice(),

    /* words */
    isWordLearned: function (level, idx) { return has("words", level, idx); },
    markWordLearned: function (level, idx) { add("words", level, idx); },
    wordLearnedCount: function (level) { return bucket("words", level).length; },
    learnedWords: function (level) { return bucket("words", level).slice(); },

    /* kanji (same store, for the atlas pages) */
    isKanjiLearned: function (level, idx) { return has("kanji", level, idx); },
    markKanjiLearned: function (level, idx) { add("kanji", level, idx); },
    kanjiLearnedCount: function (level) { return bucket("kanji", level).length; },

    /* wrong-answer notebook (words) */
    addWrong: function (level, idx) { add("wrong", level, idx); },
    removeWrong: function (level, idx) { remove("wrong", level, idx); },
    isWrong: function (level, idx) { return has("wrong", level, idx); },
    wrongList: function (level) { return bucket("wrong", level).slice(); },
    wrongCount: function (level) { return bucket("wrong", level).length; },

    /* daily activity + streak */
    touchToday: function () {
      var t = todayKey();
      S.days[t] = (S.days[t] || 0) + 1;
      if (S.lastDay !== t) {
        S.streak = (S.lastDay === yesterdayKey()) ? (S.streak || 0) + 1 : 1;
        S.lastDay = t;
      }
      save();
    },
    streak: function () {
      /* a streak is only alive if the last active day was today or yesterday */
      if (S.lastDay === todayKey() || S.lastDay === yesterdayKey()) return S.streak || 0;
      return 0;
    },
    todayCount: function () { return S.days[todayKey()] || 0; },
    todayKey: todayKey,

    /* debugging / future use */
    dump: function () { return JSON.parse(JSON.stringify(S)); }
  };

  global.HK = HK;
})(window);
