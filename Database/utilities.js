/** 
 * @typedef {import("mysql2/promise").Pool} Pool 
 * @typedef {import("./mysqlController").Reader} Reader 
 */

export class RepairedData {
    /**
     * 
     * @param {string} sql 
     * @param {any[]} values 
     */
    constructor(sql, values) {
        this.sql = sql;
        this.values = values;
    }
}

/**
 * 
 * @param {Pool} pool 
 * @param {string} tableName Fields want to insert
 * @param {*} data Data want to insert
 * @param {string[]} fields Null will takes all property
 * @returns SQL statement and array of values to insert
 */
export async function insertToDB(pool, tableName, data, fields) {
    if(fields === undefined || fields === null){
         fields = Object.keys(data);
    }
    let args = [];
    let values = [];

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        args.push("?");
        values.push(data[field]);
    }

    let fields_string = fields.join(',');
    let args_string = args.join(',');
    let sql = `INSERT INTO ${tableName}(${fields_string}) VALUES(${args_string});`;

    //console.log(`SQL Statement : ${sql}`);
    return pool.query(sql, values);
}

/**
 * 
 * @param {Pool} pool 
 * @param {string} table 
 * @param {number} id 
 */
export async function deleteFromTable(pool, table, id) {
    let sql = `DELETE FROM ${table} WHERE id=?`;

    //console.log(`SQL Statement : ${sql}`);
    return pool.execute(sql, [id]);
}

/**
 * 
 * @param {Pool} pool 
 * @param {*} table 
 * @param {*} id 
 * @param {*} data 
 * @param {*} fields 
 */
export async function updateToDB(pool, table, id, data, fields) {
    let args = [];
    let values = [];

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        values.push(data[field]);
        args.push(`${field}=?`);
    }

    let sql = `UPDATE ${table} SET ${args.join(",")} WHERE id=?;`;
    values.push(id);

    //console.log(`SQL Statement : ${sql}`);
    return pool.execute(sql, values);
}