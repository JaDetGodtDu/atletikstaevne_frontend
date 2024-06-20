import Buttons from './components/Buttons'
import { useState } from 'react'
import './App.css'
import ContestantTable from './components/ContestantTable';


export default function App() {
  const [selectedView, setSelectedView] = useState('home');


  const handleSelectedView=(selected:string)=>{
    console.log(selected)
    setSelectedView(selected);
  }

  return(
    <>
      <div className='main'>
        <Buttons onSelected = {handleSelectedView} />
      </div>
      <div>
        {selectedView === 'home' && (
          <div className='home'>
            <h2>Home</h2>
          </div>
        )}
      </div>
      <div>
        {selectedView === 'contestants' && (
          <div className='contestants'>
            <ContestantTable />
          </div>
        )}
      </div>
    </>
  )
}
