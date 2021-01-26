/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const projectRoot = path.resolve(__dirname, "..");

const pkg = require(path.resolve(__dirname, "package.json"));
const devPkg = require(path.resolve(projectRoot, "package.json"));

const pkgKeys = Object.keys(pkg);
const devPkgKeys = Object.keys(devPkg);

fs.copyFileSync(
  path.resolve(projectRoot, "README.md"),
  path.resolve(projectRoot, "dist/README.md")
);

fs.copyFileSync(
  path.resolve(projectRoot, "LICENSE"),
  path.resolve(projectRoot, "dist/LICENSE")
);

const packageData = pkg;
pkgKeys.forEach(value => {
  if (
    pkgKeys.includes(value) &&
    devPkgKeys.includes(value) &&
    !["scripts", "main", "types"].includes(value)
  ) {
    packageData[value] = devPkg[value];
  } else {
    packageData[value] = pkg[value];
  }
});

// 异步写入数据到文件
fs.writeFile(
  path.resolve(projectRoot, "dist/package.json"),
  JSON.stringify(packageData, null, 4),
  { encoding: "utf8" },
  err => err
);
