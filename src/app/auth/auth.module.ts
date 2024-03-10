import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { DialogContentExampleDialog } from './DialogContentExampleDialog/dialog-content-example-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AuthComponent, DialogContentExampleDialog],
  imports: [
    MatDialogModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
    NgbModule,
  ],
  exports: [AuthComponent],
})
export class AuthModule {}
