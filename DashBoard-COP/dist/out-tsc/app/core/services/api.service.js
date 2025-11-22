var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
let ApiService = class ApiService {
    constructor() {
        this.http = inject(HttpClient);
        this.baseUrl = environment.apiUrl;
    }
    get(path) { return this.http.get(`${this.baseUrl}${path}`, { headers: this.headers }); }
    post(path, body) { return this.http.post(`${this.baseUrl}${path}`, body, { headers: this.headers }); }
    put(path, body) { return this.http.put(`${this.baseUrl}${path}`, body, { headers: this.headers }); }
    delete(path) { return this.http.delete(`${this.baseUrl}${path}`, { headers: this.headers }); }
    get headers() {
        let h = new HttpHeaders({ 'Content-Type': 'application/json' });
        const token = sessionStorage.getItem('auth');
        if (token) {
            h = h.set('Authorization', 'Basic ' + token);
        }
        return h;
    }
};
ApiService = __decorate([
    Injectable({ providedIn: 'root' })
], ApiService);
export { ApiService };
//# sourceMappingURL=api.service.js.map