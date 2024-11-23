import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AddMovie } from '../Store/AuthSlice.js';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const SearchMovie = () => {
    const [movies, setMovies] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getMovies = async (title = 'kalki') => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=14c12858&s=${title}`);
            setMovies(response.data.Search || []);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const handleClick = (movie) => {
        dispatch(AddMovie(movie));
        navigate('/add-content');
    };

    return (
        <div className='w-full h-full flex bg-gradient-to-b from-black via-[#14061F] to-blac'>
        <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-lg rounded-lg transform transition-all duration-300 hover:shadow-2xl">
            <p className="text-xl font-bold text-center text-gray-700 mb-6">Select Your Movie</p>
            <input 
                onChange={(e) => getMovies(e.target.value)}
                className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-shadow duration-200 placeholder-gray-500"
                type="text"
                placeholder="Search for a movie..."
            />
            
            {movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-600 mt-10 space-y-2">
                    <SearchOffIcon style={{ fontSize: 60, color: "#9e9e9e" }} />
                    <p className="text-lg font-semibold">No Movies Found</p>
                    <p className="text-sm text-gray-500">Please check your spelling or try a different search term.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {movies.map((movie) => (
                        <button 
                            onClick={() => handleClick(movie)} 
                            key={movie.imdbID} 
                            className="flex items-center w-full p-4 space-x-4 bg-white border border-gray-300 rounded-lg shadow-sm transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                        >
                            <img 
                                className="w-16 h-16 object-cover rounded-md shadow-md" 
                                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"} 
                                alt={movie.Title} 
                            />
                            <div className="flex flex-col justify-center">
                                <p className="text-md font-semibold text-gray-700">{movie.Title}</p>
                                <p className="text-sm text-gray-500">Year: {movie.Year}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
        </div>
    );
};

export default SearchMovie;
