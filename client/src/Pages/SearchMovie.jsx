import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AddMovie } from '../Store/AuthSlice.js';
const SearchMovie = () => {
    const [movies, setMovies] = useState([]);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const getMovies = async (title = 'kalki') => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=14c12858&s=${title}`);
            setMovies(response.data.Search || []);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const handleClick = (movie)=>{
        console.log(movie)
        dispatch(AddMovie(movie))
        navigate('/add-content')
    }

    return (
        <div className="w-full text-black max-w-md mx-auto bg-white shadow-lg rounded-lg p-4">
            <p className="text-lg font-semibold mb-4 text-center">Select Your Movie :</p>
            <input 
                onChange={(e) => getMovies(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Search for a movie..."
            />
            <div className="space-y-4">
                {movies?.map((movie) => (
                    <button onClick={()=> handleClick(movie)} key={movie.imdbID} className="flex w-full items-center space-x-4 p-2 border border-gray-200 rounded-lg">
                        <img 
                            className="w-16 h-16 object-cover rounded-md" 
                            src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"} 
                            alt={movie.Title} 
                        />
                        <p className="text-sm font-medium">{movie.Title}</p>
                        <p className="text-sm font-medium"> |  Year - {movie.Year}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchMovie;
