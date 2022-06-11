import dotenv from 'dotenv';
import { initServer } from './Class/APIs/server';
import { initSocketIO } from './SocketIO/socket';

dotenv.config();

initSocketIO(9000);

initServer();