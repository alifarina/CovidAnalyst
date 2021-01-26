import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  async getPostResponse(obj: any, url: string, headers: HttpHeaders) {
    return await this.http.post(url, obj, { headers: headers }).toPromise();
  }
  async getPutResponse(obj: any, url: string, headers: HttpHeaders) {
    return await this.http.put(url, obj, { headers: headers }).toPromise();
  }
  async getGetResponse(url: string, headers: HttpHeaders, params?:HttpParams) {
    return await this.http.get(url, { headers: headers,params: params}).toPromise();
  }
}
