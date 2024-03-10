import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, AuthResponseData } from './auth.service';
import { DialogContentExampleDialog } from './DialogContentExampleDialog/dialog-content-example-dialog.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe({
      next: (resData) => {
        console.log(resData);
        this.router.navigate(['/todo-list']);
      },
      error: (errorMsg) => {
        // console.log(errorMsg);
        // this.error = errorMsg;
        const dialogRef = this.dialog.open(DialogContentExampleDialog, {
          data: {
            error: errorMsg,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      },
    });
    form.reset();
  }
}
