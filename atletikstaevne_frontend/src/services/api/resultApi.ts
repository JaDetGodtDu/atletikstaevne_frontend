import { Result } from "../../models/Result";
import { makeOptions } from "../fetchUtils";

const API_URL = "http://localhost:8080";

async function getAllResults(): Promise<Result[]> {
  try {
    const response = await fetch(`${API_URL}/result`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getResultById(id: number): Promise<Result> {
  try {
    const response = await fetch(`${API_URL}/result/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {} as Result;
  }
}

async function handleResult(result: Result): Promise<Result> {
  try {
    const method = result.id ? "PUT" : "POST";

    const options = makeOptions(method, result);

    const url = result.id ? `${API_URL}/result/${result.id}` : `${API_URL}/result`;

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteResult(id: number): Promise<string> {
  try {
    const options = makeOptions("DELETE", {});
    const response = await fetch(`${API_URL}/result/${id}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { getAllResults, getResultById, handleResult, deleteResult };
