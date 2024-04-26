// Fonction pour effectuer la connexion de l'utilisateur
export const ApiUserLogin = async (email: string, password: string) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/login_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        return response;
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}

// Fonction pour enregistrer un nouvel utilisateur
export const ApiUserRegister = async (email: string, password: string, prenom: string, nom: string) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, prenom, nom })
        });

        return response;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error; // Propager l'erreur pour la gérer où cette fonction est appelée
    }
}
