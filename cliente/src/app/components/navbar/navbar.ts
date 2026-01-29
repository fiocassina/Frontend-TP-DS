import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  constructor(private loginService: LoginService) { }

cerrarSesion() {
   
    const confirmar = confirm("¿Estás seguro que deseas cerrar sesión?");

    if (confirmar) {
      this.loginService.logout();
    }
  }
}


