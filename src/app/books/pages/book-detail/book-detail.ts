import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink} from '@angular/router';
import { BooksService } from '../../books.service';
import { Book } from '../../book.model';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BooksService);
  book = signal<Book | null>(null);
  notFound = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.bookService.getBookById(id).subscribe({
      next: data => this.book.set(data), 
      error: ()=> this.notFound.set(true)
    });
  }
}
