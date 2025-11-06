function SearchForm({ onChangeValue }: { onChangeValue: (value: string) => void }) {
  return (
    <div className="search-form">
      <input 
        type="text" 
        placeholder="Tìm theo name, username" 
        onChange={(e) => onChangeValue(e.target.value)} 
      />
    </div>
  )
}

export default SearchForm

