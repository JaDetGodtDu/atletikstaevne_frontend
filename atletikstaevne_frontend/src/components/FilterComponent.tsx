import { useState, useEffect } from "react";
import { getAllContestants } from "../services/api/contestantApi";
import { Contestant } from "../models/Contestant";
import { getAllDisciplines } from "../services/api/disciplineApi";
import { Discipline } from "../models/Discipline";
import { calculateAge, calculateAgeGroup } from "../services/calculators";

interface FilterComponentProps {
  onFilterChange: (filter: {
    sex: string;
    club: string;
    discipline: string;
    ageGroup: string;
  }) => void;
  // onSortChange?: (criteria: string) => void; -- WILL MAYBE ADD SORTING LATER --
}

const FilterComponent = ({ onFilterChange }: FilterComponentProps) => {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [sex, setSex] = useState("");
  const [club, setClub] = useState("");
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [discipline, setDiscipline] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    getAllContestants().then(setContestants);
    getAllDisciplines().then(setDisciplines);
  }, []);

  const uniqueSexes = [...new Set(contestants.map((contestant) => contestant.sex))];
  const uniqueClubs = [...new Set(contestants.map((contestant) => contestant.club))];
  const uniqueDisciplines = [...new Set(disciplines.map((discipline) => discipline.name))];
  // const uniqueDisciplines = [...new Set(disciplines.flatMap((discipline) => discipline.name))];
  const uniqueAgeGroups = [
    ...new Set(
      contestants.map((contestant) => calculateAgeGroup(calculateAge(new Date(contestant.age))))
    ),
  ];

  const handleFilterChange = () => {
    onFilterChange({ sex, club, discipline, ageGroup });
  };

  const handleResetFilters = () => {
    setSex("");
    setClub("");
    setDiscipline("");
    setAgeGroup("");

    onFilterChange({
      sex: "",
      club: "",
      discipline: "",
      ageGroup: "",
    });
  };

  return (
    <div>
      <label>Filter</label>
      <br />
      <select onChange={(e) => setDiscipline(e.target.value)} value={discipline}>
        <option value="">Ingen disciplin valgt</option>
        {uniqueDisciplines.map((disciplineName) => (
          <option key={disciplineName} value={disciplineName}>
            {disciplineName}
          </option>
        ))}
      </select>
      <select onChange={(e) => setClub(e.target.value)} value={club}>
        <option value="">Ingen klub valgt</option>
        {uniqueClubs.map((club) => (
          <option key={club} value={club}>
            {club}
          </option>
        ))}
      </select>
      <select onChange={(e) => setSex(e.target.value)} value={sex}>
        <option value="">Intet køn valgt</option>
        {uniqueSexes.map((sex) => (
          <option key={sex} value={sex}>
            {sex}
          </option>
        ))}
      </select>
      <select onChange={(e) => setAgeGroup(e.target.value)} value={ageGroup}>
        <option value="">Ingen aldersgruppe valgt</option>
        {uniqueAgeGroups.map((group, index) => (
          <option key={index} value={group}>
            {group}
          </option>
        ))}
      </select>
      <button onClick={handleFilterChange}>Filtrér</button>
      <button onClick={handleResetFilters}>Nulstil</button>
    </div>
  );
};

export default FilterComponent;
