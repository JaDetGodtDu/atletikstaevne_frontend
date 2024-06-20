import {useEffect, useState} from 'react';
import { getAllContestants, getContestantById, handleContestant, deleteContestant as apiDeleteContestant } from '../services/api/contestantApi';
import { Contestant } from '../models/Contestant';
import { getAllDisciplines } from '../services/api/disciplineApi';
import { Discipline } from '../models/Discipline';
import Modal from 'react-modal';
import Select from 'react-select';

Modal.setAppElement('#root');

export default function ContestantTable() {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);

    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [formContestant, setFormContestant] = useState<Contestant>({ id: 0, name: "", age: 0, club:'',sex:'', disciplines: []});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [contestantToDelete, setContestantToDelete] = useState<Contestant | null>(null);

    useEffect(() => {
        const fetchContestants = async () => {
          setLoading(true);
          try {
            const data = await getAllContestants();
            setContestants(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
        fetchContestants();
        const fetchDisciplines = async () => {
            try {
                const data = await getAllDisciplines();
                setDisciplines(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDisciplines();
      }, []);

    const getContestant = async (id: number) => {
        try {
          const contestant = await getContestantById(id);
        //   setFormContestant(contestant);
            setFormContestant({
            ...contestant,
            disciplines: contestant.disciplines.map(d => ({
                id: d.id,
                name: d.name,
                resultType: d.resultType
            }))
        });

          setCreating(false);
          setIsFormOpen(true);
        } catch (error) {
          console.error(error);
        }
      };
    
      const createContestant = async (contestant: Contestant) => {
        try {
          const newContestant = await handleContestant(contestant);
          setContestants([...contestants, newContestant]);
          setCreating(false);
          setIsFormOpen(false);
        } catch (error) {
          console.error(error);
        }
      };
    
      const updateContestant = async (id: number, contestantToUpdate: Contestant) => {
        try {
          const updatedContestant = await handleContestant(contestantToUpdate);
          setContestants(contestants.map((contestant) => (contestant.id === id ? updatedContestant : contestant)));
          setIsFormOpen(false);
        } catch (error) {
          console.error(error);
        }
      };
    
      const openDeleteConfirm = (contestant: Contestant) => {
        setContestantToDelete(contestant);
        setIsDeleteConfirmOpen(true);
      };
    
      const confirmDeleteContestant = async () => {
        if (contestantToDelete) {
            try {
                await apiDeleteContestant(contestantToDelete.id);
                setContestants(contestants.filter((contestant) => contestant.id !== contestantToDelete.id));
            } catch (error) {
                console.error(error);
            } finally {
                setIsDeleteConfirmOpen(false);
                setContestantToDelete(null);
            }
        }
      };
    
      const cancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setContestantToDelete(null);
      };
    
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (creating) {
          createContestant(formContestant);
        } else {
          updateContestant(formContestant.id, formContestant);
        }
        setFormContestant({ id: 0, name: "", age: 0, club:'', sex:'', disciplines: []});
      };
    
      const openCreateForm = () => {
        setCreating(true);
        setFormContestant({ id: 0, name: "", age: 0, club:'', sex:'', disciplines: []});
        setIsFormOpen(true);
      };
    
      const closeModal = () => {
        setIsFormOpen(false);
        setFormContestant({ id: 0, name: "", age: 0, club:'', sex:'', disciplines: []});
      };

    return (
        <div>
            <h2>Contestants</h2>
            <div>
                <button onClick={openCreateForm}>Opret</button>
            </div>
            <Modal isOpen={isFormOpen} onRequestClose={closeModal} contentLabel="Contestant Form" className="modal" overlayClassName="overlay">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={formContestant.name} 
            onChange={(e) => setFormContestant({ ...formContestant, name: e.target.value })} 
            placeholder="Navn" 
            required />
          <input
            type="number"
            value={formContestant.age}
            onChange={(e) => setFormContestant({ ...formContestant, age: parseInt(e.target.value) })}
            placeholder="Alder"
            required
          />
            <input
                type="text"
                value={formContestant.club}
                onChange={(e) => setFormContestant({ ...formContestant, club: e.target.value })}
                placeholder="Klub"
                required
            />
            <input
                type="text"
                value={formContestant.sex}
                onChange={(e) => setFormContestant({ ...formContestant, sex: e.target.value })}
                placeholder="Køn"
                required
            />
            {/* TILFØJ DISCIPLINER HER ! */}
            <Select
                isMulti
                options={disciplines.map(d => ({ value: d.id, label: d.name,resultType:d.resultType }))}
                value={formContestant.disciplines.map(d => ({ value: d.id, label: d.name,resultType:d.resultType }))}
                onChange={(selected) => setFormContestant({ ...formContestant, disciplines: selected.map(s => ({ id: s.value, name: s.label, resultType:s.resultType })) })}
                placeholder="Vælg discipliner"
            />
          <br />
          <button type="button" onClick={closeModal}>
            Afbryd
          </button>
          <button type="submit">{creating ? "Opret" : "Opdater"} Deltager</button>
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
        <p>{contestantToDelete?.name}</p>
        <button type="button" onClick={confirmDeleteContestant}>
          Ja
        </button>
        <button type="button" onClick={cancelDelete}>
          Nej
        </button>
      </Modal>
      {loading ? (
        <p>Loading...</p>
      ) : (
            <table className="contestantTable">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Navn</th>
                        <th>Alder</th>
                        <th>Klub</th>
                        <th>Køn</th>
                        <th>Discipliner</th>
                    </tr>
                </thead>
                <tbody>
                    {contestants.map(contestant => (
                        <tr key={contestant.id}>
                            <td>{contestant.id}</td>
                            <td>{contestant.name}</td>
                            <td>{contestant.age}</td>
                            <td>{contestant.club}</td>
                            <td>{contestant.sex}</td>
                            <td>
                                {contestant.disciplines.map(discipline => discipline.name).join(', ')}
                            </td>
                            <td>
                                <button onClick={() => getContestant(contestant.id)}>Opdater</button>
                                <button onClick={() => openDeleteConfirm(contestant)}>Slet</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}          
        </div>
    );
}