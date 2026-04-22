export class User {
  id!: number;
  lastName!: string;
  firstName!: string;
  email!: string;
  password!: string;
  phone!: string;
//   role!: Role;
  registrationDate!: Date;
  active!: boolean;
  blocked!: boolean;
//   borrows!: Borrow[];
//   reservations!: Reservation[];
//   ratings!: Rating[];
  comments!: Comment[];
  notifications!: Notification[];
  token!: string;

  constructor(email: string, password: string, token?: string) {
    this.email = email;
    this.password = password;
    this.token = token ?? '';
  }
}