import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event, RouterModule } from '@angular/router'; // Importamos Router y eventos
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
  private routerSubscription!: Subscription;

  constructor(
    private loginService: LoginService,
    private claseService: ClaseService,
    private router: Router 
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
      },
      error: (err) => console.error(err)
    });
  }

  cerrarSesion() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('esAlumno');
    }
    this.loginService.logout();
  }
}