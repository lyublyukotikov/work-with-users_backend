export default class UserDto {
  email: string;
  id: number;
  role?: 'ADMIN' | 'USER';

  constructor(model: { email: string; id: number; role?: 'ADMIN' | 'USER' }) {
    this.email = model.email;
    this.id = model.id;
    this.role = model.role;
  }
}
