// Fonction pour obtenir les réservations d'un utilisateur
export const ApiGetBookingByUser = async () => {
    try {
        const bookings = await fetch('http://127.0.0.1:8000/api/bookings/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching user's bookings:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}

// Fonction pour obtenir toutes les réservations
export const ApiGetBookings = async () => {
    try {
        const bookings = await fetch('http://127.0.0.1:8000/api/bookings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}

// Fonction pour créer une réservation
export const ApiCreateBooking = async (book_id: number, start_date: string, end_date: string) => {
    try {
        const booking = await fetch('http://127.0.0.1:8000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
            body: JSON.stringify({
                book_id,
                start_date,
                end_date,
            }),
        });
        return booking;
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}

// Fonction pour annuler une réservation
export const ApiCancelBooking = async (id: number) => {
    try {
        const booking = await fetch(`http://127.0.0.1:8000/api/bookings/${id}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
        });
        return booking;
    } catch (error) {
        console.error("Error cancelling booking:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}