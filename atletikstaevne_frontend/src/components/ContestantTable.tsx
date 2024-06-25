import {useEffect, useState} from 'react';
import { getAllContestants, getContestantById, handleContestant, deleteContestant as apiDeleteContestant } from '../services/api/contestantApi';
import { Contestant } from '../models/Contestant';
import { getAllDisciplines } from '../services/api/disciplineApi';
import { Discipline } from '../models/Discipline';
import Modal from 'react-modal';
import Select from 'react-select';
import SearchBar from './SearchBar';
import FilterComponent from './FilterComponent';
import { calculateAge, calculateAgeGroup } from '../services/calculators';

Modal.setAppElement('#root');

export default function ContestantTable() {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);

    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [formContestant, setFormContestant] = useState<Contestant>({ id: 0, name: "", age: new Date(), club:'',sex:'', disciplines: []});
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [contestantToDelete, setContestantToDelete] = useState<Contestant | null>(null);

    // SEARCH
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContestants, setFilteredContestants] = useState<Contestant[]>([]);

    // FILTER
    const [filters, setFilters] = useState({ sex: '', club: '', discipline: '', ageGroup: ''});

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

    // FILTER AND SEARCH
    useEffect(() => {
      let result = contestants;

      if (searchTerm) {
          result = result.filter(contestant =>
              contestant.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
      }

      if (filters.sex) {
          result = result.filter(contestant => contestant.sex === filters.sex);
      }
      if (filters.club) {
          result = result.filter(contestant => contestant.club.toLowerCase().includes(filters.club.toLowerCase()));
      }
      if (filters.discipline) {
          result = result.filter(contestant =>
              contestant.disciplines.some(d => d.name.toLowerCase() === filters.discipline.toLowerCase())
          );
      }
      if (filters.ageGroup) {
          result = result.filter(contestant =>
              calculateAgeGroup(calculateAge(new Date(contestant.age))) === filters.ageGroup
          );
      }      
      setFilteredContestants(result);
    }, [searchTerm, contestants, filters]);

    const getContestant = async (id: number) => {
        try {
          const contestant = await getContestantById(id);
            setFormContestant({
            ...contestant,
            age: new Date(contestant.age),
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
          if (newContestant) {
            console.log('Contestant created succesfully!\nCreated contestant:', newContestant);
          }
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
          if (updatedContestant) {
            console.log('Contestant updated succesfully!\nUpdated contestant:', updatedContestant);           
          }
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
        setFormContestant({ id: 0, name: "", age: new Date(), club:'', sex:'', disciplines: []});
      };
    
      const openCreateForm = () => {
        setCreating(true);
        setFormContestant({ id: 0, name: "", age: new Date(), club:'', sex:'', disciplines: []});
        setIsFormOpen(true);
      };
    
      const closeModal = () => {
        setIsFormOpen(false);
        setFormContestant({ id: 0, name: "", age: new Date(), club:'', sex:'', disciplines: []});
      };

      const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        //applyFilters();
      };
      // const applyFilters = () => {
      //   let filtered = contestants;
      //   if (filters.sex) {
      //     console.log('Filtering');
          
      //     filtered = filtered.filter(contestant => contestant.sex === filters.sex);
      //   }
      //   // Repeat for other filters, including a special case for ageGroup
      //   setFilteredContestants(filtered);
      // };

    return (
        <div>
            <h2>Deltagere</h2>
            <div>
                <button onClick={openCreateForm}>Opret Deltager</button>
            </div>
            <SearchBar onSearch={setSearchTerm} />
            <br />
            <FilterComponent onFilterChange={handleFilterChange} />
            <br />
            {/* MANGLER SORTERING ! */}
            <Modal isOpen={isFormOpen} onRequestClose={closeModal} contentLabel="Contestant Form" className="modal" overlayClassName="overlay">
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  value={formContestant.name} 
                  onChange={(e) => setFormContestant({ ...formContestant, name: e.target.value })} 
                  placeholder="Navn" 
                  required />
                {creating && (<input
                  type="date"
                  value={formContestant.age.toISOString().split('T')[0]}
                  onChange={(e) => setFormContestant({ ...formContestant, age: new Date(e.target.value) })}
                  placeholder="Alder"
                  required
                />)}
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
                          {filteredContestants.map(contestant => (
                              <tr key={contestant.id}>
                                  <td>{contestant.id}</td>
                                  <td>{contestant.name}</td>
                                  {/* <td>{contestant.age}</td> */}
                                  {/* <td>{((new Date()).getFullYear() - contestant.age.getFullYear())}</td> */}
                                  {/* <td>
                                    {
                                      ((new Date()).getFullYear() - contestant.age.getFullYear()) - 
                                      (((new Date()).getMonth() > contestant.age.getMonth() || 
                                        ((new Date()).getMonth() === contestant.age.getMonth() && (new Date()).getDate() >= contestant.age.getDate())) ? 0 : 1)
                                    }
                                  </td> */}
                                  <td>
                                    {
                                      (() => {
                                        const ageDate = new Date(contestant.age);
                                        const currentYear = new Date().getFullYear();
                                        const birthYear = ageDate.getFullYear();
                                        const ageThisYear = currentYear - birthYear;
                                        const hasHadBirthdayThisYear =
                                          (new Date().getMonth() > ageDate.getMonth()) ||
                                          (new Date().getMonth() === ageDate.getMonth() && new Date().getDate() >= ageDate.getDate());
                                      
                                        return ageThisYear - (hasHadBirthdayThisYear ? 0 : 1);
                                      })()
                                    }
                                  </td>
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