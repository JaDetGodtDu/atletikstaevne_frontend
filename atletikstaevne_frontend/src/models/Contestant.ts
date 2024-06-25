import { Discipline } from './Discipline';

export interface Contestant {
    id: number;
    name: string;
    age: Date;
    club: string;
    sex: string;
    disciplines: Discipline[];
}