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
    // #region agent log
    fetch('http://127.0.0.1:7689/ingest/4c4298dd-e4e2-4442-84cf-4b75a3d32666', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': 'e69953'
      },
      body: JSON.stringify({
        sessionId: 'e69953',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'auth.component.ts:31',
        message: 'Auth submit',
        data: {
          isLogin: this.isLogin,
          username: this.form.username,
          hasPassword: !!this.form.password
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7689/ingest/4c4298dd-e4e2-4442-84cf-4b75a3d32666', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'e69953'
          },
          body: JSON.stringify({
            sessionId: 'e69953',
            runId: 'pre-fix',
            hypothesisId: 'H2',
            location: 'auth.component.ts:53',
            message: 'Auth success response',
            data: {
              isLogin: this.isLogin,
              status: response.status
            },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion
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
        // #region agent log
        fetch('http://127.0.0.1:7689/ingest/4c4298dd-e4e2-4442-84cf-4b75a3d32666', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': 'e69953'
          },
          body: JSON.stringify({
            sessionId: 'e69953',
            runId: 'pre-fix',
            hypothesisId: 'H3',
            location: 'auth.component.ts:65',
            message: 'Auth HTTP error',
            data: {
              isLogin: this.isLogin,
              status: response.status
            },
            timestamp: Date.now()
          })
        }).catch(() => {});
        // #endregion
        const errData = await response.json();
        this.error = errData.message || 'Error en la operación. Intenta de nuevo.';
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7689/ingest/4c4298dd-e4e2-4442-84cf-4b75a3d32666', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': 'e69953'
        },
        body: JSON.stringify({
          sessionId: 'e69953',
          runId: 'pre-fix',
          hypothesisId: 'H4',
          location: 'auth.component.ts:69',
          message: 'Auth network error',
          data: {
            isLogin: this.isLogin
          },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      this.error = 'No se pudo conectar con el servidor.';
    } finally {
      this.loading = false;
    }
  }
}
