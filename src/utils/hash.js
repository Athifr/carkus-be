import { createHash as _createHash } from "crypto";

/**
 * Create a sha256 hash of a string
 * @param {string} str
 * @returns {string}
 */
export function createHash(str) {
  return _createHash("sha256").update(str).digest("hex");
}
