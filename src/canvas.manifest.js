export const manifest = {
  screens: {
    scr_7ajfm5: { name: "Landing", route: "/", position: { "x": 160, "y": 220 } },
    scr_prb1ws: { name: "Join Meeting", route: "/join", position: { "x": 1560, "y": 220 } },
    scr_vkygru: { name: "Waiting Room", route: "/waiting", position: { "x": 2960, "y": 220 } },
    scr_8tyml8: { name: "Meeting Room", route: "/meeting", position: { "x": 160, "y": 2200 } },
    scr_u9m98f: { name: "Admin Dashboard", route: "/admin", position: { "x": 160, "y": 4180 } },
    scr_7e0qdb: { name: "Create Meeting", route: "/admin/create", position: { "x": 1560, "y": 4180 } },
    scr_nodce1: { name: "Schedule Meeting", route: "/admin/schedule", position: { "x": 2960, "y": 4180 } },
    scr_z09zds: { name: "Manage Meetings", route: "/admin/meetings", position: { "x": 4360, "y": 4180 } },
    scr_sp76f6: { name: "Recordings", route: "/admin/recordings", position: { "x": 5760, "y": 4180 } },
    scr_sq23s9: { name: "Analytics", route: "/admin/analytics", position: { "x": 7160, "y": 4180 } },
    scr_0a5chq: { name: "Control Panel", route: "/admin/control", position: { "x": 8560, "y": 4180 } },
    scr_6fi53b: { name: "Help Center", route: "/help", position: { "x": 160, "y": 6160 } }
  },
  sections: {
    sec_fbx5ls: { name: "User Entry Flow", x: 0, y: 0, width: 4320, height: 1180 },
    sec_zjqim8: { name: "Meeting Session", x: 0, y: 1980, width: 1520, height: 1180 },
    sec_uti0ii: { name: "Admin Management", x: 0, y: 3960, width: 9920, height: 1180 },
    sec_03dl5t: { name: "Support", x: 0, y: 5940, width: 1520, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_fbx5ls", children: [
    { kind: "screen", id: "scr_7ajfm5" },
    { kind: "screen", id: "scr_prb1ws" },
    { kind: "screen", id: "scr_vkygru" }]
  },
  { kind: "section", id: "sec_zjqim8", children: [
    { kind: "screen", id: "scr_8tyml8" }]
  },
  { kind: "section", id: "sec_uti0ii", children: [
    { kind: "screen", id: "scr_u9m98f" },
    { kind: "screen", id: "scr_7e0qdb" },
    { kind: "screen", id: "scr_nodce1" },
    { kind: "screen", id: "scr_z09zds" },
    { kind: "screen", id: "scr_sp76f6" },
    { kind: "screen", id: "scr_sq23s9" },
    { kind: "screen", id: "scr_0a5chq" }]
  },
  { kind: "section", id: "sec_03dl5t", children: [
    { kind: "screen", id: "scr_6fi53b" }]
  }]

};