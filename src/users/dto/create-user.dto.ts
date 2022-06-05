export class CreateUserDto {
  public id: number;
  public firstName: string;
  public lastName: string;
  public age: number;
  public phone: string;
  public email: string;
  readonly password: string;
}
