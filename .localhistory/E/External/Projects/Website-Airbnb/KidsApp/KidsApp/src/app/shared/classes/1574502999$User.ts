import { environment } from 'src/environments/environment.prod';

export class User {
  public UserName: string;
  public Id: string;
  public Email: string;
  public IsAdmin: boolean;
  public Name: string;
  public FullNameAr: string;
  public FullNameEn: string;
  public ImageUrl: string;

  public UserGUID: string;
  public TimeAttendance: boolean;
  public AnnualLeaves: boolean;
  public MissionRequest: boolean;
  public ShortVisit: boolean;
  public SOAToken: string;
  public BasicSOABody: BasicSOABody;

  constructor() {
  }

  public initSOABody() {
    this.BasicSOABody = new BasicSOABody();

    this.BasicSOABody.P_REQUESTER = this.BasicSOABody.p_REQUESTER = this.UserName;
    this.BasicSOABody.P_USER_ID = this.BasicSOABody.p_USER_ID = this.UserName;
    this.BasicSOABody.P_USER_ID_ERP = this.BasicSOABody.p_USER_ID_ERP = this.UserName;
    this.BasicSOABody.P_PASSWORD_ERP = this.BasicSOABody.p_PASSWORD_ERP = '';
    this.BasicSOABody.P_TOKEN = this.BasicSOABody.p_TOKEN = this.SOAToken;
    this.BasicSOABody.P_LANG = this.BasicSOABody.p_LANG = environment.Lang == 'ar' ? 'AR' : 'US';

  }

}

export class BasicSOABody {

  P_REQUESTER: string; //this.ActiveUser.UserName.toUpperCase()
  P_USER_ID_ERP: string; //this.ActiveUser.UserName.toUpperCase()
  P_PASSWORD_ERP: string;
  P_USER_ID: string; //this.ActiveUser.UserName.toUpperCase()
  P_TOKEN: string;
  P_LANG: string;

  p_REQUESTER: string; //this.ActiveUser.UserName.toUpperCase()
  p_USER_ID_ERP: string; //this.ActiveUser.UserName.toUpperCase()
  p_PASSWORD_ERP: string;
  p_USER_ID: string; //this.ActiveUser.UserName.toUpperCase()
  p_TOKEN: string;
  p_LANG: string;

  constructor() { }



}
