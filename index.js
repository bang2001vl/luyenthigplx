import dotenv from 'dotenv';
import { initSocketIO } from './SocketIO/socket';

dotenv.config();

initSocketIO(9000);