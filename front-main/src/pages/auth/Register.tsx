import { useState } from 'react';
import Input from '../../components/auth/input';
import { Link } from 'react-router-dom';
import { ApiUserRegister } from '../../services/userApi';

function Register() {
    // États pour gérer les données du formulaire et les messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [error, setError] = useState('');

    // Fonction pour gérer la soumission du formulaire d'inscription
    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Vérification des champs requis
        if (email === '' || password === '' || prenom === '' || nom === '') {
            setError('Veuillez remplir tous les champs');
            return;
        }

        // Vérification de la correspondance des mots de passe
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        // Appel de l'API pour l'inscription de l'utilisateur
        const response = await ApiUserRegister(email, password, prenom, nom);

        if (response.status === 201) {
            // Redirection vers la page de connexion avec un message de succès
            window.location.href = '/login?success=true';
        } else {
            const data = await response.json();
            setError(data.message);
        }
    }

    return (
        <>
            {/* Formulaire d'inscription */}
            <form onSubmit={handleRegister}>
                <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
                    <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                        <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
                            <div className="px-5 py-7">
                                {/* Champ de saisie pour le prénom */}
                                <Input labelName="Prénom" inputType="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                                {/* Champ de saisie pour le nom */}
                                <Input labelName="Nom" inputType="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                                {/* Champ de saisie pour l'email */}
                                <Input labelName="Email" inputType="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                {/* Champ de saisie pour le mot de passe */}
                                <Input labelName="Password" inputType="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {/* Champ de saisie pour la confirmation du mot de passe */}
                                <Input labelName="Confirm password" inputType="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                {/* Affichage des erreurs */}
                                <p className="text-sm text-red-500 pb-3">{error}</p>
                                {/* Bouton d'inscription */}
                                <button type="submit" className="transition duration-200 bg-black text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center">
                                    S'enregistrer
                                </button>
                                {/* Lien vers la page de connexion */}
                                <Link to="/login" className="block text-center text-xs text-blue-500 pt-5">Déjà inscrit ?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default Register;
