import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(path: string) { return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() }); }
  post<T>(path: string, body: any) { return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() }); }
  put<T>(path: string, body: any) { return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.getHeaders() }); }
  delete<T>(path: string) { return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.getHeaders() }); }

  private getHeaders() {
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = sessionStorage.getItem('auth');
    if (token) {
      h = h.set('Authorization', 'Basic ' + token);
    }
    return h;
  }
}
