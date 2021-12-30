import { getUTCTimestamp } from "../Class/Model/timetamp";
import { commitTransaction, startTransaction } from "./mysqlController";
import { deleteFromTable, insertToDB, updateToDB } from "./utilities";

/** 
 * @typedef {import("mysql2/promise").Pool} Pool 
 */

export class PracticeReposity {
    /**
     * Manage all transace with db about history
     * @param {Pool} pool 
     */
    constructor(pool) {
        this.pool = pool;
        this.tableName = "practice";
    }

    insert(data) {
        let fields = [
            "mode",
            "accountID",
            "create_time",
            "update_time",
            "sync_time",
            "questionID",
            "selectedAnswer",
            "correctAnswer",
            "countWrong",
            "countCorrect",
        ];

        data["sync_time"] = getUTCTimestamp();
        return insertToDB(this.pool, this.tableName, data, fields);
    }


    update(id, data) {
        let fields = [
            "mode",
            "accountID",
            "create_time",
            "update_time",
            "sync_time",
            //"questionID",
            "selectedAnswer",
            "correctAnswer",
            "countWrong",
            "countCorrect",
        ];

        data["sync_time"] = getUTCTimestamp();
        return updateToDB(this.pool, this.tableName, id, data, fields);
    }

    deleteHistory(id) {
        return deleteFromTable(this.pool, this.tableName, id);
    }

    async findNotSync(accountID, lastTimeSync) {
        let fields = [
            "mode",
            "accountID",
            "create_time",
            "update_time",
            "sync_time",
            "questionID",
            "selectedAnswer",
            "correctAnswer",
            "countWrong",
            "countCorrect",
        ];

        var sql = `SELECT ${fields.join(',')} FROM ${this.tableName} WHERE accountID = ? AND sync_time > ?`;
        try {
            var [rows, f] = await this.pool.execute(sql, [accountID, lastTimeSync]);
            if (rows.length < 1) return [];
            return rows;
        }
        catch (e) {
            console.log(JSON.stringify(e));
            return null;
        }
    }

    /** @param {[]} dataList */
    async insertOrUpdateList(accountID, dataList) {
        if(dataList.length < 1) return [];
        let fields = [
            "mode",
            "accountID",
            "create_time",
            "update_time",
            "sync_time",
            "questionID",
            "selectedAnswer",
            "correctAnswer",
            "countWrong",
            "countCorrect",
        ];
        try {
            var connection = await startTransaction();
            for (let i = 0; i < dataList.length; i++) {
                let data = dataList[i];
                data["accountID"] = accountID;
                data["sync_time"] = getUTCTimestamp();

                var sql = `SELECT * FROM ${this.tableName} WHERE accountID = ? AND questionID = ? AND mode = ?`;
                var [rows, f] = await connection.query(sql, [accountID, data["questionID"], data["mode"]]);
                if (rows.length < 1) {
                    await insertToDB(connection, this.tableName, data, fields);
                }
                else {
                    let id = rows[0]["id"];
                    await updateToDB(connection, this.tableName, id, data, fields);
                }
            }
            await commitTransaction(connection);

            // var timestamps = [];
            // for (let i = 0; i < dataList.length; i++) {
            //     let data = dataList[i];
            //     timestamps.push(data["sync_time"]);
            // }
            // return timestamps;

            return dataList;
        }
        catch (e) {
            console.log(JSON.stringify(e));
            return [];
        }
    }

    /**
     * 
     * @param {number} accountId 
     * @returns {Promise<number>}
     */
    async deleteByAccount(accountId){
        let sql = `DELETE FROM ${this.tableName} WHERE accountId = ?`;
        var [result, f] = await this.pool.execute(sql, [accountId]);
        return result.affectedRows;
    }
}