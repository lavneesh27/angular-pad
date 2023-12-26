import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private data: DataService,
    private toastr: ToastrService
  ) {}
  login(email: string, password: string, remember: boolean) {
    this.fireAuth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        if (res.user?.emailVerified == false) {
          this.router.navigate(['home']);
          remember
            ? localStorage.setItem('token', String(res.user?.uid))
            : sessionStorage.setItem('token', String(res.user?.uid));
          setTimeout(() => {
            window.location.reload();
          }, 80);
        } else {
          this.router.navigate(['/verify']);
        }
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  register(user: any) {
    this.fireAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(
        (res) => {
          this.toastr.success('Registration Successful');
          this.router.navigate(['login']);
          this.sendEmailVerification(res.user);
          user.id = res.user!.uid;
          user.createdAt = new Date().toLocaleDateString();
          this.data.addUser(user);
        },
        (err) => {
          alert(err.message);
          this.router.navigate(['/register']);
        }
      );
  }

  logout() {
    this.fireAuth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  googleSignIn() {
    return this.fireAuth.signInWithRedirect(new GoogleAuthProvider());
  }

  sendEmailVerification(user: any) {
    user.sendEmailVerification().then(
      () => {
        this.router.navigate(['/verify']);
      },
      () => {
        alert('Something went wrong');
      }
    );
  }

  forgotPassword(email: string) {
    this.fireAuth.sendPasswordResetEmail(email).then(
      () => {
        alert('Password reset link is sent to your email');
        this.router.navigate(['login'])
      },
      (_err) => {
        alert('Something went wrong');
      }
    );
  }
}
