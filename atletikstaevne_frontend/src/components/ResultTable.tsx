import React, { useState, useEffect } from 'react';
import { Result } from '../models/Result';
import { Discipline } from '../models/Discipline';
import { getAllResults, getResultById, handleResult, deleteResult as apiDeleteResult } from '../services/api/resultApi';
import { getAllDisciplines } from '../services/api/disciplineApi';

import Select from 'react-select';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function ResultTable() {
    console.log('ResultTable');
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [formResult, setFormResult] = useState<Result>({ id: 0, resultValue: "", resultType:"", discipline: { id: 0, name: "", resultType: "" }, contestant: { id: 0, name: "", club: "", age:0, sex:"", disciplines:[] }, date: new Date() });

    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [resultToDelete, setResultToDelete] = useState<Result | null>(null);


    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
          try {
            const data = await getAllResults();
            setResults(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
        fetchResults();
        const fetchDisciplines = async () => {
            try {
                const data = await getAllDisciplines();
                setDisciplines(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchDisciplines();
    }, []);

    const getResult = async (id: number) => {
        try {
          const result = await getResultById(id);

          setFormResult(result);
          setCreating(false);
          setIsFormOpen(true);
        } catch (error) {
          console.error(error);
        }
    }
    const createResult = async (result: Result) => {
        try {
            const newResult = await handleResult(result);
            setResults([...results, newResult]);
            setCreating(false);
            setIsFormOpen(false);
        } catch (error) {
            console.error(error);
        }
    }
    const updateResult = async(id:number, result: Result) => {
        try {
            const updatedResult = await handleResult(result);
            setResults(results.map(r => r.id === id ? updatedResult : r));
            setCreating(false);
            setIsFormOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    const openDeleteConfirm = (result: Result) => {
        setResultToDelete(result);
        setIsDeleteConfirmOpen(true);
    }
     
    const confirmDeleteResult = async () => {
        if(resultToDelete){
            try{
                await apiDeleteResult(resultToDelete.id);
                setResults(results.filter(r => r.id !== resultToDelete.id));
            } catch (error) {
                console.error(error);
            } finally {
                setIsDeleteConfirmOpen(false);
                setResultToDelete(null);
            }
        }
    }

    const cancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setResultToDelete(null);
      };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(creating){
            createResult(formResult);
        } else {
            updateResult(formResult.id, formResult);
        }
        setFormResult({ id: 0, resultValue: "", resultType:"", discipline: { id: 0, name: "", resultType: "" }, contestant: { id: 0, name: "", club: "", age:0, sex:"", disciplines:[] }, date: new Date() });
    }

    const openCreateForm = () => {
        setCreating(true);
        setFormResult({ id: 0, resultValue: "", resultType:"", discipline: { id: 0, name: "", resultType: "" }, contestant: { id: 0, name: "", club: "", age:0, sex:"", disciplines:[] }, date: new Date() });
        setIsFormOpen(true);
    }

    const closeModal = () => {
        setIsFormOpen(false);
        setFormResult({ id: 0, resultValue: "", resultType:"", discipline: { id: 0, name: "", resultType: "" }, contestant: { id: 0, name: "", club: "", age:0, sex:"", disciplines:[] }, date: new Date() });
    }

    return (
        <div>
            <h2>Resultater</h2>
            <div>
                <button onClick={openCreateForm}>Opret Resultat</button>
            </div>
            <Modal isOpen={isFormOpen} onRequestClose={closeModal} contentLabel="Result Form" className="modal" overlayClassName="overlay">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Resultat"
                        value={formResult.resultValue}
                        onChange={(e) => setFormResult({ ...formResult, resultValue: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Resultat Type"
                        value={formResult.resultType}
                        onChange={(e) => setFormResult({ ...formResult, resultType: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        placeholder='Dato'
                        value={formResult.date.toISOString().split('T')[0]}
                        onChange={(e) => setFormResult({ ...formResult, date: new Date(e.target.value) })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Deltager ID"
                        value={formResult.contestant.id}
                        onChange={(e) => setFormResult({ ...formResult, contestant: { ...formResult.contestant, id: parseInt(e.target.value) } })}
                        required
                    />
                    <Select
                        options={disciplines.map(d => ({ value: d.id, label: d.name }))}
                        value={disciplines.filter(d => d.id === formResult.discipline.id).map(d => ({ value: d.id, label: d.name }))}
                        // onChange={(selectedOption) => setFormResult({ ...formResult, discipline: disciplines.find(d => d.id === selectedOption.value) || formResult.discipline })}
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                const discipline = disciplines.find(d => d.id === selectedOption.value);
                                if (discipline) {
                                    setFormResult({ ...formResult, discipline });
                                }
                            }
                        }}
                        placeholder="Vælg disciplin"
                        required
                    />
                    <br />
                        <button type="button" onClick={closeModal}>
                          Afbryd
                        </button>
                        <button type="submit">{creating ? "Opret" : "Opdater"} Resultat</button>
                </form>
            </Modal>
            <Modal
                isOpen={isDeleteConfirmOpen}
                onRequestClose={cancelDelete}
                contentLabel="Delete Confirmation"
                className="modal"
                overlayClassName="overlay"
            >         
                <p>Er du sikker på at du vil slette denne deltager?</p>
                <p>{resultToDelete?.id}</p>
                <button type="button" onClick={confirmDeleteResult}>
                  Ja
                </button>
                <button type="button" onClick={cancelDelete}>
                  Nej
                </button>
            </Modal>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="resultTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Resultat</th>
                            <th>Resultat Type</th>
                            <th>Dato</th>
                            <th>Deltager ID</th>
                            <th>Disciplin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.id}>
                                <td>{result.id}</td>
                                <td>{result.resultValue}</td>
                                <td>{result.resultType}</td>
                                <td>{result.date.toISOString().split('T')[0]}</td>
                                <td>{result.contestant.id}</td>
                                <td>{result.discipline.name}</td>
                                <td>
                                    <button onClick={() => getResult(result.id)}>Rediger</button>
                                    <button onClick={() => openDeleteConfirm(result)}>Slet</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>      
            )}
        </div>
    )
}