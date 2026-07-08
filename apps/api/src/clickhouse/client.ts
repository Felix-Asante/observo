import { createClient } from '@clickhouse/client';
import { ENV } from '~/app.environment';

export const clickhouseClient = createClient({
  url: ENV.CLICKHOUSE_URL,
  username: ENV.CLICKHOUSE_USERNAME,
  password: ENV.CLICKHOUSE_PASSWORD,
  database: ENV.CLICKHOUSE_DATABASE,
});
