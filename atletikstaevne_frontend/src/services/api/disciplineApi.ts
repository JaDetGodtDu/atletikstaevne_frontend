import { Discipline } from '../../models/Discipline';
import { makeOptions } from '../fetchUtils';

const API_URL = 'http://localhost:8080';

async function getAllDisciplines():Promise<Discipline[]> {
    try{
    const response = await fetch(`${API_URL}/discipline`);
    const data = await response.json();
    return data;
    } catch (error){
        console.error(error);
        return [];
    } 
}

async function getDisciplineById(id: number):Promise<Discipline> {
    try{
    const response = await fetch(`${API_URL}/discipline/${id}`);
    const data = await response.json();
    return data;
    } catch (error){
        console.error(error);
        return {} as Discipline;
    } 
}

async function handleDiscipline(discipline: Discipline):Promise<Discipline> {
    try{
        const method = discipline.id ? 'PUT' : 'POST';

        const options = makeOptions(method, discipline);

        const url = discipline.id ? `${API_URL}/discipline/${discipline.id}` : `${API_URL}/discipline`;

        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error){
        console.error(error);
        throw error;
    }
}

async function deleteDiscipline(id: number):Promise<string> {
    try{
        const options = makeOptions('DELETE', {});
        const response = await fetch(`${API_URL}/discipline/${id}`, options);
        const data = await response.json();
        return data;
    } catch (error){
        console.error(error);
        throw error;
    }
}

export { getAllDisciplines, getDisciplineById, handleDiscipline, deleteDiscipline}