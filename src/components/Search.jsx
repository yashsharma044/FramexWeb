import React from 'react';

const Search = ({searchValue, setSearchValue}) => {
  return (
    <div className='search'>
        <div>
            <img src="/search.svg" alt="Search Icon" />
            <input 
            type="text"
            placeholder='Search through thousands of Movies' 
            value={searchValue}
            onChange={(e)=>setSearchValue(e.target.value)}/>
        </div>
    </div>
  );
}

export default Search;
