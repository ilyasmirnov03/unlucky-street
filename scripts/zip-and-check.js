import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const folder = path.resolve("./dist");
const output = path.resolve("./dist.zip");

const LIMIT = 13 * 1024; // 13 KB in bytes

let deleteZip = true;
const args = process.argv.slice(2);
if (args.includes('save-zip')) {
  deleteZip = false;
  console.log('Using save-zip option, will not delete final zip.');
}

try {
  // Create the zip archive (overwrite if exists)
  execSync(`zip -r -q ${output} ${folder}`, { stdio: "inherit" });

  // Check the size of the archive
  const stats = fs.statSync(output);
  const sizeInBytes = stats.size;
  const sizeInKB = sizeInBytes / 1024;

  console.log(`Created ${output} (${sizeInBytes} bytes, ~${sizeInKB.toFixed(2)} KB)`);

  // Validate against limit
  if (sizeInBytes > LIMIT) {
    throw new Error(
      `❌ Archive size exceeds 13 KB. Current size: ${sizeInBytes} bytes`
    );
  }

  console.log("✅ Archive size is within 13 KB limit.");
} catch (err) {
  console.error(err.message);
  process.exitCode = 1; // mark script as failed
} finally {
  // Always remove the zip file
  if (deleteZip && fs.existsSync(output)) {
    fs.unlinkSync(output);
    console.log(`🗑️ Deleted temporary archive: ${output}`);
  }
}

