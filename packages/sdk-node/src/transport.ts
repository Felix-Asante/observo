import "dotenv/config";
import { ObservoLogInput, ObservoTransportOptions } from "./types.js";

export interface ObservoTransport {
  send(event: ObservoLogInput): Promise<void>;
}

function getEnv(name: string, defaultValue?: string) {
  return process.env[name] ?? defaultValue;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export class ObservoTransport {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly environment: string;
  private readonly appName: string;
  private readonly headers: Record<string, string>;
  private readonly logsBuffer: ObservoLogInput[] = [];
  private readonly bufferSize: number = 100;
  private readonly flushInterval: number = 2_000;
  private flushTimer: NodeJS.Timeout | null = null;
  private isFlushing: boolean = false;
  private shuttingDown: boolean = false;

  constructor(options: ObservoTransportOptions) {
    const apiBaseUrl = getEnv("API_URL", "");

    if (!isValidUrl(apiBaseUrl ?? "")) {
      throw new Error("Invalid base URL");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = apiBaseUrl || "";
    this.environment = options.environment ?? "development";
    this.appName = options.appName ?? "default";
    this.bufferSize = options.bufferSize ?? 100;
    this.flushInterval = options.flushInterval ?? 2_000;
    this.headers = {
      "Content-Type": "application/json",
      ...(this.apiKey ? { "x-api-key": this.apiKey } : {}),
      ...(this.environment ? { "x-environment": this.environment } : {}),
      ...(this.appName ? { "x-app-name": this.appName } : {}),
    };

    this.setUpGracefulShutdown();
  }

  private setUpGracefulShutdown() {
    const shutdown = async (signal?: string) => {
      if (this.shuttingDown) return;
      this.shuttingDown = true;

      try {
        console.log("Flushing logs before shutdown", { signal });
        await this.flush();
      } catch (error) {
        console.error("Error flushing buffer:", error);
      } finally {
        this.shuttingDown = false;
        process.exit(0);
      }
    };

    process.on("beforeExit", () => shutdown("beforeExit"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGQUIT", () => shutdown("SIGQUIT"));
  }

  async send(event: ObservoLogInput): Promise<void> {
    this.logsBuffer.push(event);

    // debounce sending logs to the server
    // only send logs if it's not already being sent
    this.flushTimer ??= setTimeout(() => this.flush(), this.flushInterval);
  }

  async flush() {
    if (this.isFlushing) return;

    this.isFlushing = true;
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    const logs = this.logsBuffer.splice(0, this.bufferSize);

    if (logs.length === 0) {
      this.isFlushing = false;
      return;
    }

    try {
      this.flushTimer = null;
      const response = await fetch(`${this.baseUrl}/api/v1/logs`, {
        method: "POST",
        body: JSON.stringify({ logs }),
        headers: this.headers,
        keepalive: true,
      });
      if (!response.ok) {
        throw new Error(`Failed to flush logs: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to flush logs:", error);
    } finally {
      this.isFlushing = false;
    }
  }
}
