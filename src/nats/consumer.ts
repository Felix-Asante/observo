import { consumerOpts } from 'nats';
import { getNats } from './index';
export async function startLogConsumer() {
  const { natsConnection, jc } = await getNats();

  const js = natsConnection.jetstream();
  const jsm = await natsConnection.jetstreamManager();

  const durable = 'observo-log-worker';
  const subject = 'logs.ingest';
  const streamName = 'Observo_Logs';

  const opts = consumerOpts();
  opts.durable(durable);
  opts.deliverAll();
  opts.deliverLast();
  opts.deliverLastPerSubject();
  opts.deliverLastPerSubject();
}
