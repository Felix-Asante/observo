import { ObservoTransport } from "./transport.js";
import type {
  LogType,
  ObservoLogInput,
  ObservoTransportOptions,
} from "./types.js";

export function createLogger(options: ObservoTransportOptions) {
  const transport = new ObservoTransport(options);

  function log(type: LogType) {
    const transporter = (
      message: string,
      fields: Omit<ObservoLogInput, "type" | "message">,
    ) => transport.send({ type, message, ...fields, ingested_at: Date.now() });

    return transporter;
  }

  return {
    info: log("info"),
    warning: log("warning"),
    error: log("error"),
    debug: log("debug"),
    trace: log("trace"),
    audit: log("audit"),
    success: log("success"),
    security: log("security"),
  };
}
