export default interface CreateUserPayload {
  fullName?: string | null;
  email: string;
  password: string;
}
