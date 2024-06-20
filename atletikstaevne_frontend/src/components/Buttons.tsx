export default function Buttons({ onSelected }: { onSelected: (selected: string) => void }) {
    return (
      <div>
        <button onClick={() => onSelected("home")}>Hjem</button>
        <button onClick={() => onSelected("contestants")}>Deltagere</button>
      </div>
    );
  }