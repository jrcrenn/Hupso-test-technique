<?php

namespace App\DataFixtures;

use App\Entity\Book;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $this->createBookFixture($manager);
    }

    public function createBookFixture(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');
        
        // Liste de catégories de livres et leurs sous-catégories
        $categories = [
            'Fiction' => ['Roman', 'Nouvelle'],
            'Science-fiction' => ['Dystopie', 'Uchronie'],
            'Fantasy' => ['Épique', 'Médiévale'],
            'Horreur' => ['Psychologique', 'Gore'],
            'Mystère' => ['Policier', 'Enquête'],
            'Romance' => ['Contemporaine', 'Historique'],
            'Aventure' => ['Exploration', 'Survie'],
            'Biographie' => ['Autobiographie', 'Mémoires'],
            'Histoire' => ['Ancienne', 'Moderne'],
            'Poésie' => ['Classique', 'Contemporaine'],
            'Thriller' => ['Politique', 'Action'],
            'Autobiographie' => ['Jeunesse', 'Adulte'],
            'Humour' => ['Satire', 'Parodie']
        ];
    
        for($i = 0; $i < 30; $i++) {
            $book = new Book();
    
            $mainCategory = array_rand($categories); // Sélection aléatoire d'une catégorie principale
            $subCategories = $categories[$mainCategory]; // Récupération des sous-catégories de la catégorie principale
    
            $book->setTitle(ucfirst($faker->words(3, true)))
                ->setDescription($faker->paragraph(2))
                ->setAuthor($faker->name())
                ->setCategory($mainCategory)
                ->setSecondCategory($subCategories[array_rand($subCategories)]) // Sélection aléatoire d'une sous-catégorie
                ->setPublishedAt(\DateTimeImmutable::createFromMutable($faker->dateTime()));
    
            $manager->persist($book);
            $this->addReference('book_' . $i, $book);
        }
    
        $manager->flush();
    }
}
