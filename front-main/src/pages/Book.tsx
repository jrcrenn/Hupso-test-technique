import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import { ApiGetBookById } from "../services/booksAPI";

interface BookType {
    id: number;
    author: string;
    title: string;
    publishedAt: string;
    category: string;
    secondCategory?: string;
    description: string;
}

function Book() {
    // Récupération de l'ID du livre depuis les paramètres de l'URL
    const { id } = useParams();
    const [book, setBook] = useState<BookType | null>(null);

    useEffect(() => {
        // Chargement du livre au montage du composant
        getBookById();
    }, []);

    // Fonction pour récupérer les détails du livre par son ID
    const getBookById = async () => {
        if (id === undefined) return;

        const bookResponse = await ApiGetBookById(id);
        if (bookResponse.status === 200) {
            const data = await bookResponse.json();
            // Formatage de la date en un format plus lisible
            data.publishedAt = new Date(data.publishedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
            });
            setBook(data);
        } else {
            // Redirection vers la page d'accueil en cas d'erreur
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <h1 className="text-3xl font-bold text-black my-5 flex justify-center">Information du livre</h1>
            <div className="flex items-center justify-center pt-5 px-5">
                {book && (
                    // Affichage des détails du livre si le livre est chargé
                    <div className="relative flex w-full max-w-[48rem] flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                        <div className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
                            <img
                                src={`https://picsum.photos/seed/${book.id}/300/400`}
                                alt="Book Cover"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h6 className="mb-2 font-semibold uppercase text-black">
                                {book.author}
                            </h6>
                            <h4 className="mb-2 block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                                {book.title}
                            </h4>
                            <p className="mb-2 text-sm text-gray-700">
                                <span className="font-semibold">Date de publication :</span> {book.publishedAt}
                            </p>
                            <p className="mb-4 text-sm text-gray-700">
                                <span className="font-semibold">Catégorie :</span> {book.category}
                            </p>
                            {book.secondCategory && (
                                <p className="mb-4 text-sm text-gray-700">
                                    <span className="font-semibold">Deuxième catégorie :</span> {book.secondCategory}
                                </p>
                            )}
                            <p className="mb-8 text-gray-900">
                                {book.description}
                            </p>
                            {/* Bouton pour retourner à la liste des livres */}
                            <Link to="/">
                                <button className="flex items-center gap-2 rounded-lg py-3 px-1 text-xs font-bold uppercase text-black transition-all hover:bg-black hover:text-white" type="button">
                                    Retourner à la liste des livres
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                        ></path>
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Book;
