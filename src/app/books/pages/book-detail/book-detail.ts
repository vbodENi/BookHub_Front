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
  isLoggedIn = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    const token = sessionStorage.getItem('token');
    this.isLoggedIn.set(!!token);

    this.bookService.getBookById(id).subscribe({
      next: data => this.book.set(data), 
      error: ()=> this.notFound.set(true)
    });
  }

  borrow(): void {
    const b = this.book();
    if (!b) return;

    this.bookService.borrowBook(b.id).subscribe({
      next: (res: any) => {
        alert(res.message); // message "Success loan"
      },
      error: (err) => {
        const msg = err?.error?.message || 'Erreur inconnue';
        console.log(msg);
      }
    });
  }
}
