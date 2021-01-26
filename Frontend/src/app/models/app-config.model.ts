export interface IAppConfig {
  env: {
    name: string;
  };
  apiServer: {
    baseUrl: string;  
    loginUrl: string; 
    patientDailyRecord: string;
    consultations: string;
    registerUrl: string;
    allPatients: string;
  };
}
