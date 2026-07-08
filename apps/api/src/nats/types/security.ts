import { AuthStatus } from './index';

export interface SecurityLog {
  auth_status: AuthStatus;
  suspicious?: boolean;
  tags?: string[];
}
