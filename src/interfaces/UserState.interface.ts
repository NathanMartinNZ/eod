import User from '../interfaces/User.interface'

export default interface UserState {
  user: User;
  setUser: (user:any) => void;
  clearUser: () => void;
}