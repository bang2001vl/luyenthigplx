import { HistoryModel } from "../Class/Model";
import { historyRepos, closeDB } from "../Database/mysqlController";

function resultOK(type) {
    console.log("MYSQL TEST:\t" + `${type}: [OK]`);
}

function resultFail(type, error) {
    console.log("MYSQL TEST:\t" + `${type}: [FAILED]\n` + error);
}

async function testInsert() {
    let type = "INSERT";

    let temp = new HistoryModel({
        topicID: 1,
        accountID: 2,
        isPassed: true,
        rawCorrect: "1.1.1.1.1",
        rawQuestionIDs: "1.2.3.4.5",
        rawSelected: "1.2.3.1.1",
    });

    try {
        var a = await historyRepos.insertHistory(temp);
        resultOK(type);
        return a[0].insertId;
    }
    catch (err) {
        resultFail(type, err);
    }
}

async function testUpdate(id) {
    let type = "UPDATE";

    let temp = new HistoryModel({
        topicID: 1,
        accountID: 2,
        isPassed: true,
        rawCorrect: "3.3.3.3.3",
        rawQuestionIDs: "2.3.4.5.6",
        rawSelected: "2.2.2.2.2",
    });

    try {
        var a = await historyRepos.updateHistory(id, temp);
        resultOK(type);
        return a[0].affectedRows;
    }
    catch (err) {
        resultFail(type, err);
    }
}

async function testDelete(id) {
    let type = "DELETE";

    try {
        var a = await historyRepos.deleteHistory(id);
        resultOK(type);
        return a[0].affectedRows;
    }
    catch (err) {
        resultFail(type, err);
        return;
    }
}

export async function test() {
    let id = await testInsert();
    await testUpdate(id);
    await testDelete(id);
    closeDB();
}