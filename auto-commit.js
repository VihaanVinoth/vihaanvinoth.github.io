import chokidar from "chokidar";
import { exec } from "child_process";

const FILE = "public/stylesheets/style.css";

console.log(`Watching ${FILE} for changes...`);

chokidar.watch(FILE, { ignoreInitial: true }).on("change", () => {
    const cmd = `
    git add ${FILE} &&
    git commit -m "Auto-update style.css" &&
    git push
    `;

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error("Git error:", stderr);
            return;
        }
        console.log("Auto-committed and pushed");
    })
})