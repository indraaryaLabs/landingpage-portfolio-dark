import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <>
      <Navigation />
      <main className="relative z-10 pt-32 md:pt-48 pb-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-12 text-center items-center">
        <h1 className="text-4xl font-bold">Project Details: {id}</h1>
        <p className="text-zinc-400">This is a placeholder page for individual projects.</p>
        <Link to="/" className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors">
          Go Back Home
        </Link>
      </main>
    </>
  );
}
