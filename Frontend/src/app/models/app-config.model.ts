export interface IAppConfig {
  env: {
    name: string;
  };
  apiServer: {
    baseUrl: string;  
    loginUrl: string; 
    registerUrl: string;
  };
}
