import { Contestant } from "./Contestant";
import { Discipline } from "./Discipline";

export interface Result {
    id: number;
    date: Date;
    resultValue: string;
    contestant: Contestant
    discipline: Discipline;
    resultType: string;
}