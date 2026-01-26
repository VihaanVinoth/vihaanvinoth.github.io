import fs from "fs";
import path from "path";

const version = "4.3";
const htmlFiles = fs.readdirSync("public").filter(f => f.endsWith(".html"));

for (const file of htmlFiles) {
  const filePath = path.join("public", file);
  let content = fs.readFileSync(filePath, "utf-8");
  content = content.replace(/style\.css\?v=\d+(\.\d+)?/g, `style.css?v=${version}`);
  fs.writeFileSync(filePath, content);
}
console.log("Updated CSS version in all HTML files.");
