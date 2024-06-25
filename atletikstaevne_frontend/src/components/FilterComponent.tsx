import { useState, useEffect } from 'react';
import { getAllContestants } from '../services/api/contestantApi';
import { Contestant } from '../models/Contestant';
import { getAllDisciplines } from '../services/api/disciplineApi';
import { Discipline } from '../models/Discipline';

interface FilterComponentProps {
  onFilterChange: (filter: { sex: string; club: string; discipline: string;}) => void;
  // onSortChange?: (criteria: string) => void;
}

const FilterComponent = ({ onFilterChange }: FilterComponentProps) => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [sex, setSex] = useState('');
  const [club, setClub] = useState('');
  // const [sortCriteria, setSortCriteria] = useState('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [discipline, setDiscipline] = useState('');

  useEffect(() => {
    getAllContestants().then(setContestants);
    getAllDisciplines().then(setDisciplines);
  }, []);

  const uniqueSexes = [...new Set(contestants.map(contestant => contestant.sex))];
  const uniqueClubs = [...new Set(contestants.map(contestant => contestant.club))];
    const uniqueDisciplines = [...new Set(disciplines.flatMap(discipline => discipline.name))];

//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortCriteria(e.target.value);
//     onSortChange(e.target.value);
//   };

  const handleFilterChange = () => {
    onFilterChange({ sex, club, discipline});
  };

  return (
    <div>
      <label>Filter</label>
      <br/>
      <select onChange={(e) => setDiscipline(e.target.value)} value={discipline}>
        <option value="">Ingen disciplin</option>
        {uniqueDisciplines.map(disciplineName => (
          <option key={disciplineName} value={disciplineName}>{disciplineName}</option>
        ))}
      </select>
      <select onChange={(e) => setClub(e.target.value)} value={club}>
        <option value="">Ingen klub</option>
        {uniqueClubs.map(club => (
          <option key={club} value={club}>{club}</option>
        ))}
      </select>
      <select onChange={(e) => setSex(e.target.value)} value={sex}>
        <option value="">Intet køn valgt</option>
        {uniqueSexes.map(sex => (
          <option key={sex} value={sex}>{sex}</option>
        ))}
      </select>
      <button onClick={handleFilterChange}>Filtrér</button>
    </div>
  );
};

export default FilterComponent;