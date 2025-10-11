import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario-interface';
import { UsuarioService } from '../../../services/usuario.service';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, EncabezadoComponent, NavbarComponent],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  usuarioEditado: Partial<Usuario> = {};
  modoEdicion = false;
  cargando = true; 
  errorMessage = '';

  constructor(private usuarioService: UsuarioService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true; 
    this.usuarioService.getPerfil().subscribe({
      next: (data) => {
        this.usuario = data;
        this.cargando = false; 
        this.cd.detectChanges();

      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar tu perfil. Intenta iniciar sesión de nuevo.';
        this.cargando = false;
        console.error("Error al cargar perfil:", err);
        this.cd.detectChanges(); 

      }
    });
  }

  activarModoEdicion(): void {
    if (this.usuario) {
      this.usuarioEditado = { ...this.usuario };
      this.modoEdicion = true;
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
  }

  guardarCambios(): void {
    this.usuarioService.updatePerfil(this.usuarioEditado).subscribe({
      next: (res) => {
        
        this.usuario = res.usuario;
        this.modoEdicion = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al actualizar el perfil.';
        console.error(err);
      }
    });
  }
  cerrarSesion(): void {
    // Borrar token
    localStorage.removeItem('token');
    this.usuario = null;
    this.router.navigate(['/login']);
  }


  solicitarBaja(): void {
    const confirmacion = window.confirm(
      '¿Estás seguro de que querés dar de baja tu cuenta? Esta acción no se puede deshacer y no podrás volver a iniciar sesión.'
    );

    if (confirmacion) {
      this.usuarioService.desactivarPerfil().subscribe({
        next: () => {
          alert('Tu cuenta ha sido dada de baja. Serás redirigido a la página de inicio.');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'No se pudo procesar la baja de la cuenta.';
          console.error(err);
        }
      });
    }
  }
}