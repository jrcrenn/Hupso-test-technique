import { useState, useEffect } from 'react';
import Input from '../../components/auth/input';
import { Link, useLocation } from 'react-router-dom';
import { ApiUserLogin } from '../../services/userApi';

function Login() {
    // États pour gérer les données du formulaire et les messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Récupérer les paramètres de l'URL avec useLocation
    const location = useLocation();

    // Effet pour afficher un message de succès si l'utilisateur vient de s'inscrire
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');
        if (success) {
            setSuccessMessage("Votre compte a été créé avec succès. Veuillez vous connecter.");
        }
    }, [location]);

    // Fonction pour gérer la soumission du formulaire de connexion
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Vérifier si les champs email et mot de passe sont remplis
        if (email === '' || password === '') {
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        // Appel de l'API pour l'authentification de l'utilisateur
        const response = await ApiUserLogin(email, password);

        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            // Redirection vers la page d'accueil après connexion réussie
            window.location.href = '/';
        } else {
            const data = await response.json();
            setError(data.message);
        }
    }

    return (
        <>
            {/* Formulaire de connexion */}
            <form onSubmit={handleLogin}>
                <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
                    <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                            <div className="px-5 py-7">
                                {/* Champ de saisie pour l'email */}
                                <Input labelName="Email" inputType="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {/* Champ de saisie pour le mot de passe */}
                                <Input labelName="Password" inputType="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {/* Affichage des erreurs */}
                                <p className="text-sm text-red-500 pb-3">{error}</p>
                                {/* Affichage du message de succès */}
                                {successMessage && <p className="text-sm text-green-500 pb-3">{successMessage}</p>}
                                {/* Bouton de connexion */}
                                <button type="submit" className="transition duration-200 bg-black text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center">
                                    Se connecter
                                </button>
                                {/* Lien vers la page d'inscription */}
                                <Link to="/register" className="block text-center text-xs text-blue-500 pt-5">Pas encore inscrit ?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Login;
