import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, share, scan, catchError, finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { CoreService } from './core.service';
import { CoreSubjects } from '../core.subjects';
import { EndPointConfiguration } from '../EndPointConfiguration';
import { DataStore } from './dataStrore.service';
import * as jQuery from 'jquery';


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
    return this.invoke(this.http.get(urlConfig.url, this.getRequestOptions(urlConfig)), showSpinner);

  }

  public post(urlConfig: UrlConfig, body: any, showSpinner: boolean = true): Observable<Response> {
    return this.invoke(this.http.post(this.getFullUrl(urlConfig), body, this.getRequestOptions(urlConfig)), showSpinner);
  }

  public put(urlConfig: UrlConfig, body: any, showSpinner: boolean = true): Observable<Response> {
    return this.invoke(this.http.put(this.getFullUrl(urlConfig), body, this.getRequestOptions(urlConfig)), showSpinner);
  }

  public delete(urlConfig: UrlConfig, showSpinner: boolean = true): Observable<Response> {
    return this.invoke(this.http.delete(this.getFullUrl(urlConfig), this.getRequestOptions(urlConfig)), showSpinner);
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

    //finalOptions.headers = finalOptions.headers.set('Access-Control-Request-Method', 'GET');

    //finalOptions.withCredentials = true;
    return finalOptions;

  }

  private invoke(httpCall: Observable<ArrayBuffer>, showSpinner: boolean): Observable<Response> {
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
  private onMap(res: ArrayBuffer): any {

    if (res) {
      debugger;
      return res;
    } else {
      return null;
    }
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    console.log(errMsg);

    if (error.status === 403) {
      CoreSubjects.onHttpError.next({ statu: 403, err: errMsg });
    }
    else if (error.status === 401) {
      CoreSubjects.onHttpError.next({ statu: 403, err: errMsg });
    }
    else if (error.status === 500) {
      CoreSubjects.onHttpError.next({ statu: 403, err: errMsg });
    }
    else
      CoreSubjects.onHttpError.next({ statu: 403, err: errMsg });

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
