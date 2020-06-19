import { environment } from 'src/environments/environment';
import { AppEnums } from 'src/app/app.enums';

export class User {

  public Id: number;
  public Email: string;
  public Image: string;

  public FirstName: string;

  public LastName: string;
  public DOB: Date;
  public Gender: AppEnums.Gender;
  public IsSupplier: boolean;
  public PhoneNumber: string;
  public PlaceLocationId: string;
  public LoginProvider: AppEnums.LoginProvider;

  public Documents: any[];
  public Reviews: any[];

  public Activities: any[];
  public Bookings: any[];


  constructor() {
  }


}

