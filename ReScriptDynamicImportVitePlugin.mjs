import fs from "fs";
import path from "path";
import readline from "readline";

// Expected to run in vite.config.js folder, right next to bsconfig.
let cwd = process.cwd();

let findGeneratedModule = (moduleName) => {
  return new Promise((resolve, reject) => {
    let s = fs.createReadStream(path.resolve(cwd, "./lib/bs/build.ninja"));

    let rl = readline.createInterface({
      input: s,
      terminal: false,
    });

    let hasReachedModuleInFile = false;
    let found = false;

    rl.on("line", (line) => {
      // Only look at `o` (output) lines as our "when past module" logic may get confused
      // by other things interjected.
      if (!line.startsWith("o")) {
        return;
      }

      let lineIsForModule = line.includes(`/${moduleName}.`);

      // Close as soon as we've walked past all lines concerning this module. The log
      // groups all lines concerning a specific module, so we can safely say that
      // whenever we see a new module after looping through the old one, we don't need
      // to look more.
      if (hasReachedModuleInFile && !lineIsForModule) {
        s.close();
        rl.close();
        // Prevent subsequent `line` events from firing.
        rl.removeAllListeners();
        return;
      }

      if (lineIsForModule && !hasReachedModuleInFile) {
        hasReachedModuleInFile = true;
      }

      if (lineIsForModule) {
        let [relativePathToGeneratedModule] =
          / (\.\.\/.*js) /g.exec(line) ?? [];

        if (relativePathToGeneratedModule) {
          found = true;
          resolve(
            path.resolve(cwd, "./lib/bs", relativePathToGeneratedModule.trim())
          );
        }
      }
    });

    rl.on("close", () => {
      if (!found) {
        reject(new Error(`Module '${moduleName}' not found.`));
      }
    });
  });
};

export let ReScriptDynamicImportVitePlugin = () => {
  return {
    name: "rescript-dynamic-import-vite-plugin",
    async resolveId(id) {
      if (id != null && id.startsWith("@rescriptModule/")) {
        let moduleName = id.split("@rescriptModule/")[1];
        let loc = await findGeneratedModule(moduleName);

        if (loc != null) {
          return { id: loc };
        }
      }
    },
  };
};
