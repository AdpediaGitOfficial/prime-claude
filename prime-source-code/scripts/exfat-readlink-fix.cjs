const fs = require("node:fs");

const preloadOption = "--require=./scripts/exfat-readlink-fix.cjs";

if (!process.env.NODE_OPTIONS?.includes(preloadOption)) {
  process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, preloadOption]
    .filter(Boolean)
    .join(" ");
}

// On Windows exFAT volumes, readlink() reports EISDIR for regular files.
// Next's file tracer expects the EINVAL result returned on NTFS instead.
if (process.platform === "win32") {
  const normalizeReadlinkError = (error) => {
    if (error && error.code === "EISDIR") {
      error.code = "EINVAL";
    }

    return error;
  };

  const originalCallbackReadlink = fs.readlink.bind(fs);
  const originalReadlinkSync = fs.readlinkSync.bind(fs);
  const originalReadlink = fs.promises.readlink.bind(fs.promises);

  fs.readlink = (...args) => {
    const callback = args.pop();

    return originalCallbackReadlink(...args, (error, linkString) => {
      callback(normalizeReadlinkError(error), linkString);
    });
  };

  fs.readlinkSync = (...args) => {
    try {
      return originalReadlinkSync(...args);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };

  fs.promises.readlink = async (...args) => {
    try {
      return await originalReadlink(...args);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };
}
