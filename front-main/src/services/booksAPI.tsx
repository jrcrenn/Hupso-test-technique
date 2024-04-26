// Fonction pour obtenir une liste de livres avec des filtres optionnels
export const ApiGetBooks = async (title: string, category: string, date: string, secondCategory: string) => {
    try {
        // Construction de l'URL avec les paramètres de requête
        const url = `http://127.0.0.1:8000/api/books?title=${title}&category=${category}&publicationYear=${date}&secondCategory=${secondCategory}`;
        
        // Effectuer la requête GET
        const books = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || ''
            },
        });

        return books;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}

// Fonction pour obtenir un livre par son ID
export const ApiGetBookById = async (id: string) => {
    try {
        // Construction de l'URL avec l'ID du livre
        const url = `http://127.0.0.1:8000/api/books/${id}`;
        
        // Effectuer la requête GET
        const book = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
        });

        return book;
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}
