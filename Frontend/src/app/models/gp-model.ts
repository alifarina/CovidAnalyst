export class GPDetails {
  id: string;
  name: string;
  sex: string;
  age: number;
  location: string;
  alreadyConsulted: number;
  consultationText: string = '';
  isCovidTestRequired: number = 0;
}

export class GPResponse {
  success: boolean;
  gpId: string;
}
