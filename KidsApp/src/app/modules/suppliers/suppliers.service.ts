import { Injectable } from '@angular/core';
import { HttpInterceptor } from '../../core/services/http.interceptor';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpInterceptor) { }



}
