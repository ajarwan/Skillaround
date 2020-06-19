import 'rxjs/Rx';
import { Subject } from 'rxjs';

export class CoreSubjects {
  /*****************************
  *        Constructor
  *****************************/

  public static loaderSubject: Subject<any> = new Subject<any>();
  public static onLoginSubject: Subject<boolean> = new Subject<boolean>();
  public static onHttpError: Subject<any> = new Subject<any>();
  public static onNavigation: Subject<any> = new Subject<any>();
  

  /*****************************
  *        Constructor
  *****************************/
  constructor() {

  }

  /*****************************
  *  Subjects With Implementations
  *****************************/






}
