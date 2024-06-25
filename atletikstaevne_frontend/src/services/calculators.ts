function calculateAge(birthDate: Date) {
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function calculateAgeGroup(age: number) {
    if(age < 10){
      return "Børn";
    } if (age < 14 && age > 9) {
      return "Unge";
    } if(age < 23 && age > 13) {
      return "Junior";
    } if(age < 41 && age > 22) {
      return "Voksne";
    } if(age > 40) {
      return "Senior";
    }
  }

  export { calculateAge, calculateAgeGroup };