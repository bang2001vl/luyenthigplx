import {TimeStampModel} from "./timetamp.js";

export class HistoryModel extends TimeStampModel {
    /**
     * 
     * @param {{
     * id : number, 
     * accountID: number, 
     * topicID: number, 
     * isPassed: boolean, 
     * questionIds: string[],
     * selectedAns: string[],
     * correctAns: string[],
     * rawQuestionIDs: string,
     * rawSelected: string,
     * rawCorrect: string,
     * }} args 
     */
    constructor(args) {
        super(args);

        this.topicID = args.topicID;
        this.accountID = args.accountID;
        this.isPassed = args.isPassed;

        this.selectedAns = args.selectedAns;
        this.correctAns = args.correctAns;
        this.questionIds = args.questionIds;

        if ('rawCorrect' in args) {
            this.rawCorrect = args.rawCorrect;
        }

        if ('rawSelected' in args) {
            this.rawSelected = args.rawSelected;
        }

        if ('rawQuestionIDs' in args) {
            this.rawQuestionIDs = args.rawQuestionIDs;
        }
    }

    get rawCorrect() {
        return this.correctAns.join('.');
    }

    set rawCorrect(value) {
        this.correctAns = value.split('.');
    }

    get rawSelected() {
        return this.selectedAns.join('.');
    }

    set rawSelected(value) {
        this.selectedAns = value.split('.');
    }

    get rawQuestionIDs(){
        return this.questionIds.join('.');
    }

    set rawQuestionIDs(value) {
        this.questionIds = value.split('.');
    }


    get count() {
        return this.questionIds.length;
    }

    /**
     * 
     * @returns Number of correct answer. Return -1 if correctAns or selectedAns is invalid
     */
    countCorrect() {
        let c = 0;
        let a = this.correctAns;
        let b = this.selectedAns;

        if (a.length !== b.length) { return -1; }

        for (let i = 0; i < a.length; i++) {
            if (a[i] === b[i]) {
                c = c + 1;
            }
        }

        return c;
    }

    countWrong() {
        return this.selectedAns.length - this.countCorrect();
    }
}