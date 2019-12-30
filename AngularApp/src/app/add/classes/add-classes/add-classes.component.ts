import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AddService } from 'src/app/services/add.service';
import { RetrieveService } from 'src/app/services/retrieve.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Observable, Subscription, from, ReplaySubject } from 'rxjs';
import { ClassModel } from 'src/app/models/class-model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Sorting } from 'src/app/sorting/sorting';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.css']
})
export class AddClassesComponent implements OnInit {
  private Destroyed : ReplaySubject<Boolean> = new ReplaySubject(1);
  @ViewChild('NameInput' , {static : true}) NameInput: ElementRef; 
  Title : string = "Add New Class";
  Form: FormGroup;
  message: string;
  EditMode:string = "false";
  @ViewChild('editTemplate' , {static : true}) editmodal : TemplateRef<any>;
  @ViewChild(DataTableDirective , {static : true}) dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  modalRef : BsModalRef;
  Classes$: Observable<ClassModel[]>;
  classes: ClassModel[];
  searchclasses: ClassModel[];
  ItemDeleteId : number;
  subs : Subscription;
  searchText : any;
  pagesize : number = 10;
  currentpage : number = 1;
  skipel : number =0;
  totalpages : number = 0;
  asc : any;

  ngOnInit(): void {
    this.NameInput.nativeElement.focus(); 
    var unamePattern = "^([a-z A-Z]+)$";   
    this.Form = this.fb.group({
      ID: [0],
      Name: ['', [Validators.required, , Validators.min(1), Validators.max(10)]],
      Fee: ['', [Validators.required, Validators.min(0)]],
      Section: ['', [Validators.required, Validators.maxLength(1), Validators.pattern(unamePattern)]],
    });
    this.ListClasses();
  }

  ListClasses()
  { 
    this.appserv.Clear();
    this.Classes$ = this.appserv.GetClasses();
    this.subs = this.Classes$.pipe(takeUntil(this.Destroyed)).subscribe(res =>
      {
         this.classes = res ;   
         this.totalpages = this.classes.length / this.pagesize;
         this.totalpages = Math.ceil(this.totalpages);

        });
      this.skipel = (this.currentpage-1)*this.pagesize;
      
  }
  sortby(col , datatype)
  {
    
    if(this.asc == "true")
      {
        this.classes.sort(this.sort.SortData(col , "dsc" , datatype ));   
        this.asc = "false";
      }
      else
      {
        this.classes.sort(this.sort.SortData(col , "asc" , datatype ));   
        this.asc = "true";  
      }
  }
  
  nextpage()
  {
    this.currentpage = this.currentpage+1;
    this.skipel = (this.currentpage-1)*this.pagesize;
  }
  previouspage()
  {
    this.currentpage = this.currentpage-1;
    this.skipel = (this.currentpage-1)*this.pagesize;    
  }
  search(value : any)
  {
    this.searchText = value;
  }

  ConfirmDelete(id : number)
  {
    this.ItemDeleteId = id;
    this.modalRef = this.modalService.show(this.editmodal);
  }
  
  Delete()
  {
      this.appserv.Delete(this.ItemDeleteId).subscribe(
       (res : any) =>
       {
          this.ListClasses();
       } 
       , (err : HttpErrorResponse )=>
        {
            console.log(err.message);            
        });
  }

  onSubmit()
  {
    if (this.Form.valid)
    {
        this.appserv.AddClasses(this.Form).subscribe(
        (res: any) =>
        {
          this.NameInput.nativeElement.focus();
          if(this.EditMode == "true")
          {
             this.EditMode = "false";
          }
          this.ListClasses();
          this.Form.reset();   
        }
        ,
        (err: HttpErrorResponse) =>
          {
          console.log(err.error);
        }
      );    
    }
    }
  /** add-class ctor */
  constructor( private sort: Sorting , private modalService: BsModalService , private fb: FormBuilder, private appserv: AddService , private Retserv:RetrieveService) 
  {

    }

    Edit(id: string) 
    {
      this.appserv.GetClassById(id).subscribe(
        (res: any) =>
        {
             this.Form.controls['ID'].setValue(res.record.id);
             this.Form.controls['Name'].setValue(res.record.name);
             this.Form.controls['Fee'].setValue(res.record.fee);
             this.Form.controls['Section'].setValue(res.record.section);
             this.Title = "Edit Class "+ res.record.name + "th";
             this.EditMode = "true"; 
            }
        ,
        (err: HttpErrorResponse) =>
          {
          alert(err.error);
        }
      );    
    }
    ngOnDestroy() {
      this.Destroyed.next(true);
      this.Destroyed.complete();
    }
}
