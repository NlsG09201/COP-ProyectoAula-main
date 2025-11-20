import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private authHeader: string | null = null;

  constructor() {
    const u = localStorage.getItem('auth_user');
    const p = localStorage.getItem('auth_pass');
    if (u && p) this.setAuth(u, p);
  }

  setAuth(username: string, password: string) {
    this.authHeader = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem('auth_user', username);
    localStorage.setItem('auth_pass', password);
  }

  hasAuth() { return !!this.authHeader; }

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
