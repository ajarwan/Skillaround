import { Injectable } from '@angular/core';
import { HttpInterceptor, UrlConfig } from '../../core/services/http.interceptor';
import { DataStore } from 'src/app/core/services/dataStrore.service';
import { EndPointConfiguration } from 'src/app/core/EndPointConfiguration';
import { AppEnums } from 'src/app/app.enums';
import { SearchParams } from 'src/app/shared/classes/SearchParams';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { Pager } from 'src/app/shared/classes/Pager';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly ACTIVITY_BASE_URL = 'Api/Activity/';
  private readonly REVIEWE_BASE_URL = 'Api/Review/';
  private readonly ACTIVITY_DOCUMRNT_BASE_URL = 'Api/ActivityDocument/';
  private readonly BOOKING_BASE_URL = 'Api/Booking/';

  private get mainEndPoint(): EndPointConfiguration {
    if (DataStore.endPoints) {
      return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === AppEnums.EndPoints.Main)[0];
    }
    return null;
  }

  constructor(private http: HttpInterceptor) { }

  /*************************************
   * Activity APIs
   * **********************************/
  public FindAllActivities(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = true): Observable<Response> {

    var params = new SearchParams();

    if (criteria) {
      if (criteria.Title) {
        params.set('title', criteria.Title);
      }

      if (criteria.Description) {
        params.set('description', criteria.Description);
      }

      if (criteria.LocationId) {
        params.set('locationId', criteria.LocationId);
      }

      if (criteria.LocationName) {
        params.set('locationName', criteria.LocationName);
      }

      if (criteria.AgeFrom) {
        params.set('ageFrom', criteria.AgeFrom);
      }

      if (criteria.AgeTo) {
        params.set('ageTo', criteria.AgeTo);
      }

      if (criteria.FromDate) {
        params.set('fromDate', criteria.FromDate);
      }

      if (criteria.ToDate) {
        params.set('toDate', criteria.ToDate);
      }


      if (criteria.TransportationStatus) {
        params.set('transportation', criteria.TransportationStatus);
      }

      if (criteria.PostStatus) {
        params.set('postStatus', criteria.PostStatus);
      }
      else if (criteria.PostStatus == 0)
        params.set('postStatus', AppEnums.ActivityPostStatus.All.toString());

      if (criteria.MyActivities) {
        params.set('myActivities', criteria.MyActivities);
      }


      if (criteria.Category) {
        params.set('categoryId', criteria.Category.Id);
      }


      //if (criteria.MaxPrice) {
      //  params.set('maxPrice', criteria.MaxPrice);
      //}

      //if (criteria.MinPrice) {
      //  params.set('minPrice', criteria.MinPrice);
      //}

      if (criteria.MaxPriceFix) {
        params.set('maxPrice', criteria.MaxPriceFix);
      }

      if (criteria.MinPriceFix) {
        params.set('minPrice', criteria.MinPriceFix);
      }

      if (criteria.Status) {
        params.set('status', criteria.Status);
      }
      else if (criteria.Status == 0)
        params.set('status', AppEnums.ActivationStatus.All.toString());

      if (criteria.Keyword) {
        params.set('keyword', criteria.Keyword);
      }

      if (criteria.AdminKeyword) {
        params.set('adminKeyword', criteria.AdminKeyword);
      }

      if (criteria.AdminKeyword) {
        params.set('adminKeyword', criteria.AdminKeyword);
      }

      if (criteria.BookingUserName) {
        params.set('bookingUserName', criteria.BookingUserName);
      }

      if (criteria.BookingUserEmail) {
        params.set('bookingUserEmail', criteria.BookingUserEmail);
      }

      if (criteria.BookingStatus) {
        params.set('bookingStatus', criteria.BookingStatus.Id);
      }

      if (criteria.BookingNumber) {
        params.set('bookingNumber', criteria.BookingNumber);
      }

      if (criteria.ExcludeAdminActivities) {
        params.set('excludeAdminActivities', criteria.ExcludeAdminActivities);
      }

      if (criteria.OnlyAdminActivities) {
        params.set('onlyAdminActivities', criteria.OnlyAdminActivities);
      }

      

      //if (criteria.Lat) {
      //  params.set('gLat', criteria.Lat);
      //}
      //if (criteria.Lat) {
      //  params.set('gLng', criteria.Lng);
      //}

    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public FindActivityPriceRange(showSpinner: boolean = true): Observable<Response> {


    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}PriceRange`, this.mainEndPoint), showSpinner);
  }

  public FindActivityById(id: number, include: string = null, showSpinner: boolean = true): Observable<Response> {


    var params = new SearchParams();

    if (include)
      params.set('include', include.toString());


    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}${id}${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public FindAllMapMarks(criteria: any, showSpinner: boolean = true): Observable<Response> {



    var params = new SearchParams();

    if (criteria) {

      if (criteria.AgeFrom) {
        params.set('ageFrom', criteria.AgeFrom);
      }

      if (criteria.AgeTo) {
        params.set('ageTo', criteria.AgeTo);
      }

      if (criteria.FromDate) {
        params.set('fromDate', criteria.FromDate);
      }

      if (criteria.ToDate) {
        params.set('toDate', criteria.ToDate);
      }


      if (criteria.TransportationStatus) {
        params.set('transportation', criteria.TransportationStatus);
      }

      if (criteria.Category) {
        params.set('categoryId', criteria.Category.Id);
      }

      //if (criteria.MaxPrice) {
      //  params.set('maxPrice', criteria.MaxPrice);
      //}

      //if (criteria.MinPrice) {
      //  params.set('minPrice', criteria.MinPrice);
      //}


      if (criteria.MaxPriceFix) {
        params.set('maxPrice', criteria.MaxPriceFix);
      }

      if (criteria.MinPriceFix) {
        params.set('minPrice', criteria.MinPriceFix);
      }

      if (criteria.GLat) {
        params.set('gLat', criteria.GLat);
      }

      if (criteria.GLng) {
        params.set('gLng', criteria.GLng);
      }

      if (criteria.SLat) {
        params.set('sLat', criteria.SLat);
      }

      if (criteria.SLng) {
        params.set('sLng', criteria.SLng);
      }

    }


    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}FindAllMarks${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public CheckActivityAvailability(id: number, count: number, showSpinner: boolean = true): Observable<Response> {


    var params = new SearchParams();

    params.set('activityId', id.toString())
    params.set('count', count.toString())
    return this.http.get(new UrlConfig(`${this.ACTIVITY_BASE_URL}CheckAvailability${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public AddActivity(activity: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.post(new UrlConfig(`${this.ACTIVITY_BASE_URL}`, this.mainEndPoint), activity, showSpinner);
  }

  public UpdateActivity(activity: any, showSpinner: boolean = true): Observable<Response> {
    return this.http.put(new UrlConfig(`${this.ACTIVITY_BASE_URL}`, this.mainEndPoint), activity, showSpinner);
  }

  /*************************************
   * Reviews APIs
   * **********************************/
  public FindActivityReviewStatistics(activityId: any, showSpinner: boolean = false): Observable<Response> {

    var params = new SearchParams();
    params.set('ActivityId', activityId);

    return this.http.get(new UrlConfig(`${this.REVIEWE_BASE_URL}FindActivityReviewStatistics${params.getQuery()}`, this.mainEndPoint), showSpinner);

  }

  public FindAllReviews(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = true): Observable<Response> {


    var params = new SearchParams();

    if (criteria) {
      if (criteria.ActivityId) {
        params.set('activityId', criteria.ActivityId);
      }

      if (criteria.Id) {
        params.set('id', criteria.Id);
      }

      if (criteria.UserId) {
        params.set('userId', criteria.UserId);
      }
    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.REVIEWE_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);
  }

  public AddReview(review: any, showSpinner: boolean = false): Observable<Response> {


    return this.http.post(new UrlConfig(`${this.REVIEWE_BASE_URL}`, this.mainEndPoint), review, showSpinner);

  }



  /*************************************
   * Activity Documents
   * **********************************/
  public FindAllActivityDocuments(activityId: any, showSpinner: boolean = false): Observable<Response> {


    var params = new SearchParams();
    params.set('ActivityId', activityId);
    return this.http.get(new UrlConfig(`${this.ACTIVITY_DOCUMRNT_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);

  }

  /*************************************
  * Booking APIs
  * **********************************/
  public AddBooking(booking: any, showSpinner: boolean = false): Observable<Response> {

    return this.http.post(new UrlConfig(`${this.BOOKING_BASE_URL}`, this.mainEndPoint), booking, showSpinner);

  }

  public UpdateBooking(booking: any, showSpinner: boolean = false): Observable<Response> {

    return this.http.put(new UrlConfig(`${this.BOOKING_BASE_URL}`, this.mainEndPoint), booking, showSpinner);

  }

  public FindAllBookings(criteria: any, pageIndex: number = -1, pageSize: number = -1, orderBy = null, include: string = null, showSpinner: boolean = false): Observable<Response> {

    var params = new SearchParams();

    // tempCri.BookingNumber = this.FinalCriteria.BookingNumber;
    //tempCri.BookingUserName = this.FinalCriteria.BookingUserName;
    //tempCri.BookingUserEmail = this.FinalCriteria.BookingUserEmail;
    //tempCri.BookingStatusId = this.FinalCriteria.BookingStatus.Id;

    if (criteria) {
      if (criteria.BookingNumber) {
        params.set('bookingNumber', criteria.BookingNumber);
      }

      if (criteria.ActivityId) {
        params.set('activityId', criteria.ActivityId);
      }

      if (criteria.SupplierId) {
        params.set('supplierId', criteria.SupplierId);
      }

      if (criteria.BookingUserName) {
        params.set('bookingUserName', criteria.BookingUserName);
      }

      if (criteria.BookingUserEmail) {
        params.set('bookingUserEmail', criteria.BookingUserEmail);
      }

      if (criteria.BookingStatusId) {
        params.set('bookingStatusId', criteria.BookingStatusId);
      }

      


    }

    params.set('pageIndex', pageIndex.toString());
    params.set('pageSize', pageSize.toString());

    if (include)
      params.set('include', include.toString());
    if (orderBy)
      params.set('orderBy', orderBy);

    return this.http.get(new UrlConfig(`${this.BOOKING_BASE_URL}FindAll${params.getQuery()}`, this.mainEndPoint), showSpinner);

  }

  public FindAllBookingsStatistics(activityId: number, showSpinner: boolean = false): Observable<Response> {

    var params = new SearchParams();

    params.set('activityId', activityId.toString());

    return this.http.get(new UrlConfig(`${this.BOOKING_BASE_URL}FindAllBookingsStatistics${params.getQuery()}`, this.mainEndPoint), showSpinner);

  }
}
