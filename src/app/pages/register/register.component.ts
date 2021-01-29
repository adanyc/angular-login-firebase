import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: UserModel = new UserModel();
  remember = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }


  register(form: NgForm) {
    if (form.invalid) { return; }

    this.showWaitingAlert();

    this.auth.register(this.user).subscribe(value => {
      this.closeAlert();
      this.setUserEmailOnLocalStorage();
      this.gotToHome();
    }, (err) => {
      this.showErrorAlert(err.error.error.message);
    });
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
      title: 'Error on sign up',
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
