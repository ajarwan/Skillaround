import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { parse } from 'querystring';
import { environment } from 'src/environments/environment';

@Pipe({ name: 'cpcEmptyReplacer' })
export class CPCEmptyReplacer implements PipeTransform {
  transform(value: any, replacer: string): string {

    if (value == null || (typeof (value) == 'string' && value.trim().length == 0)) {

      if (!replacer) replacer = '-';

      value = replacer;
    }
    return value;
  }
}


@Pipe({ name: 'cpcMoneyFormat' })
export class CPCMoneyFormat implements PipeTransform {
  transform(value: any, ...formats: string[]): string {
    if (value == null || value.toString().trim() == "")
      return "0.000";

    return parseFloat(value).toFixed(3);
  }
}


@Pipe({
  name: 'cpcTruncateWords'
})
export class CPCTruncateWords implements PipeTransform {
  transform(value: string, limit: number = 20, trail: String = '…'): string {
    let result = value || '';

    if (value) {
      let words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }

    return result;
  }
}


@Pipe({
  name: 'cpcTruncateText'
})
export class CPCTruncateText implements PipeTransform {
  transform(value: string, limit: number = 40, trail: String = '…'): string {
    let result = value || '';
    if (result.length < limit) {
      return result;
    }
    result = result.substring(0, limit) + "...";
    return result;
  }
}


@Pipe({
  name: 'cpcFilterPipe'
})
export class CPCFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, nameArProp: string, nameEnProp: string): any[] {

    if (!searchText || searchText.trim() == "") return items;
    if (!items || items.length < 1) return;

    searchText = searchText.toLowerCase();

    return items.filter(x => {
      if (!x[nameArProp])
        x[nameArProp] = " "

      if (!x[nameEnProp])
        x[nameEnProp] = " "

      return x[nameArProp].toLowerCase().includes(searchText) || x[nameEnProp].toLowerCase().includes(searchText);
    });
  }
}

@Pipe({ name: 'cpcNumberSeparator' })
export class CPCNumberSeparator implements PipeTransform {
  transform(value: any, separator: string = ","): string {
    if (value == null || value == "" || isNaN(value)) return value;

    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(".");
  }
}

@Pipe({ name: 'cpcSafeHtml' })
export class CPCSafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Pipe({ name: 'cpcTimeIn12Hr' })
export class CPCTimeStringIn12Hr implements PipeTransform {
  transform(value) {
    if (value !== null && value !== undefined) {
      const splitArray = value.split(':');
      const hours = parseInt(splitArray[0], 10);
      const minutes = parseInt(splitArray[1], 10);
      let ampm;
      if (environment.Lang === 'en') {
        ampm = (hours < 12 || hours === 24) ? 'AM' : 'PM';
      } else {
        ampm = (hours < 12 || hours === 24) ? 'ص' : 'م';
      }
      const h = hours % 12 || 12;
      let minutesForDisplay = minutes.toString();
      if (minutes <= 9) {
        minutesForDisplay = '0' + minutesForDisplay;
      }
      return h + ':' + minutesForDisplay + ' ' + ampm;
    }
    return value;
  }
}
