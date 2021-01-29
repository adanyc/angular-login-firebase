import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
