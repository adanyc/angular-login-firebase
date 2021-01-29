import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  user: UserModel = new UserModel();
  remember = false;
  private subscription = new Subscription();

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.setRememberMe();
    this.setUserEmailFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  login(form: NgForm) {
    if (form.invalid) { return; }

    this.showWaitingAlert();

    this.subscription.add(
      this.auth.login(this.user).subscribe(value => {
        this.closeAlert();
        this.setUserEmailOnLocalStorage();
        this.gotToHome();
      }, (err) => {
        this.showErrorAlert(err.error.error.message);
      })
    );
  }

  setRememberMe() {
    this.remember = !!localStorage.getItem('email');
  }

  setUserEmailFromLocalStorage() {
    const email = localStorage.getItem('email');
    if (email) {
      this.user.email = email;
    }
  }

  setUserEmailOnLocalStorage() {
    if (this.remember) {
      localStorage.setItem('email', this.user.email);
    }
  }

  showWaitingAlert() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Please wait...',
    });
    Swal.showLoading();
  }

  showErrorAlert(text: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error on sign in',
      text,
    });
  }

  closeAlert() {
    Swal.close();
  }

  gotToHome() {
    this.router.navigateByUrl('/home');
  }
}
