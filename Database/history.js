import {deleteFromTable, insertToDB, updateToDB} from './utilities'

/** 
 * @typedef {import("mysql2").Pool} Pool 
 * @typedef {import("../Class/Model").HistoryModel} HistoryModel 
 * @typedef {import("./mysqlController").Reader} Reader 
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
        let fields = ["accountID","topicID","isPassed","rawCorrect","rawSelected","rawQuestionIDs"];
        return insertToDB(this.pool, this.tableName, data, fields);
    }

    deleteHistory(id){
        return deleteFromTable(this.pool, this.tableName, id);
    }

    updateHistory(id, data){
        let fields = ["accountID","topicID","isPassed","rawCorrect","rawSelected","rawQuestionIDs"];
        return updateToDB(this.pool, this.tableName, id, data, fields);
    }
}