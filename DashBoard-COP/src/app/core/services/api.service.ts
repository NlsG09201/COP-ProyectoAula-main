import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private authHeader: string | null = null;

  setAuth(username: string, password: string) {
    this.authHeader = 'Basic ' + btoa(`${username}:${password}`);
  }

  get<T>(path: string) { return this.http.get<T>(`${this.baseUrl}${path}`, { headers: this.headers }); }
  post<T>(path: string, body: any) { return this.http.post<T>(`${this.baseUrl}${path}`, body, { headers: this.headers }); }
  put<T>(path: string, body: any) { return this.http.put<T>(`${this.baseUrl}${path}`, body, { headers: this.headers }); }
  delete<T>(path: string) { return this.http.delete<T>(`${this.baseUrl}${path}`, { headers: this.headers }); }

  private get headers() {
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (this.authHeader) h = h.set('Authorization', this.authHeader);
    return h;
  }
}
