export class SearchParams {


  private items: any[];

  constructor() {
    this.items = [];
  }

  public set(key: string, value: string) {
    this.items.push({ key: key, value: value });
  }

  public getQuery() {
    if (this.items.length == 0)
      return '';

    var temp = '?';

    this.items.forEach((x: any) => {
      temp += x.key + "=" + x.value + '&'
    })
  }
}
