import { Category } from "./category.model";

 export class Book {
    constructor(
      public id: number,
      public category: Category,
      public title: string,
      public author: string,
      public isbn: string,
      public description: string,
      public coverUrl: string,
      public totalCopies: number,
      public availableCopies: number,
      public dateAdded: string,
      public averageRating: number
    ) {}
  }
