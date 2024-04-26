import Navbar from "../components/navbar"
import BookCard from "../components/bookCard"
import { useEffect, useState } from "react";
import { ApiGetBooks } from "../services/booksAPI";
import { ApiGetBookings } from '../services/bookingsAPI';
import Sidebar from "../components/sidebar";

function Home(){
    // States pour les filtres et la liste des livres
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [secondCategory, setSecondCategory] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // Cette fonction s'exécute chaque fois que le status est modifié et quand la réinitialisation est demandée
        if (title === '' && date === '' && category === '' && secondCategory === '' && status === '') {
            getBooks();
        }
    }, [title, date, category, secondCategory, status]); 

    // Fonction pour obtenir les réservations et mettre à jour l'état des livres
    const getBookings = async (bookData: any) => {
        const bookings = await ApiGetBookings();
        if(bookings.status === 200){
            const bookingsData = await bookings.json();
            const currentDate = new Date().toLocaleDateString('fr-FR');
            const booksWithReservationStatus = bookData.map((book: any) => {
                // Vérifier si le livre est réservé avec la date actuelle et si le statut est actif
                const isReserved = bookingsData.some((booking: any) => {
                    const startDate = new Date(booking.startDate).toLocaleDateString('fr-FR')
                    const endDate = new Date(booking.endDate).toLocaleDateString('fr-FR')
                    return booking.book.id === book.id && booking.status === 'active' && startDate <= currentDate && endDate > currentDate;
                });
                return {
                    ...book,
                    isReserved,
                };
            });

            // Filtrer par statut
            if(status === 'reserved'){
                setBooks(booksWithReservationStatus.filter((book: any) => book.isReserved));
            } else if (status === 'disponible'){
                setBooks(booksWithReservationStatus.filter((book: any) => book.isReserved === false));
            } else {
                setBooks(booksWithReservationStatus);
            }
        }
    };

    // Fonction pour mettre à jour l'état des livres
    const updateIsReserved = () => {
        getBookings(books);
    }

    // Fonction pour obtenir la liste des livres
    const getBooks = async () => {
        setBooks([]);
        const books = await ApiGetBooks(title, category, date, secondCategory || ''); // Passer la valeur de la sous-catégorie ici
    
        if (books.status === 200) {
            let booksData = await books.json();
            getBookings(booksData);
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                {/* Barre latérale pour les filtres */}
                <Sidebar
                    title={title}
                    setTitle={setTitle}
                    date={date}
                    setDate={setDate}
                    category={category}
                    setCategory={setCategory}
                    secondCategory={secondCategory}
                    setSecondCategory={setSecondCategory}
                    status={status}
                    setStatus={setStatus}
                    getBooks={getBooks}
                    resetFilters={() => {
                        setTitle('');
                        setDate('');
                        setCategory('');
                        setSecondCategory('');
                        setStatus('');
                        getBooks();
                    }}
                />
                <div className="w-3/4 p-4">
                    <h1 className="text-3xl font-bold text-black mb-5 text-center">Liste des livres</h1>
                    <div className="flex flex-wrap items-center">
                        {/* Affichage des cartes de livre */}
                        {books.map((book, index) => (
                            <div key={index} className="w-1/4 p-2">
                                <BookCard book={book} updateIsReserved={updateIsReserved} />
                            </div>
                        ))}
                    </div>
                    {/* Affichage d'un message si aucun livre n'est trouvé */}
                    {!books.length && (
                        <div className="flex justify-center items-center h-96">
                            <h1 className="text-2xl font-bold text-gray-500">Aucun livre trouvé</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home
