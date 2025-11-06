import { useState } from 'react'
import SearchForm from './components/SearchForm'
import AddUser from './components/AddUser'
import ResultTable from './components/ResultTable'
import './App.css'

function App() {
  const [kw, setKeyword] = useState("")
  const [newUser, setNewUser] = useState(null)

  return (
    <div className="app-container">
      <div className="search-add-section">
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
      </div>
      <ResultTable 
        keyword={kw} 
        user={newUser} 
        onAdded={() => setNewUser(null)} 
      />
    </div>
  )
}

export default App
