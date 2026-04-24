import { Component, inject, OnInit, signal } from '@angular/core';
import { BooksService } from '../../books.service';
import { Book } from '../../book.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  private bookService = inject(BooksService);
  books = signal<Book[]>([]);

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(data => this.books.set(data));
  }
} 
