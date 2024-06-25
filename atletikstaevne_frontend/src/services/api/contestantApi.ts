import { Contestant } from "../../models/Contestant";
import { makeOptions } from "../fetchUtils";

const API_URL = "http://localhost:8080";

async function getAllContestants(): Promise<Contestant[]> {
  try {
    const response = await fetch(`${API_URL}/contestant`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getContestantById(id: number): Promise<Contestant> {
  try {
    const response = await fetch(`${API_URL}/contestant/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {} as Contestant;
  }
}

async function handleContestant(contestant: Contestant): Promise<Contestant> {
  try {
    const method = contestant.id ? "PUT" : "POST";

    const options = makeOptions(method, contestant);

    const url = contestant.id ? `${API_URL}/contestant/${contestant.id}` : `${API_URL}/contestant`;

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteContestant(id: number): Promise<void> {
  try {
    const options = makeOptions("DELETE", {});
    const response = await fetch(`${API_URL}/contestant/${id}`, options);
    if (response.ok) {
      console.log("Contestant deleted succesfully!");
    } else if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getAllContestants, getContestantById, handleContestant, deleteContestant };
