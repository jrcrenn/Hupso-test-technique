import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiGetBookingByUser } from "../services/bookingsAPI";
import CancelRentalPopup from "../components/cancelRentalPopup";

interface Rental {
    id: number;
    startDate: Date;
    endDate: Date;
    book: {
        id: number;
        author: string;
        title: string;
    };
    status: string;
}

function Home() {
    // État pour stocker les réservations
    const [rentals, setRentals] = useState<Rental[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getMyRental();
    }, []);

    // Fonction pour obtenir les réservations de l'utilisateur
    const getMyRental = async () => {
        const rental = await ApiGetBookingByUser();
        if (rental.status === 200) {
            const rentalData = await rental.json();
            setRentals(rentalData);
        }
    };

    // Fonction pour recharger les réservations
    const reloadRentals = () => {
        getMyRental();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <h1 className="text-3xl font-bold text-black my-5 flex justify-center pb-5">Mes réservations</h1>
            {rentals.length === 0 && (
                <div className="flex justify-center items-center h-96">
                    <h1 className="text-2xl font-bold text-gray-500">Aucune réservation trouvée</h1>
                </div>
            )}

            {rentals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {rentals.map((rental: Rental) => (
                        <div key={rental.id} className="bg-white rounded-lg overflow-hidden shadow-lg flex">
                            <div className="flex flex-col flex-grow">
                                <div className="px-6 py-4">
                                    <div className="font-bold text-xl mb-2">{rental.book.title}</div>
                                    <p className="text-gray-700 text-base mb-2">Auteur: {rental.book.author}</p>
                                    <p className="text-gray-700 text-base mb-2">Date de début: {new Date(rental.startDate).toLocaleDateString('fr-FR')}</p>
                                    <p className="text-gray-700 text-base mb-2">Date de fin: {new Date(rental.endDate).toLocaleDateString('fr-FR')}</p>
                                    <p className={`inline-block text-sm font-semibold px-3 py-1 rounded-full ${rental.status === 'active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                        {rental.status === 'active' ? 'Actif' : 'Annulée'}
                                    </p>
                                </div>
                                <div className="px-6 py-4 flex justify-center">
                                    <button onClick={() => navigate(`/book/${rental.book.id}`)} className="whitespace-nowrap px-2 py-1 bg-black text-white rounded-md mr-3">Voir le livre</button>
                                    <CancelRentalPopup reloadRentals={reloadRentals} booking={rental} />
                                </div>
                            </div>
                            <div className="flex justify-center items-center mr-6">
                                <img
                                    className="w-48 h-auto"
                                    src={`https://picsum.photos/seed/${rental.book.id}/300/400`}
                                    alt={`Random ${rental.book.title}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
