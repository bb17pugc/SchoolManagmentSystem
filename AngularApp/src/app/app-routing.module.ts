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
import { SubaccountsComponent } from './add/subaccounts/subaccounts.component';
import { StudentComponent } from './add/student/student.component';
import { AddstudentComponent } from './add/student/addstudent/addstudent.component';
import { ListStudentsComponent } from './add/student/list/list.component';
import { ExaminationComponent } from './examination/examination.component';
import { DatesheetComponent } from './examination/datesheet/datesheet.component';
import { MarklistsComponent } from './examination/marklists/marklists.component';
const routes: Routes = [

  {path:'home' , component:HomeComponent  ,canActivate: [AuthGuard] },
  { path: 'teachers-timetable', component: TimetableComponent ,canActivate: [AuthGuard] },
  {path : "date-sheet" , component : StudentComponent , canActivate : [AuthGuard]} ,
  {path : "examination" , component : ExaminationComponent , canActivate : [AuthGuard]},
  {path : "examination" , component : ExaminationComponent , 
    children : 
    [{path : "datesheet" , component : DatesheetComponent  , canActivate : [AuthGuard]}
    , {path : "markslists" , component : MarklistsComponent , canActivate : [AuthGuard]} 
  ]
  }
  ,
  {
    path: 'add', component: AddComponent , 
  
  children:
  [
    { path: 'add-classes', component: AddClassesComponent } , 
    { path: 'add-courses', component: AddCourseComponent }  ,
    { path: 'add-teachers', component: AddTeacherComponent },
    { path: 'list-teachers', component: ListComponent } ,
    { path: 'sub-accounts', component: SubaccountsComponent },
    { path: 'student', component: AddstudentComponent },
    { path: 'students-list', component: ListStudentsComponent },        
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
