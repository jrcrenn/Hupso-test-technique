import React, { useState, useEffect } from 'react';

// Interface pour les props du composant Sidebar
interface SidebarProps {
    title: string;
    setTitle: (value: string) => void;
    date: string;
    setDate: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    secondCategory?: string;
    setSecondCategory: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    getBooks: () => void;
    resetFilters: () => void;
}

function Sidebar({
    title, setTitle, date, setDate, category, setCategory, secondCategory, setSecondCategory,
    status, setStatus, getBooks, resetFilters
}: SidebarProps) {
    // État local pour les sous-catégories
    const [subcategories, setSubcategories] = useState<string[]>([]);

    // Définition des catégories et de leurs sous-catégories associées
    const categories: {[key: string]: string[]} = {
        'Fiction': ['Roman', 'Nouvelle'],
        'Science-fiction': ['Dystopie', 'Uchronie'],
        'Fantasy': ['Épique', 'Médiévale'],
        'Horreur': ['Psychologique', 'Gore'],
        'Mystère': ['Policier', 'Enquête'],
        'Romance': ['Contemporaine', 'Historique'],
        'Aventure': ['Exploration', 'Survie'],
        'Biographie': ['Autobiographie', 'Mémoires'],
        'Histoire': ['Ancienne', 'Moderne'],
        'Poésie': ['Classique', 'Contemporaine'],
        'Thriller': ['Politique', 'Action'],
        'Autobiographie': ['Jeunesse', 'Adulte'],
        'Humour': ['Satire', 'Parodie']    
    };

    // Effet pour mettre à jour les sous-catégories en fonction de la catégorie sélectionnée
    useEffect(() => {
        if (category && categories[category]) {
            setSubcategories(categories[category]);
            setSecondCategory('');
        } else {
            setSubcategories([]);
            setSecondCategory('');
        }
    }, [category]);

    // Gestion du changement de la sous-catégorie sélectionnée
    const handleSecondCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSecondCategory = e.target.value;
        setSecondCategory(selectedSecondCategory);
    };

    return (
        <div className="w-auto flex-shrink-0 bg-white p-4 shadow">
            <h1 className="text-2xl font-bold text-black mb-4 text-center">Filtres</h1>
            <div className="flex flex-col space-y-2">
                {/* Champ de saisie pour le titre */}
                <div className="flex items-center">
                    <label className="mr-1">Titre :</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 " />
                </div>
                {/* Champ de saisie pour l'année */}
                <div className="flex items-center">
                    <label className="mr-1">Année :</label>
                    <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 " />
                </div>
                {/* Sélecteur de catégorie */}
                <div className="flex items-center">
                    <label className="mr-1">Catégorie :</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 ">
                        <option value="">Toutes les catégories</option>
                        {Object.keys(categories).map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {/* Sélecteur de sous-catégorie, affiché uniquement si des sous-catégories existent */}
                {subcategories.length > 0 && (
                    <div className="flex items-center">
                        <label className="mr-1">Sous-catégorie :</label>
                        <select
                            value={secondCategory}
                            onChange={handleSecondCategoryChange}
                            className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 "
                        >
                            <option value="">Toutes les sous-catégories</option>
                            {subcategories.map((sub, index) => (
                                <option key={index} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Sélecteur de statut */}
                <div className="flex items-center">
                    <label className="mr-1">Status :</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 ">
                        <option value="">Tous les status</option>
                        <option value="disponible">Disponible</option>
                        <option value="reserved">Réservé</option>
                    </select>
                </div>
                {/* Boutons pour appliquer ou réinitialiser les filtres */}
                <div className="flex justify-between">
                    <button onClick={getBooks} className="bg-black text-white px-5 py-2 rounded-md mt-3">Filtrer</button>
                    <button onClick={resetFilters} className="bg-gray-500 text-white px-5 py-2 rounded-md mt-3">Réinitialiser</button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
