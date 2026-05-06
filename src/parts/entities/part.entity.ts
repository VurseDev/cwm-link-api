import { Log } from './logs.entity';

export interface Part {
  id: number;
  serialNumber: string;
  serialId: string;
  partName: string;
  partDescription: string;
  status: string;
  logs: Log[];
  createdAt: Date;
}
