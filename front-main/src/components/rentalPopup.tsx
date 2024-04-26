import React, { useState } from 'react';
import { ApiCreateBooking } from '../services/bookingsAPI';

interface RentalPopupProps {
    book_id: number;
    is_reserved: boolean;
    updateIsReserved: () => void;
}

function RentalPopup({ book_id, is_reserved, updateIsReserved }: RentalPopupProps) {
    // Fonction pour obtenir la date actuelle en format YYYY-MM-DD
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0, donc +1; padStart pour ajouter un zéro si nécessaire
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // États locaux pour la gestion des dates, du dialogue et des erreurs
    const [startDate, setStartDate] = useState(getCurrentDate());  // Date de début par défaut à aujourd'hui
    const [endDate, setEndDate] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState('');

    // Fonction pour confirmer la réservation
    const handleConfirmReservation = async () => {
        // Vérifie si les dates de début et de fin sont remplies
        if(startDate === '' || endDate === '') {
            setError('Veuillez remplir les dates de début et de fin');
            return;
        }

        // Appel à l'API pour créer une réservation
        const rental = await ApiCreateBooking(book_id, startDate, endDate);

        // Si la réservation est réussie, met à jour l'état des réservations et ferme le dialogue
        if (rental.ok) {
            updateIsReserved();
            setDialogOpen(false);
        } else {
            // Sinon, affiche une alerte d'erreur
            alert('Erreur lors de la réservation');
        }
    };

    // Fonction pour annuler l'ouverture du dialogue
    const handleCancel = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            {/* Bouton pour louer, désactivé si déjà réservé */}
            <button disabled={is_reserved} onClick={() => setDialogOpen(true)} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400">
                { is_reserved ? 'Déjà réservé' : 'Louer'}
            </button>
            {/* Dialogue pour sélectionner les dates de réservation */}
            {dialogOpen && (
                <>
                    {/* Fond noir semi-transparent pour l'arrière-plan */}
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                    {/* Fenêtre de dialogue */}
                    <dialog open className="fixed inset-0 z-50 flex">
                        <div className="p-8">
                            <h2 className="text-lg font-bold mb-5">Sélectionner les dates pour la réservation</h2>
                            {/* Champ pour la date de début */}
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Date de début :</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"/>
                            {/* Champ pour la date de fin */}
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Date de fin :</label>
                            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full" />
                            {/* Affichage des erreurs */}
                            <p className="text-red-500 text-sm mb-5">{error}</p>
                            {/* Boutons pour confirmer ou annuler la réservation */}
                            <div className="mt-4 flex justify-end">
                                <button className="px-4 py-2 bg-black text-white rounded-md mr-2" onClick={handleConfirmReservation}>Réserver</button>
                                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" onClick={handleCancel}>Annuler</button>
                            </div>
                        </div>
                    </dialog>
                </>
            )}
        </div>
    );
}

export default RentalPopup;
