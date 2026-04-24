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
// DTO avec les données qui vont être envoyées au backend pour l'inscription d'un nouvel utilisateur
export class RegisterRequestDTO {
  lastName!: string;
  firstName!: string;
  email!: string;
  password!: string;
  phone!: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}

