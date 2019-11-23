import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { RegistrationStatusComponent } from './registration-status/registration-status.component';
import { AuthGuard } from './auth.guard';
import { AddComponent } from './add/add.component';
import { AddClassesComponent } from './add/classes/add-classes/add-classes.component';
import { AddCourseComponent } from './add/courses/add-course/add-course.component';
import { AddTeacherComponent } from './add/teachers/add-teacher/add-teacher.component';
import { ListComponent } from './add/teachers/list/list.component';
import { TimetableComponent } from './timetable/timetable.component';

const routes: Routes = [

  {path:'home' , component:HomeComponent  ,canActivate: [AuthGuard] },
  { path: 'teachers-timetable', component: TimetableComponent ,canActivate: [AuthGuard] },
  {
    path: 'add', component: AddComponent , 
  
  children:
  [
    { path: 'add-classes', component: AddClassesComponent } , 
    { path: 'add-courses', component: AddCourseComponent }  ,
    { path: 'add-teachers', component: AddTeacherComponent },
    { path: 'list-teachers', component: ListComponent },  
  ]
  
  , canActivate: [AuthGuard]
},
  {path:'registration' , component:RegistrationComponent   },
  {path:'login' , component:LoginComponent   },
  {path:'registration-status' , component:RegistrationStatusComponent   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
