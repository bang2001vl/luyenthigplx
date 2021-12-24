class TopicOverviewData{
    id = 1;
    countCorrect = 28;
    countWrong = 4;
    percent = 0.9;
    isPassed = true;
    total = 32;
    constructor(id, count_correct, count_wrong, isPassed){
        /** @type {int} */
        this.countCorrect = count_correct;
        /** @type {int} */
        this.countWrong = count_wrong;
        /** @type {int} */
        this.id = id;
        /** @type {boolean} */
        this.isPassed = isPassed;

        this.total = count_wrong + count_correct;
        this.percent = count_correct/this.total;
    }
}

