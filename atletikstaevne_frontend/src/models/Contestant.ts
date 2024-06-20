import { Discipline } from './Discipline';

export interface Contestant {
    id: number;
    name: string;
    age: number;
    club: string;
    sex: string;
    disciplines: Discipline[];
}