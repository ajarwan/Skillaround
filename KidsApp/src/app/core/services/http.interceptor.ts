import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, share, scan, catchError, finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CoreService } from './core.service';
import { CoreSubjects } from '../core.subjects';
import { EndPointConfiguration } from '../EndPointConfiguration';
import { DataStore } from './dataStrore.service';
import * as jQuery from 'jquery';
import { CoreEnums } from '../core.enums';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptor {


  constructor(private http: HttpClient) {
  }


  public get(urlConfig: UrlConfig, showSpinner: boolean = true, islocal: boolean = false): Observable<Response> {
    if (!islocal) {
      urlConfig.url = this.getFullUrl(urlConfig);
    } else {
      urlConfig.url = decodeURI(urlConfig.url);
    }
    return this.invoke(this.http.get<any>(urlConfig.url, this.getRequestOptions(urlConfig)), showSpinner);

  }

  public post(urlConfig: UrlConfig, body: any, showSpinner: boolean = true): Observable<Response> {
    return this.invoke(this.http.post<any>(this.getFullUrl(urlConfig), body, this.getRequestOptions(urlConfig)), showSpinner);
  }

  public PostFile(urlConfig: UrlConfig,fileDto: any, showSpinner: boolean = true): Observable<any> {
     
    //encodeURI
    let me = this;
    return Observable.create((observer: any) => {
      if (showSpinner)
        CoreSubjects.loaderSubject.next({ res: true, value: 'Post File' });


      let form = new FormData();
      if (fileDto.File)
        form.append('File', fileDto.File);

      form.append('type', fileDto.Type);

      $.ajax({
        type: "POST",
        url: me.getFullUrl(urlConfig),
        contentType: false,
        processData: false,
        data: form,
        success: function (res: any) {
          observer.next(res);
          observer.complete();
          if (showSpinner)
            CoreSubjects.loaderSubject.next({ res: false, value: 'Post File' });
        },
        error: function (error: any) {
          if (showSpinner)
            CoreSubjects.loaderSubject.next({ res: false, value: 'Post File' });

          observer.error(error);

        }
      })

    });

  }

  public put(urlConfig: UrlConfig, body: any, showSpinner: boolean = true): Observable<Response> {
    return this.invoke(this.http.put<any>(this.getFullUrl(urlConfig), body, this.getRequestOptions(urlConfig)), showSpinner);
  }

  public delete(urlConfig: UrlConfig, showSpinner: boolean = true): Observable<Response> {
    return this.invoke(this.http.delete<any>(this.getFullUrl(urlConfig), this.getRequestOptions(urlConfig)), showSpinner);
  }

  public getMultiple(requets: any[], islocal: boolean = false, showSpinner: boolean = true): Observable<Response[]> {

    let arr: Observable<Response>[] = [];
    requets.forEach((req: any) => {
      let obs = this.get(req.url, req.options, true);
      arr.push(obs);
    });
    return forkJoin(arr);
  }


  /*
   * Helpers
   */
  private getFullUrl(urlConfig: UrlConfig): string {
    return urlConfig.config.baseUri + decodeURI(urlConfig.url);
  }

  private getRequestOptions(urlConfig?: UrlConfig): any {

    //debugger;
    if (urlConfig.options == null) {
      urlConfig.options = {}
    }

    if (urlConfig.config.options == null) {
      urlConfig.config.options = {}
    }


    if (urlConfig.config.options.headers == null) {
      urlConfig.config.options.headers = new HttpHeaders();
    }


    var finalOptions = this.clone(urlConfig.config.options);

    if (urlConfig.options && urlConfig.options.headers) {
      //debugger;
      urlConfig.options.headers.forEach((hdr: any) => {
        finalOptions.headers = finalOptions.headers.set(hdr.key, hdr.value);
      });
    }

    //finalOptions.headers = finalOptions.headers.set('Cache-Control', "no-cache");

    // //debugger;
    // if (finalOptions.headers.has('X-RequestDigest')) {
    //   //debugger;
    //   finalOptions.headers = finalOptions.headers.delete('X-RequestDigest');
    //   finalOptions.headers = finalOptions.headers.set('X-RequestDigest', DataStore.get('RequestDigest') ? DataStore.get('RequestDigest') : '---');
    // }

    if (DataStore.get('token'))
      finalOptions.headers = finalOptions.headers.set('Authorization', `Bearer ${DataStore.get('token')}`);

    finalOptions.headers = finalOptions.headers.set('Lang', `${environment.Lang}`);

    finalOptions.observe = 'response';
    return finalOptions;

  }

  private invoke(httpCall: Observable<any>, showSpinner: boolean): Observable<Response> {
    if (showSpinner) {
      CoreSubjects.loaderSubject.next({ res: true, value: httpCall });

    }


    return httpCall.pipe(
      map(this.onMap),
      catchError(this.onCatch),
      finalize(() => { this.onFinally(showSpinner) })

    );

  }


  /*
   * ONs
   */
  private onMap(res: any): any {

    //if (res) {
    //  debugger;
    //  return res;
    //} else {
    //  return null;
    //}


    let data = res.body;


    if (res.headers.get('X-Token') != null) {
      console.log('Token Found');
      let token: any = res.headers.get('X-Token');
      DataStore.addUpdate('token', token, CoreEnums.StorageLocation.LocalStorge);
       
    }

    if (res.headers.get('X-Pager') != null) {
      let pagedData: any = {};
      pagedData.d = data
      pagedData.pager = JSON.parse(res.headers.get('X-Pager'));

      return pagedData;
    }





    return data;

  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    console.log(error);
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    console.log(errMsg);
    CoreSubjects.onHttpError.next(error);
    //if (error.status === 403) {
    //  CoreSubjects.onHttpError.next(error);
    //}
    //else if (error.status === 401) {
    //  CoreSubjects.onHttpError.next(error);
    //}
    //else if (error.status === 500) {
    //  CoreSubjects.onHttpError.next(error);
    //}
    //else
    //  CoreSubjects.onHttpError.next({ statu: 403, err: error });

    return Observable.throw(error);
  }

  private onFinally(spinnerShown: boolean): void {
    if (spinnerShown) {
      CoreSubjects.loaderSubject.next({ res: false, value: 'onFinally' });
    }
  }



  public clone(src: any): any {
    if (src instanceof Array) {
      return jQuery.extend(true, [], src);
    }
    return jQuery.extend(true, {}, src);
  }

}


export class UrlConfig {

  constructor(public url: string, public config: EndPointConfiguration, public options: any = null) { }
}
