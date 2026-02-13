import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario-interface';
import { UsuarioService } from '../../../services/usuario.service';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, EncabezadoComponent, NavbarComponent],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  @ViewChild('passForm') passForm!: NgForm;
  @ViewChild('botonCerrar') botonCerrar!: ElementRef;
  usuario: Usuario | null = null;
  usuarioEditado: Partial<Usuario> = {};
  modoEdicion = false;
  cargando = true; 
  errorMessage = '';
  passwords = {
    actual: '',
    nueva: '',
    confirmar: ''
  };
  messagePassword: string | null = null;
  errorPassword: string | null = null;

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

  limpiarFormularioPassword() {
    if (this.passForm) {
      this.passForm.resetForm(); 
    }
    this.passwords = { actual: '', nueva: '', confirmar: '' };
    this.messagePassword = null;
    this.errorPassword = null;
  }

  cambiarPassword() {
    if (this.passwords.nueva !== this.passwords.confirmar) {
      this.errorPassword = 'Las contraseñas nuevas no coinciden.';
      return;
    }
    
    if (this.passwords.nueva.length < 6) {
      this.errorPassword = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    const tieneMayuscula = /[A-Z]/.test(this.passwords.nueva);
    const tieneNumero = /[0-9]/.test(this.passwords.nueva);

    if (!tieneMayuscula || !tieneNumero) {
      this.errorPassword = 'La contraseña debe tener al menos una letra mayúscula y un número.';
      return;
    }

    //this.loadingPassword = true;
    this.errorPassword = null;
    this.messagePassword = null;

    const datosParaBack = {
      currentPassword: this.passwords.actual, 
      newPassword: this.passwords.nueva       
    };

    this.usuarioService.cambiarPasswordAutenticado(datosParaBack).subscribe({
      next: (res) => {
        this.messagePassword = res.mensaje || 'Contraseña actualizada con éxito';
        this.cd.detectChanges();
        // limpiamos los campos
        setTimeout(() => {
          this.passForm.resetForm();
          this.botonCerrar.nativeElement.click();
          this.messagePassword = null;
          this.cd.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        
        if (err.status === 422) {
          this.errorPassword = 'La contraseña actual es incorrecta.';
        } else if (err.status === 400) {
          this.errorPassword = err.error.mensaje || 'Datos inválidos.'; 
        }
          else if (err.status === 401 ) {
          return;
        }        
        else {
          this.errorPassword = 'Ocurrió un error al cambiar la contraseña.';
        }
        this.cd.detectChanges();
      }
    });
  }

}