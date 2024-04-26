<?php

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Classe responsable de la récupération et de la manipulation des entités Book dans la base de données.
 *
 * @extends ServiceEntityRepository
 */
class BookRepository extends ServiceEntityRepository
{
    /**
     * Constructeur de la classe.
     *
     * @param ManagerRegistry $registry Le registre du gestionnaire d'entités
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    /**
     * Recherche des livres en fonction de plusieurs filtres.
     *
     * @param string|null $title Le titre du livre (facultatif)
     * @param string|null $category La catégorie du livre (facultatif)
     * @param string|null $publicationYear L'année de publication du livre (facultatif)
     * @param string|null $secondCategory La deuxième catégorie du livre (facultatif)
     * @return array Les livres correspondant aux filtres spécifiés
     */
    public function findByFilters(?string $title, ?string $category, ?string $publicationYear, ?string $secondCategory): array
    {
        // Création de la requête de recherche de base
        $qb = $this->createQueryBuilder('b');
    
        // Ajout des conditions de filtrage en fonction des paramètres non nuls
        if($title) {
            $qb->andWhere('b.title LIKE :title')
                ->setParameter('title', '%'.$title.'%');
        }
    
        if($category) {
            $qb->andWhere('b.category = :category')
                ->setParameter('category', $category);
        }
    
        if ($secondCategory) {
            $qb->andWhere('b.secondCategory = :secondCategory')
                ->setParameter('secondCategory', $secondCategory);
        }
    
        if ($publicationYear) {
            // Convertir l'année en dates de début et de fin de l'année
            $startOfYear = new \DateTime($publicationYear . '-01-01');
            $endOfYear = new \DateTime($publicationYear . '-12-31');
    
            // Ajout de la condition pour filtrer par année de publication
            $qb->andWhere('b.publishedAt BETWEEN :startOfYear AND :endOfYear')
                ->setParameter('startOfYear', $startOfYear)
                ->setParameter('endOfYear', $endOfYear);
        }
        
        // Exécution de la requête et retour des résultats
        return $qb->getQuery()->getResult();
    }    
}
