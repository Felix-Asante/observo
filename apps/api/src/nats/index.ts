import { connect, JSONCodec, type NatsConnection } from 'nats';
import { ENV } from '~/app.environment';

const jc = JSONCodec();
let natsConnection: NatsConnection | null = null;

export async function getNats() {
  natsConnection ??= await connect({
    servers: ENV.NATS_URL,
    name: 'observo-server',
  });

  console.log('NATS connected 🚀');

  return { natsConnection, jc };
}
