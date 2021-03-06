import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthServicesService } from './services/auth-services.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationStatusComponent } from './registration-status/registration-status.component';
import { AddComponent } from './add/add.component';
import { AddService } from './services/add.service';
import { AddClassesComponent } from './add/classes/add-classes/add-classes.component';
import { RetrieveService } from './services/retrieve.service';
import { DataTablesModule } from 'angular-datatables';
import { AddCourseComponent } from './add/courses/add-course/add-course.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OrderModule } from 'ngx-order-pipe';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { CourseserviceService } from './services/courseservice.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ListComponent } from './add/teachers/list/list.component';
import { AddTeacherComponent } from './add/teachers/add-teacher/add-teacher.component';
import { TeacherService } from './services/teacher.service';
import { TimetableComponent } from './timetable/timetable.component';
import { TimetableService } from './services/timetable.service';
import { PrintService } from './services/print.service';
import { SubaccountsComponent } from './add/subaccounts/subaccounts.component';
import { StudentService } from './services/student.service';
import { AddstudentComponent } from './add/students/addstudent/addstudent.component';
import { ListStudentsComponent } from './add/students/list/list.component';
import { ExaminationComponent } from './examination/examination.component';
import { DatesheetComponent } from './examination/datesheets/datesheet/datesheet.component';
import { DatePipe } from '@angular/common';
import { MarklistsComponent } from './examination/marklists/marklists.component';
import { CreatestudentlistComponent } from './examination/createstudentlist/createstudentlist.component';
import { ListDateSheetComponent } from './examination/datesheets/list/list.component';
import { EditComponent } from './examination/datesheets/edit/edit.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    RegistrationStatusComponent,
    AddComponent,
    AddClassesComponent,
    AddCourseComponent,
    ListComponent,
    AddTeacherComponent,
    TimetableComponent,
    SubaccountsComponent,
    AddstudentComponent,    
    ListStudentsComponent,
    ExaminationComponent,
    DatesheetComponent,
    MarklistsComponent,
    CreatestudentlistComponent,
    ListDateSheetComponent,
    EditComponent
  ],
  exports : [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    OrderModule ,
    AngularFontAwesomeModule,
    Ng2SearchPipeModule
    
  ],
  providers: [DatePipe , AuthServicesService , AddService , RetrieveService , CourseserviceService , TeacherService , TimetableService , PrintService , StudentService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
