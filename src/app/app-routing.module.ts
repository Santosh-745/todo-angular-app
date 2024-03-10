import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TodoListComponent} from "./todo-list/todo-list.component";
import {CreateTaskComponent} from "./create-task/create-task.component";
import {InProgressComponent} from "./in-progress/in-progress.component";
import {DoneComponent} from "./done/done.component";
import { AuthGuard } from './auth/auth.guard';
const routes: Routes = [
  {
    path:'',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path:'todo-list',
    canActivate: [AuthGuard],
    component:TodoListComponent,
  },
  {
    path:'create-task',
    canActivate: [AuthGuard],
    component: CreateTaskComponent,
  },
  {
    path:'in-progress',
    canActivate: [AuthGuard],
    component:InProgressComponent,
  },
  {
    path:'done-task',
    canActivate: [AuthGuard],
    component:DoneComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
