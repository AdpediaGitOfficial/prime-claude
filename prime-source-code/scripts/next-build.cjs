// Cross-platform `next build` launcher.
//
// The exFAT readlink workaround (scripts/exfat-readlink-fix.cjs) is only needed
// on Windows exFAT volumes. Preloading it on other platforms injects
// `--require` into the child process's exec args / NODE_OPTIONS, which Next's
// Turbopack workers (Next 16+) reject with ERR_WORKER_INVALID_EXEC_ARGV. So we
// only preload it on Windows; everywhere else `next build` runs clean.
const { spawn } = require("node:child_process");
const path = require("node:path");

const nextBin = path.join(__dirname, "..", "node_modules", "next", "dist", "bin", "next");
const nodeArgs = [];
if (process.platform === "win32") {
  nodeArgs.push("--require", path.join(__dirname, "exfat-readlink-fix.cjs"));
}

const child = spawn(process.execPath, [...nodeArgs, nextBin, "build"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
