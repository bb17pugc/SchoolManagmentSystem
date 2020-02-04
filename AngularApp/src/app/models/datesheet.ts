import { ClassModel } from './class-model';
import { CourseModel } from './course-model';
import { Teahcer } from './teahcer';

export class Datesheet 
{
     id : Number;
     class : ClassModel;
     subject : CourseModel;
     teacher : Teahcer;
     date : any;
     startDate : Date;
     endDate : Date;
     dateSheetName : string;
}
