import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';
import { UsersService } from '../users.service';
import { Pager } from 'src/app/shared/classes/Pager';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Validator } from 'src/app/core/services/validator';
import { SharedService } from 'src/app/shared/service/shared.service';
import { environment } from 'src/environments/environment';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { CoreEnums } from 'src/app/core/core.enums';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { AppEnums } from 'src/app/app.enums';
import { ActivityService } from '../../activity/activity.service';


@Component({
  selector: 'user-myprofile',
  templateUrl: './myprofile.html'
})
export class MyProfile extends BaseComponent implements OnInit, AfterViewInit {

  /******************************************
   * Properties
   * ***************************************/
  public SearchCountryField = SearchCountryField;
  public TooltipLabel = TooltipLabel;
  public CountryISO = CountryISO;
  public PreferredCountries: CountryISO[] = [CountryISO.UnitedArabEmirates];

  public UserValidation: any = {};
  public User: any = {};
  public IsLoading: boolean = false;


  public IsLoadingKids: boolean = false;
  public Kids: any[] = [];

  public KidsValidations: any = {};
  public SelectedKid: any = {};
  public AddNewKidActive: boolean = false;


  public ActivityInclude: any[] = ['Thumbnail'];
  public Activities: any[] = [];

  get EditKidsEnabled() {
    if (!this.Kids || this.Kids.length == 0)
      return true;

    if (this.AddNewKidActive)
      return false;

    if (this.Kids.some((x: any) => x.IsSelected))
      return false;

    return true;
  }
  /*************************************
   *  Constructor
   *************************************/
  constructor(public userSVC: UsersService,
    public sharedSVC: SharedService,
    public ActivitySVC: ActivityService,
    public modalService: NgbModal) {
    super();

  }

  public ngOnInit() {

    if (!this.ActiveUser)
      this.navigate('');

    this.LoadUserDetails();
    this.LoadKids();
  }

  public ngAfterViewInit() {

  }

  /*************************************
   *  Methods
   *************************************/
  public LoadUserDetails() {
    this.IsLoading = true;
    this.userSVC.GetActiveUserDetailsDTO().subscribe((res: any) => {
      this.User = res;
      this.IsLoading = false;
    })
  }

  public LoadKids() {

    this.IsLoadingKids = true;
    let Cri: any = {
      ParentId: this.ActiveUser.Id
    };

    this.userSVC.FindAllKids(Cri, -1, -1, null, false).subscribe((res: any) => {
      this.Kids = res.d;
      this.IsLoadingKids = false;

      this.LoadRecommendedActivities();

    })
  }


  public LoadRecommendedActivities() {

    if (!this.Kids || this.Kids.length == 0)
      return;

    let Ages = this.Kids.map((x: any) => x.Age);
    let AgeFrom = Math.max(...Ages);
    let AgeTo = Math.min(...Ages)

    if (AgeFrom || AgeTo) {
      let Cri: any = {
        AgeFrom: AgeFrom,
        AgeTo: AgeTo
      }
      this.ActivitySVC.FindAllActivities(Cri, 1, 5, "CreateDate DESC", this.ActivityInclude.join(','), false).subscribe((res: any) => {
        this.Activities = res.d;


        this.Activities.forEach((x: any, index: any) => {
          this.ActivitySVC.FindActivityReviewStatistics(x.Id, false).subscribe((innerRes: any) => {
            if (innerRes) {
              x.TotalReviews = innerRes.TotalReviews;
              x.AvgRate = innerRes.AvgRate;
            }
          });
        })
      });
    }

  }

  public async OnUploadFile(event: any) {
    if (event.target.files[0] && environment.AllowedImagesExtension.toLowerCase().indexOf((event.target.files[0].name.split('.').pop()).toLowerCase()) == -1) {
      return;
    }

    this.User.Image = await this.ConvertToBase64(event.target.files[0]);
  }

  public OnSave() {
    this.UserValidation = {};

    if (Validator.StringIsNullOrEmpty(this.User.FirstName))
      this.UserValidation.FirstName = true;

    if (Validator.StringIsNullOrEmpty(this.User.LastName))
      this.UserValidation.LastName = true;

    if (Validator.StringIsNullOrEmpty(this.User.Email))
      this.UserValidation.Email = true;

    if (!Validator.IsValidEmail(this.User.Email))
      this.UserValidation.Email = true;

    //if (!this.User.DOB || !Validator.IsValidDate(this.User.DOB))
    //  this.UserValidation.DOB = true;

    if (Object.getOwnPropertyNames(this.UserValidation).length > 0)
      return;


    this.IsLoading = true;
    this.userSVC.UpdateUserDTO(this.User).subscribe((res: any) => {
      DataStore.addUpdate('ActiveUser', res, CoreEnums.StorageLocation.LocalStorge);
      this.IsLoading = false;

      Swal.fire({
        icon: 'success',
        text: this.resources.SavedSuccessfully,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((res: any) => {
        this.navigate('');
      });
    }, (err: any) => {
      this.IsLoading = false;
      Swal.fire({
        icon: 'error',
        text: this.resources.ErrorWhileSave,
        //timer: 2500,
        showConfirmButton: true,
        confirmButtonText: this.resources.Close
      }).then((res: any) => {
      });
    })
  }


  /****************************
   * Kids Functions
   * *************************/
  public OnAddNewKid() {
    this.KidsValidations = {};
    this.SelectedKid = {
      Gender: AppEnums.Gender.Male
    };
    this.AddNewKidActive = true;
  }

  public OnAddNewKidCancel() {
    this.KidsValidations = {};
    this.SelectedKid = {
      Gender: AppEnums.Gender.Male
    };
    this.AddNewKidActive = false;
  }

  public OnAddNewKidSave() {

    if (!this.ValidateKid())
      return;

    this.SelectedKid.ParentId = this.ActiveUser.Id;

    this.IsLoadingKids = true;

    this.userSVC.AddKid(this.SelectedKid, false).subscribe((res: any) => {
      this.OnSuccess()
    }, (err: any) => this.OnError());
  }


  public OnKidDeleteConfirmation(kid:any) {

    const swalWithBootstrapButtons = Swal.mixin({
      //customClass: {
      //  confirmButton: 'btn btn-success ',
      //  cancelButton: 'btn btn-danger'
      //},
      //buttonsStyling: false
    })


    swalWithBootstrapButtons.fire({
      icon: 'warning',
      title: this.resources.AreYouSureYouWantToDeleteThisKid,
      //timer: 2500,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: this.resources.GeneralYes,
      cancelButtonText: this.resources.GeneralNo,
      reverseButtons: true
    }).then((respones: any) => {
      //this.navigate('supplier/activities');
    })

  }


  public OnEditKid(kid: any) {
    kid.IsSelected = true;
    this.KidsValidations = {};

    this.SelectedKid = this.clone(kid);
  }

  public OnEditKidCancel() {
    this.Kids.forEach((x: any) => x.IsSelected = false);
    this.SelectedKid = {};
  }

  public OnEditKidSave() {
    if (!this.ValidateKid())
      return;

    this.IsLoadingKids = true;

    this.userSVC.UpdateKid(this.SelectedKid, false).subscribe((res: any) => {
      this.OnSuccess()
    }, (err: any) => this.OnError());

  }

  public ValidateKid(): boolean {
    this.KidsValidations = {};

    if (Validator.StringIsNullOrEmpty(this.SelectedKid.KidName))
      this.KidsValidations.KidName = true;

    if (!this.SelectedKid.DOB || !Validator.IsValidDate(this.SelectedKid.DOB))
      this.KidsValidations.DOB = true;

    if (Object.getOwnPropertyNames(this.KidsValidations).length > 0)
      return false;

    return true
  }

  public OnSuccess() {
    this.OnAddNewKidCancel();
    this.OnEditKidCancel();
    this.IsLoadingKids = false;

    Swal.fire({
      icon: 'success',
      text: this.resources.SavedSuccessfully,
      showConfirmButton: true,
      confirmButtonText: this.resources.Acknowldge
    });

    this.LoadKids();
  }

  public OnError() {
    this.OnAddNewKidCancel();
    this.OnEditKidCancel();
    Swal.fire({
      icon: 'error',
      text: this.resources.ErrorWhileSave,
      //timer: 2500,
      showConfirmButton: true,
      confirmButtonText: this.resources.Close
    })

    this.LoadKids();
  }

  public EncodeGender(kid: any) {
    return SharedService.EncodeGender(kid.Gender);
  }
}
