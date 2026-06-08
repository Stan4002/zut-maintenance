export const manifest = {
  screens: {
    scr_r6bdvn: { name: "Login", route: "/login", position: { "x": 160, "y": 220 } },
    scr_yopu1k: { name: "Register", route: "/register", position: { "x": 1560, "y": 220 } },
    scr_lp6ggc: { name: "My Reports", route: "/my-reports", position: { "x": 160, "y": 2200 } },
    scr_ry8yb0: { name: "Submit Report", route: "/submit", position: { "x": 1560, "y": 2200 } },
    scr_zxp9rd: { name: "Admin Dashboard", route: "/dashboard", position: { "x": 160, "y": 4180 } }
  },
  sections: {
    sec_ljab88: { name: "Authentication flow", x: 0, y: 0, width: 2920, height: 1180 },
    sec_roellh: { name: "Reports workflow", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_wxlepu: { name: "Admin section", x: 0, y: 3960, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_ljab88", children: [
    { kind: "screen", id: "scr_r6bdvn" },
    { kind: "screen", id: "scr_yopu1k" }]
  },
  { kind: "section", id: "sec_roellh", children: [
    { kind: "screen", id: "scr_lp6ggc" },
    { kind: "screen", id: "scr_ry8yb0" }]
  },
  { kind: "section", id: "sec_wxlepu", children: [
    { kind: "screen", id: "scr_zxp9rd" }]
  }]

};