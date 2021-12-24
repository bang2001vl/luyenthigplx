import mysql from 'mysql2/promise';
import { HistoryModel } from '../Class/Model';
import { HistoryReposity } from './history';

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