import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  constructor(private http: HttpInterceptor) { }



}
