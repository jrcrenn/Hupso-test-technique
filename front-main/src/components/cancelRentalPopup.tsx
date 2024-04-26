import React, { useState } from 'react';
import { ApiCancelBooking } from '../services/bookingsAPI';

// Interface pour représenter la structure d'un livre
interface Book {
    id: number;
    status: string;
}

// Props attendues par le composant CancelRentalPopup
interface RentalPopupProps {
    booking: Book;
    reloadRentals: () => void;
}

function CancelRentalPopup({ booking, reloadRentals }: RentalPopupProps) {
    // État local pour gérer l'ouverture du dialogue et les erreurs
    const [dialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState('');

    // Fonction pour confirmer l'annulation de la réservation
    const handleConfirmCancel = async () => {
        try {
            // Appel à l'API pour annuler la réservation
            const response = await ApiCancelBooking(booking.id);
            // Si la requête est réussie, ferme le dialogue et recharge la liste des réservations
            if (response.status === 200) {
                setDialogOpen(false);
                reloadRentals();
            } else {
                // Si la requête échoue, récupère les données d'erreur et les affiche
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            // En cas d'erreur lors de la requête, affiche un message d'erreur générique
            console.error('Error cancelling booking:', error);
            setError('An error occurred while cancelling the booking.');
        }
    };

    // Fonction pour annuler l'ouverture du dialogue
    const handleCancelButton = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            {/* Affiche le bouton d'annulation uniquement si le statut de réservation est "active" */}
            {booking.status === 'active' && (
                <button onClick={() => setDialogOpen(true)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Annuler</button>
             )}
             
            {/* Affiche le dialogue d'annulation s'il est ouvert */}
            {dialogOpen && (
                <>
                    {/* Fond noir semi-transparent pour l'arrière-plan */}
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

                    {/* Fenêtre de dialogue */}
                    <dialog open className="fixed inset-0 z-50 flex">
                        <div className="p-8">
                            <h2 className="text-lg font-bold mb-5">Annulation de la réservation d'un livre</h2>
                            <p className="text-basetext-sm mb-5">Êtes-vous sûr de vouloir annuler la réservation de ce livre ?</p>
                            {/* Affiche les erreurs en cas de problème avec l'annulation */}
                            <p className="text-red-500 text-sm mb-5">{error}</p>
                            {/* Boutons pour confirmer ou annuler l'annulation */}
                            <div className="mt-4 flex justify-start">
                                <button className="px-4 py-2 bg-black text-white rounded-md mr-2" onClick={handleConfirmCancel}>Confirmer</button>
                                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" onClick={handleCancelButton}>Annuler</button>
                            </div>
                        </div>
                    </dialog>
                </>
            )}
        </div>
    );
}

export default CancelRentalPopup;
