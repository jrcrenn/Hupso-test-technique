<?php

namespace App\Entity;

use App\Repository\BookRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BookRepository::class)]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['book_read','booking_read'])]
    private ?int $id = null;

    #[Groups(['book_read', 'booking_read'])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Groups(['book_read', 'booking_read'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[Groups(['book_read','booking_read'])]
    #[ORM\Column(length: 255)]
    private ?string $author = null;

    #[Groups(['book_read','booking_read'])]
    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $publishedAt;

    #[Groups(['book_read','booking_read'])]
    #[ORM\Column(length: 255)]
    private ?string $category = null;

    #[Groups(['book_read','booking_read'])]
    #[ORM\Column(length: 255)]
    private ?string $secondCategory = null;

    // Méthodes d'accès aux propriétés

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(\DateTimeImmutable $publishedAt): self
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getSecondCategory(): ?string
    {
        return $this->secondCategory;
    }

    public function setSecondCategory(?string $secondCategory): self
    {
        $this->secondCategory = $secondCategory;

        return $this;
    }
}
