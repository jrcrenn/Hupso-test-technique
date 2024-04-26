<?php

namespace App\Controller;

use App\Entity\Booking;
use App\Entity\Book;
use App\Entity\User;
use App\Repository\BookingRepository;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\UserRepository;
use Symfony\Component\Serializer\SerializerInterface;

class ApiController extends AbstractController
{
    private $entityManager;
    private $userRepository;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }

    // Endpoint pour récupérer une liste de livres avec des filtres
    #[Route('/api/books', name: 'app_api_books')]
    public function getBooks(Request $request, BookRepository $bookRepository, SerializerInterface $serializer): JsonResponse
    {
        // Récupération des paramètres de filtre depuis la requête
        $filters = [
            'title' => $request->query->get('title'),
            'category' => $request->query->get('category'),
            'publicationYear' => $request->query->get('publicationYear'),
            'secondCategory' => $request->query->get('secondCategory') // Ajout du filtre sur secondCategory
        ];
    
        // Utilisation du repository pour rechercher les livres en fonction des filtres
        $books = $bookRepository->findByFilters(
            $filters['title'],
            $filters['category'],
            $filters['publicationYear'],
            $filters['secondCategory'] // Passage du paramètre à la méthode de recherche
        );
        
        // Conversion des résultats en JSON
        $booksData = $serializer->serialize($books, 'json', ['groups' => 'book_read']);
    
        return new JsonResponse($booksData, JsonResponse::HTTP_OK, [], true);
    }    

    // Endpoint pour récupérer un livre par son ID
    #[Route('/api/books/{id}', name: 'app_api_book')]
    public function getBook($id, BookRepository $bookRepository, SerializerInterface $serializer): JsonResponse
    {
        // Recherche du livre par son ID
        $book = $bookRepository->find($id);

        // Vérification si le livre existe
        if (!$book) {
            return new JsonResponse(null, JsonResponse::HTTP_NOT_FOUND);
        }

        // Conversion du livre en JSON
        $bookData = $serializer->serialize($book, 'json', ['groups' => 'book_read']);

        return new JsonResponse($bookData, JsonResponse::HTTP_OK, [], true);
    }

    // Endpoint pour créer une réservation de livre
    #[Route('/api/bookings', name: 'app_api_bookings', methods: ['POST'])]
    public function createBookings(Request $request, BookRepository $bookRepository, SerializerInterface $serializer): JsonResponse
    {
        // Récupération des données JSON de la requête
        $data = json_decode($request->getContent(), true);

        // Vérification des champs obligatoires
        $requiredFields = ['book_id', 'start_date', 'end_date'];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return new JsonResponse(['message' => "Missing $field parameter"], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        // Recherche du livre par son ID
        $book = $bookRepository->find($data['book_id']);

        // Vérification si le livre existe
        if (!$book) {
            return new JsonResponse(['message' => 'Book not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Création de la réservation
        $booking = new Booking();
        $booking->setBook($book)
            ->setStartDate(new \DateTime($data['start_date']))
            ->setEndDate(new \DateTime($data['end_date']))
            ->setStatus('active')
            ->setUser($this->getUser());

        // Enregistrement de la réservation dans la base de données
        $this->entityManager->persist($booking);
        $this->entityManager->flush();

        // Conversion des données en JSON
        $responseData = $serializer->serialize($data, 'json');

        return new JsonResponse($responseData, JsonResponse::HTTP_OK, []);
    }

    // Endpoint pour récupérer toutes les réservations
    #[Route('/api/bookings', name: 'app_api_bookings_get', methods: ['GET'])]
    public function getBookings(BookingRepository $bookingRepository, SerializerInterface $serializer): JsonResponse
    {
        // Récupération de toutes les réservations
        $bookings = $bookingRepository->findAll();

        // Conversion des réservations en JSON
        $bookingsData = $serializer->serialize($bookings, 'json', ['groups' => 'booking_read']);

        return new JsonResponse($bookingsData, JsonResponse::HTTP_OK, [], true);
    }

    // Endpoint pour récupérer les réservations d'un utilisateur spécifique
    #[Route('/api/bookings/user', name: 'app_api_bookings_user_get', methods: ['GET'])]
    public function getBookingsByUser(BookingRepository $bookingRepository, SerializerInterface $serializer): JsonResponse
    {
        // Récupération des réservations de l'utilisateur actuel
        $bookings = $bookingRepository->findByUser($this->getUser());

        // Conversion des réservations en JSON
        $bookingsData = $serializer->serialize($bookings, 'json', ['groups' => 'booking_read']);

        return new JsonResponse($bookingsData, JsonResponse::HTTP_OK, [], true);
    }

    // Endpoint pour annuler une réservation
    #[Route('/api/bookings/{id}/cancel', name: 'app_api_bookings_cancel', methods: ['POST'])]
    public function cancelBooking($id, BookingRepository $bookingRepository, SerializerInterface $serializer): JsonResponse
    {
        // Recherche de la réservation par son ID
        $booking = $bookingRepository->find($id);

        // Vérification si la réservation existe
        if (!$booking) {
            return new JsonResponse(['message' => 'Booking not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Changement du statut de la réservation à "cancelled"
        $booking->setStatus('cancelled');
        $this->entityManager->flush();

        // Conversion de la réservation en JSON
        $bookingData = $serializer->serialize($booking, 'json', ['groups' => 'booking_read']);

        return new JsonResponse($bookingData, JsonResponse::HTTP_OK, [], true);
    }

    // Endpoint pour enregistrer un nouvel utilisateur
    #[Route('/api/register', name: 'app_api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        // Récupération des données JSON de la requête
        $data = json_decode($request->getContent(), true);
    
        // Extraction des champs email, password, prenom et nom
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $prenom = $data['prenom'] ?? null;
        $nom = $data['nom'] ?? null;
    
        // Vérification si les champs requis sont présents
        if (!$email || !$password || !$prenom || !$nom) {
            return new JsonResponse(['message' => 'Email, password, prenom, or nom missing'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Vérification du format de l'email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['message' => 'Invalid email format'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Vérification si l'email est déjà utilisé
        $user = $this->userRepository->findOneBy(['email' => $email]);
        if ($user) {
            return new JsonResponse(['message' => 'Email already in use'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Création d'un nouvel utilisateur
        $user = new User();
        $user->setEmail($email)
            ->setPassword($this->passwordHasher->hashPassword($user, $password))
            ->setRoles(['ROLE_USER'])
            ->setPrenom($prenom)
            ->setNom($nom);
    
        // Enregistrement de l'utilisateur dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    
        return new JsonResponse(['message' => 'User registered'], JsonResponse::HTTP_CREATED);
    }
}
