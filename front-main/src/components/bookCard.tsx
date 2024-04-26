import React from 'react';
import { useNavigate } from 'react-router-dom';
import RentalPopup from './rentalPopup';

// Définition de l'interface Book
interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: Date;
  category: string;
  description: string;
  isReserved: boolean;
  secondCategory?: string;
}

// Props attendues par le composant BookCard
interface BookCardProps {
  book: Book;
  updateIsReserved: () => void;
}

// Définition des couleurs de catégorie
const categoryColors: { [key: string]: string } = {
  Fiction: 'bg-blue-600',
  'Science-fiction': 'bg-green-600',
  Fantasy: 'bg-purple-600',
  Horreur: 'bg-red-600',
  Mystère: 'bg-indigo-600',
  Romance: 'bg-pink-600',
  Aventure: 'bg-yellow-600',
  Biographie: 'bg-gray-600',
  Histoire: 'bg-teal-600',
  Poésie: 'bg-orange-600',
  Thriller: 'bg-red-800',
  Autobiographie: 'bg-gray-800',
  Humour: 'bg-yellow-400',
};

// Composant BookCard
function BookCard({ book, updateIsReserved }: BookCardProps) {
  const navigate = useNavigate();
  const coverImageUrl = `https://picsum.photos/seed/${book.id}/300/400`;

  const publishedAt = new Date(book.publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="md:mx-10 mx-auto my-5 relative max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer">
      <img
        onClick={() => navigate(`/book/${book.id}`)}
        className="w-72"
        src={coverImageUrl}
        alt="Book Cover"
      />
      <div className="absolute bottom-0 w-full bg-white p-4 rounded-b-lg rounded-t-3xl">
        <div className="mb-2">
          <div className="text-gray-900 font-bold text-lg">{book.title}</div>
          <div className="text-gray-900 font-bold text-sm">{book.author}</div>
          <div className="text-gray-600 font-bold text-sm">Date de publication : {publishedAt}</div>
        </div>
        <div className="mb-4">
          {/* Affichage de la catégorie principale */}
          <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold text-white mr-2 ${categoryColors[book.category]}`}>
            {book.category}
          </span>
          {/* Affichage de la deuxième catégorie si elle existe */}
          {book.secondCategory && (
            <span className={`bg-orange-600 inline-block rounded-full px-2 py-1 text-xs font-semibold text-white ${book.secondCategory}`}>
              {book.secondCategory}
            </span>
          )}
        </div>
        <div className="mb-3">
          {/* Affichage de la description avec limite de ligne */}
          <p title={book.description} className="mt-2 text-gray-700 text-xs mb-4 overflow-ellipsis line-clamp-2">
            "{book.description}"
          </p>
        </div>
        {/* Affichage du popup de location */}
        <RentalPopup book_id={book.id} is_reserved={book.isReserved} updateIsReserved={updateIsReserved} />
      </div>
    </div>
  );
}

export default BookCard;
