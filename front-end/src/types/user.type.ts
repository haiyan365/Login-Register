export default interface IUser {
  id?: any | null,
  firstname?: string | null,
  lastname?: string | null,
  email?: string,
  password?: string,
  roles?: Array<string>
}