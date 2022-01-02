import { getUTCTimestamp } from '../Class/Model/timetamp';
import { commitTransaction, startTransaction } from './mysqlController';
import { deleteFromTable, insertToDB, updateToDB } from './utilities'

/** 
 * @typedef {import("mysql2/promise").Pool} Pool 
 * @typedef {import("../Class/Model").HistoryModel} HistoryModel 
 */
export class HistoryReposity {

    /**
     * Manage all transace with db about history
     * @param {Pool} pool 
     */
    constructor(pool) {
        this.pool = pool;
        this.tableName = "history";
    }

    /**
     * Insert new record to history table
     * @param {HistoryModel} data 
     */
    insertHistory(data) {
        let fields = [
            "mode",
            "accountID",
            "create_time",
            "update_time",
            "sync_time",
            "topicID",
            "isPassed",
            "isFinished",
            "timeLeft",
            "rawCorrect",
            "rawSelected",
            "rawQuestionIDs",
        ];

        data["sync_time"] = getUTCTimestamp();
        return insertToDB(this.pool, this.tableName, data, fields);
    }

    updateHistory(id, data) {
        let fields = [
            "mode",
            "accountID",
            //"create_time",
            "update_time",
            "sync_time",
            //"topicID",
            "isPassed",
            "isFinished",
            "timeLeft",
            "rawCorrect",
            "rawSelected",
            "rawQuestionIDs",
        ];

        data["sync_time"] = getUTCTimestamp();
        return updateToDB(this.pool, this.tableName, id, data, fields);
    }

    deleteHistory(id) {
        return deleteFromTable(this.pool, this.tableName, id);
    }

    /**
     * 
     * @param {number} accountID 
     * @param {number} lastTimeSync 
     * @returns 
     */
    async findNotSync(accountID, lastTimeSync) {
        console.log("History: Find not sync from lastTime = " + lastTimeSync.toString());
        let fields = [
            "mode",
            "accountID",
            "create_time",
            "update_time",
            "sync_time",
            "topicID",
            "isPassed",
            "isFinished",
            "timeLeft",
            "rawCorrect",
            "rawSelected",
            "rawQuestionIDs",
        ];
        try {
            var sql = `SELECT ${fields.join(',')} FROM ${this.tableName} WHERE accountID = ? AND sync_time > ?`;
            var [rows, f] = await this.pool.execute(sql, [accountID, lastTimeSync]);
            if (rows.length < 1) return [];
            rows.forEach((row) =>{
                console.log(JSON.stringify(row));
            })
            return rows;
        }
        catch (e) {
            console.log(JSON.stringify(e));
            return null;
        }
    }

    /** @param {[]} dataList */
    async insertList(accountID, dataList) {
        if(dataList.length < 1) return [];
        console.log("Hisotry: Insert list");
        let fields = [
            "accountID",
            "mode",
            "create_time",
            "update_time",
            "sync_time",
            "topicID",
            "isPassed",
            "isFinished",
            "timeLeft",
            "rawCorrect",
            "rawSelected",
            "rawQuestionIDs",
        ];
        try {
            var connection = await startTransaction();

            for (let i = 0; i < dataList.length; i++) {
                let data = dataList[i];
                data["accountID"] = accountID;
                data["sync_time"] = getUTCTimestamp();
                await insertToDB(connection, this.tableName, data, fields);
                //console.log(JSON.stringify(a));
            }

            await commitTransaction(connection);
            console.log("insert ok " + dataList.length);

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