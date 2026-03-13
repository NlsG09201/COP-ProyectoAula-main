import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  user: any = null;
  loading = false;
  editing = false;
  message = '';
  isError = false;

  form = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    docIden: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    try {
      const userData = localStorage.getItem('client_user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.form = {
          nombreCompleto: this.user.nombreCompleto || '',
          email: this.user.email || '',
          telefono: this.user.telefono || '',
          direccion: this.user.direccion || '',
          docIden: this.user.docIden || ''
        };
      } else {
        this.router.navigate(['/auth']);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      this.router.navigate(['/auth']);
    }
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (!this.editing) {
      this.loadUser(); // Reset form if cancel
    }
    this.message = '';
  }

  async onUpdate(e: Event) {
    e.preventDefault();
    if (!this.user?.idPersona) return;

    this.loading = true;
    this.message = '';
    
    try {
      const response = await fetch(`/api/pacientes/${this.user.idPersona}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Preservar datos de sesión que no vienen en el update (como username)
        const newUserData = { ...this.user, ...updatedUser };
        localStorage.setItem('client_user', JSON.stringify(newUserData));
        this.user = newUserData;
        this.editing = false;
        this.message = 'Perfil actualizado con éxito.';
        this.isError = false;
      } else {
        const errData = await response.json();
        this.message = errData.message || 'Error al actualizar el perfil.';
        this.isError = true;
      }
    } catch (err) {
      this.message = 'No se pudo conectar con el servidor.';
      this.isError = true;
    } finally {
      this.loading = false;
    }
  }
}
