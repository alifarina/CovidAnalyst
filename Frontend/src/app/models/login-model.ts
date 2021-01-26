export class LoginModel {
  id: string;
  username: string;
  password: string;
  isAuthenticated: boolean;
  loginTypes: string[];
  loginTypeSelected: string;
  name: string;
}
export class LoginResponse {
  success: boolean;
  id: string;
}
export class RegisterModel {
  username: string;
  password: string;
  loginTypeSelected: string;
  confirmPassword: string;
  name: string;
  sex: string;
  age: number;
  location: string;
  bloodGroup: string;
}

export class RegisterResponseModel{
  id: string;
  loginTypeSelected: string;  
  name: string;
  sex: string;
  age: number;
  location: string;
  bloodGroup: string;
  success: boolean;
}