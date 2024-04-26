import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { PowerIcon } from '@heroicons/react/24/solid';

function Navbar() {
  // Fonction pour gérer la déconnexion de l'utilisateur
  function handleLogout() {
    // Supprime le token de l'utilisateur de la mémoire locale
    localStorage.removeItem('token');
    // Redirige l'utilisateur vers la page de connexion
    window.location.href = '/login';
  }

  return (
    <nav className="font-sans flex flex-col sm:flex-row sm:text-left sm:justify-end py-4 px-6 bg-white shadow sm:items-center w-full">
        <div className="flex flex-col sm:flex-row">
            {/* Lien vers la liste des livres */}
            <Link to="/" className="md:mr-5 px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white hover:bg-black">
              <BookOpenIcon className="h-5 w-5 mr-2 inline-block" /> Liste des livres
            </Link>
            {/* Lien vers les réservations de l'utilisateur */}
            <Link to="/reservations" className="md:mr-5 px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg md:mt-0 md:ml-4 hover:text-white hover:bg-black">
              <BookOpenIcon className="h-5 w-5 mr-2 inline-block" /> Mes réservations
            </Link>
            {/* Bouton de déconnexion */}
            <a onClick={handleLogout} className="md:mr-5 px-4 py-2 mt-2 text-sm font-semibold text-white bg-black rounded-lg  md:mt-0 md:ml-4 hover:bg-red-500 cursor-pointer">
              <PowerIcon className="h-5 w-5 mr-2 inline-block" /> Se déconnecter
            </a>
        </div>
    </nav>
  );
}

export default Navbar;
