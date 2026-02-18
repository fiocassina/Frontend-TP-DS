import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, Event, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { ClaseService } from '../../services/clase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  esAlumno: boolean = false;
  menuAbierto: boolean = false; // Variable para controlar el menú en móvil
  private routerSubscription!: Subscription;

  constructor(
    private loginService: LoginService,
    private claseService: ClaseService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.verificarEstado();

    this.routerSubscription = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.verificarEstado();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Método para abrir/cerrar el menú
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  verificarEstado() {
    if (this.loginService.estaLogueado()) {
      if (typeof localStorage !== 'undefined') {
        const guardado = localStorage.getItem('esAlumno');
        if (guardado === 'true') this.esAlumno = true;
      }
      this.chequearSiEsAlumno();
    } else {
      this.esAlumno = false;
    }
  }

  chequearSiEsAlumno() {
    this.claseService.verificarSoyAlumno().subscribe({
      next: (resultado) => {
        this.esAlumno = resultado;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('esAlumno', resultado ? 'true' : 'false');
        }
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('esAlumno');
      }
      this.loginService.logout();
    }
  }
}