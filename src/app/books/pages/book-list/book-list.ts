import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BooksService } from '../../books.service';
import { Book } from '../../book.model';
import { RouterLink } from '@angular/router';
import { Category } from '../../category.model';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  private readonly bookService = inject(BooksService);
  books = signal<Book[]>([]);
  categories = signal<Category[]>([]);
  search = signal(''); // barre de recherche état vide 
  activeCategory = signal<Category | null>(null); //  la catégorie sélectionnée
  onlyAvailable = signal(false); // case dispo/tout


    filteredBooks = computed(() => {
      const q = this.search().toLowerCase(); // récupère ce que l'utilisateur a tapé en minuscules
      return this.books().filter(b => { //parcourt chaque livre,  garde ceux true à la condition
        const matchSearch = !q //barre de recherche vide, on accepte tous les livres
          || b.title.toLowerCase().includes(q) //sinon
          || b.author.toLowerCase().includes(q)
          || b.isbn.toLowerCase().includes(q);
        const matchCategory = !this.activeCategory() || b.category.id === this.activeCategory()!.id;
        const matchAvailable = !this.onlyAvailable() || b.availableCopies > 0;
        return matchSearch && matchCategory && matchAvailable;
            });
    });

    onSearch(event: Event): void {
      this.search.set((event.target as HTMLInputElement).value);
    }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(data => this.books.set(data));
    this.bookService.getCategories().subscribe(data => this.categories.set(data));
  }
}
