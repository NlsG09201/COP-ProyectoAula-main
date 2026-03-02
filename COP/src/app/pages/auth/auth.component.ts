import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLogin = true;
  loading = false;
  error = '';
  
  form = {
    username: '',
    password: '',
    nombreCompleto: '',
    email: ''
  };

  constructor(private router: Router) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    this.loading = true;
    this.error = '';

    const endpoint = this.isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = this.isLogin 
      ? { username: this.form.username, password: this.form.password }
      : { 
          username: this.form.username, 
          passwordHash: this.form.password, 
          nombreCompleto: this.form.nombreCompleto, 
          email: this.form.email 
        };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const user = await response.json();
        // Guardar sesión básica (en un sistema real usaríamos tokens JWT seguros)
        localStorage.setItem('client_user', JSON.stringify(user));
        
        if (this.isLogin) {
          this.router.navigate(['/servicios']);
        } else {
          // Si es registro exitoso, pasamos a login
          this.isLogin = true;
          this.error = 'Cuenta creada con éxito. Ahora inicia sesión.';
        }
      } else {
        const errData = await response.json();
        this.error = errData.message || 'Error en la operación. Intenta de nuevo.';
      }
    } catch (err) {
      this.error = 'No se pudo conectar con el servidor.';
    } finally {
      this.loading = false;
    }
  }
}
