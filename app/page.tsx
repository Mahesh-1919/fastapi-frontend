"use client";
import React, { useState, useEffect } from "react";

type MovieData = {
  id: number;
  movie_name: string;
  director_name: string;
  release_date: string;
};

const Page = () => {
  const [movieData, setMovieData] = useState<MovieData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
      if (response.ok) {
        const data: MovieData[] = await response.json();
        setMovieData(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load movie data. Please try again later.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formdata = new FormData(event.currentTarget);
    const movieName = formdata.get("movieName") as string;
    const directorName = formdata.get("diector") as string;
    const releaseDate = formdata.get("date") as string;
    console.log({ movieName, directorName, releaseDate });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieName, directorName, releaseDate }),
    });
    await fetchData();
  };

  return (
    <div>
      <h1 className="text-4xl text-black text-center p-8 font-bold font-serif">
        Movie Shop
      </h1>
      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center justify-center gap-8 text-black mb-8"
      >
        <div className="flex gap-8 flex-wrap justify-center w-full">
          <input
            type="text"
            name="movieName"
            placeholder="Movie name"
            className="p-4 rounded-md shadow-xl bg-white/90"
            required
          />
          <input
            type="text"
            name="diector" // Consider changing this to "director" for clarity
            placeholder="Director Name"
            className="p-4 rounded-md shadow-xl bg-white/90"
            required
          />
          <input
            type="date"
            name="date"
            className="p-4 rounded-md shadow-xl bg-white/90"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#964B00] text-white rounded-md px-8 py-2 shadow-xl"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {movieData?.map((data: MovieData) => (
        <div key={data.id} className="border p-4 m-2 rounded-md">
          <p>
            <strong>Movie Name:</strong> {data.movie_name}
          </p>
          <p>
            <strong>Director:</strong> {data.director_name}
          </p>
          <p>
            <strong>Release Date:</strong> {data.release_date}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Page;
