import { Inject, Injectable } from '@nestjs/common';
import { DRRIZLE_DB, type DrizzleClient } from 'src/database/database.module';

@Injectable()
export class ApiKeyService {
  constructor(@Inject(DRRIZLE_DB) private readonly db: DrizzleClient) {}
}
