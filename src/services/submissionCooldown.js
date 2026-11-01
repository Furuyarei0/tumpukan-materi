import { SUBMISSION_COOLDOWN_MS } from "../lib/config.js";

let lastSubmissionAt = 0;

export function getSubmissionCooldownRemaining(now = Date.now()) {
  return Math.max(0, lastSubmissionAt + SUBMISSION_COOLDOWN_MS - now);
}

export function recordSuccessfulSubmission(now = Date.now()) {
  lastSubmissionAt = now;
}
