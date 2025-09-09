import fs from 'fs';
import path from 'path';

// Define the structure of a log entry
interface LogEntry {
  ts: string;
  method: string;
  url: string;
  status?: number;
  duration_ms?: number;
  error?: string;
}

const logDir = path.join(process.cwd(), 'server/logs');
const traceFile = path.join(logDir, 'http_trace.jsonl');

/**
 * Ensures the log directory exists and appends a log entry to the trace file.
 * @param entry - The log entry object to append.
 */
export function logTrace(entry: LogEntry) {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Append the JSON line to the file
    fs.appendFileSync(traceFile, JSON.stringify(entry) + '\n');
  } catch (e) {
    // If logging to file fails, log the error to the console
    console.error('Failed to write to trace file:', e);
  }
}
