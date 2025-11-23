import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useState ,useEffect } from 'react'
import {useDebounce} from 'react-use'
import { updateSearchCount } from '../appwrite'
// const API_BASE_URL = ' https://api.themoviedb.org/3'


const API_KEY=import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL=import.meta.env.VITE_BASE_URL;

const API_OPTIONS={
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}



const App = () => {
  const[searchValue, setSearchValue] = useState('')
  const[errorMessage, setErrorMessage] = useState('')
  const[moviesList,setMoviesList] = useState([])
  const[loading,setLoading] = useState(false)
  const[debounceValue,setDebounceValue]=useState('')
  useDebounce(()=>setDebounceValue(searchValue),500,[searchValue])
  const fetchMovies = async (query = '') =>{
    setLoading(true)
    setErrorMessage('')
    try{
      const endPoint =query ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :`${BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response =await fetch(endPoint,API_OPTIONS)
      const data=await response.json()
      console.log("Fetched movies data:", data);
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Error fetching movies')
        setMoviesList([])
        return
      }
      setMoviesList(data.results || []);
      if (query && data.results.length > 0) {
        alert("Updating search count for: " + query); 
        await updateSearchCount(query, data.results[0]);
      }
    }catch(error){
      console.log("Error fetching movies:", error);
      setErrorMessage('Failed to fetch movies. Please try again later.')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchMovies(debounceValue)
  },[debounceValue])


  return (
    <main >
      <div className='pattern'>

        <div className='wrapper'>
<header className="mt-0 flex flex-col items-center gap-4">
  {/* <img src="./../public/hero-img.png" alt="Hero Banner" className="mt-[-100px] " /> */}
  <img
  src="./../public/hero-img.png"
  alt="Hero Banner"
  className="w-[160px] sm:w-[200px] md:w-[240px] h-auto mt-[-10px] mb-10"
/>

  
  <h1 className="text-center mt-[-80px] ">
    Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
  </h1>
  
  <Search searchValue={searchValue} setSearchValue={setSearchValue} />
</header>


          <section className='mt-2'>
            <div className='flex items-center justify-between mb-4 p-2'>

            <h2>All Movies</h2>
            </div>
            {loading?(
             <Spinner/>
            ): errorMessage ?(
              <p className='text-red-500'>{errorMessage}</p>
            ):(
              <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {moviesList.map((movie)=>(
                  // <p key={movie.id}className='text-white'>{movie.title}</p>
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>

      </div>
    </main>
  )
}

export default App
