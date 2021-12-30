import mysql from 'mysql2/promise';
import { HistoryModel } from '../Class/Model';
import { AuthRepos } from './auth';
import { HistoryReposity } from './history';
import { PracticeReposity } from './practice';
import { SessionReposity } from './sessionRepo';
import { UserRepository} from './user';

export class Reader{
    constructor(error, data){
        this.error = error;
        this.data = data;
    }
}

const pool = mysql.createPool({
    host: 'localhost',
    user: 'doan1',
    password: 'ktpm2019',
    database: "new_schema",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export function closeDB(){
    pool.end();
}

export function testDB() {
    pool.execute('SELECT * FROM history')
    .then(([rows, fields])=>{
        rows.forEach((row)=>{
            var data = new HistoryModel(row);
            console.log(JSON.stringify(data));
        }); 
        console.log('\n'+JSON.stringify(fields));
    })
    .catch((err)=>{
        console.log("MYSQL ERROR:\n" + err);
    });
}

export const historyRepos = new HistoryReposity(pool);
export const practiceRepos = new PracticeReposity(pool);
export const userRepos = new UserRepository(pool);
export const sessionRepos = new SessionReposity(pool);
export const authController = new AuthRepos();

export async function startTransaction(){
    var c = await pool.getConnection();
    await c.query("START TRANSACTION");
    console.log("Begin transaction");
    return c;
}

/** @param {mysql.PoolConnection} connection */
export async function commitTransaction(connection){
    await connection.query("COMMIT");
    connection.release();
    console.log("Commit transaction and close connection");
}