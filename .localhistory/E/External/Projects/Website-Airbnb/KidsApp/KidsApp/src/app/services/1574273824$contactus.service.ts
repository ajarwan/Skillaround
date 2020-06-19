import { Injectable } from '@angular/core';
import { EndPointConfiguration } from '../core/EndPointConfiguration';
import { DataStore } from '../core/services/dataStrore.service';
import { EndPoints } from '../app.enums';
import { Observable } from 'rxjs';
import { HttpInterceptor, UrlConfig } from '../core/services/http.interceptor';

@Injectable()
export class ContactUsService {


    private readonly ListsBase = '_api/web/lists/';

    constructor(private http: HttpInterceptor) { }



    private get spEndPoint(): EndPointConfiguration {
        if (DataStore.endPoints) {
            return DataStore.endPoints.filter((x: EndPointConfiguration) => x.code === EndPoints.SP)[0];
        }
        return null;
    }


    public getContactUsDetails(showLoader: boolean = true): Observable<Response> {
        return this.http.get(
            new UrlConfig(`${this.ListsBase}getbytitle('AlzajelContents')/items?$select=Id,TitleAr,TitleEn,NameAr,NameEn,DescriptionAr,DescriptionEn,OfficeTitleAr,OfficeTitleEn,SummaryAr,SummaryEn,ImageName,CategoryAr,CategoryEn&$filter=PageName%20eq%20%27ContactUs%27`,
                this.spEndPoint),
            showLoader, false);
    }

    public addNewSuggestion(item: any, showLoader: boolean = true): Observable<Response> {
        return this.http.post(
            new UrlConfig(`${this.ListsBase}getbytitle('ContactUs')/items`,
                this.spEndPoint),JSON.stringify(item),
            showLoader);
    }




}
