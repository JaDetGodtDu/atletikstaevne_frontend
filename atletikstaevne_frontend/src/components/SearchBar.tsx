type SearchBarProps = {
  onSearch: (search: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Søg på en deltager"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
