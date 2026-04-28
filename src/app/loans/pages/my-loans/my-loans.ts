import { Component, inject, OnInit, signal } from '@angular/core';
import { LoanService } from '../../../services/loan';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
  selector: 'app-my-loans',
  imports: [DatePipe,CommonModule],
  templateUrl: './my-loans.html',
  styleUrl: './my-loans.scss',
})
export class MyLoans implements OnInit
{

  loans = signal<any[]>([]);

  private readonly loanService = inject(LoanService);

  ngOnInit(): void {
    const token = sessionStorage.getItem('token'); // ou sessionStorage

    if (token) {
      this.loanService.getLoans(token).subscribe({
        next: (res) => {
          this.loans.set(res.data);// important: API renvoie { code, data, message }
          console.log(this.loans);
        },
        error: (err) => {
          console.error('Erreur API', err);
        }
      });
    }
  }
}
