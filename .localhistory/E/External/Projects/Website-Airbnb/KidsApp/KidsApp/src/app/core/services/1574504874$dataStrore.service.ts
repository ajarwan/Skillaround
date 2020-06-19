import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CoreEnums } from '../core.enums';
import { EndPointConfiguration } from '../EndPointConfiguration';
import { ignoreElements } from 'rxjs-compat/operator/ignoreElements';
import { Validator } from './validator';


export class DataStore {


  /*****************************
   *          Members
   *****************************/
  public static get cookies() {

    if (Validator.StringIsNullOrEmpty(document.cookie))
    return [];

    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    let items: any[] = [];
    ca.forEach((cookie) => {
      items.push({ key: cookie.split('=')[0], value: JSON.parse(cookie.split('=')[1]) })
    })

    return items
  }

  private static instance: DataStore;
  private static isCreating: Boolean = false;
  private isInitialized: boolean = false;
  private items: Array<StoreItem> = new Array<StoreItem>();

  private _router: Router;
  private _resources: any;

  public static get router() {
    this.getInstance();
    return this.instance._router;
  }
  public static get resources() {
    this.getInstance();
    return this.instance._resources;
  }

  public TestData: string = '';


  public static endPoints: Array<EndPointConfiguration>;

  /*****************************
   *          Constructor
   *****************************/
  constructor() {
    if (!DataStore.isCreating) {
      throw new Error("You can't call new in Singleton instances!");
    }

  }

  static getInstance() {
    if (this.instance == null) {
      this.isCreating = true;
      this.instance = new DataStore();
      this.isCreating = false;
    }
    return this.instance;
  }

  public static init(router: Router, reources: any) {
    this.getInstance();

    if (this.instance.isInitialized)
      throw new Error("You can't Initialize Singleton instance more than once!");

    this.instance._router = router;
    this.instance._resources = reources;
    this.instance.items = new Array<StoreItem>();
    this.instance.isInitialized = true;
  }





  /******************************
   *    Methods
   ******************************/

  public static clear(all: boolean = false) {
    this.getInstance();
    if (all)
      this.instance.items = [];
    else
      this.instance.items = this.instance.items.filter((x: StoreItem) => !x.volatile);

  }

  public static get(key: string): any {
    this.getInstance();
    //search in memory
    let item = this.instance.items.filter((x) => x.key == key)[0];
    if (item != null)
      return item.value;

    //Serach in local storage
    let localItem = localStorage.getItem(key);
    if (localItem) {
      debugger;
      return JSON.parse(localItem);
    }

    //Search in cookies
    if (this.cookies) {
      let cookieItem = this.cookies.find((x: any) => x.key == key);
      if (cookieItem)
        return cookieItem;
    }

    return null;

  }

  private static getStoreItem(key: string): any {
    this.getInstance();
    let item = this.instance.items.filter((x) => x.key == key)[0];
    if (item != null)
      return item;

    return null;

  }

  public static addUpdate(key: string, value: any,
    storagelocation: CoreEnums.StorageLocation = CoreEnums.StorageLocation.Memory, volatile = true): any {

    let item: StoreItem = this.getStoreItem(key);
    if (item != null) {
      //update
      item.value = value;

      if (storagelocation != null)
        item.storageLocation = storagelocation;

      if (volatile != null)
        item.volatile = volatile;
    }
    else {
      //Add
      item = new StoreItem(key, value, storagelocation, volatile);
      this.instance.items.push(item);
    }

    //Store to the related storage location
    if (item.storageLocation == CoreEnums.StorageLocation.LocalStorge) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    else if (item.storageLocation == CoreEnums.StorageLocation.Cookies) {

      document.cookie = `${key}=${JSON.stringify(value)}`;

    }

    return item.value;

  }

}

class StoreItem {

  constructor(public key: string, public value: any, public storageLocation: CoreEnums.StorageLocation, public volatile: boolean = true) {

  }
}
