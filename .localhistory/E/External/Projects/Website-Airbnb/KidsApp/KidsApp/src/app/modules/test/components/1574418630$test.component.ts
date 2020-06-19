import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/core/core.base';

@Component({
  selector: 'fm-test',
  templateUrl: './test.component.html'
})
export class TestPageComponent extends BaseComponent {

  testClickflag = false;


  constructor() {
    super();

  }

  testClick() {
    this.testClickflag = !this.testClickflag;
  }


  clickParent() {
    console.log('parent');
  }

  clickChild() {
    console.log('child');
  }

  public OnlyEnglish: any = '';
  public OnlyArabic: any = '';
  public OnlyNumbers: any = '';
  public PositiveNumbers: any = '';
  public PositiveNumbersZ: any = '';
  public PositiveFloat: any = '';

  public cpcEnterShowText = '';
  public cpcEnterValue = '';

  showCpcpEnterValue() {
    this.cpcEnterShowText += 'Changed ' + this.cpcEnterValue + '; ';
  }

  public cpcEmptyReplacertxt: '';
  public cpcNumberSeparatortxt: '';
  public cpcTruncateTexttxt: '';
  public cpcTruncateWordstxt: '';
  public cpcMoneyFormattxt: '';


  ExportToExcel() {

    var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
    var j = 0;
    var tab: any = document.getElementById('headerTable'); // id of table

    var item = {
      col1: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col2: 'Value 2',
      col3: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col4: 'Value 2',
      col5: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col6: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col7: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col8: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col9: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col10: 'Value 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      col11: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col12: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col13: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col14: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
      col15: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived no`,
    };


    var items = [];

    for (let i: number = 0; i < 400; i++) {
      items.push(item);
    }

    tab_text += `<th>Col 1</th>
                   <th>Col 2</th>
                   <th>Col 3</th>
                   <th>Col 4</th>
                   <th>Col 5</th>
                   <th>Col 6</th>
                   <th>Col 7</th>
                   <th>Col 8</th>
                   <th>Col 9</th>
                   <th>Col 10</th>
                   <th>Col 11</th>
                   <th>Col 12</th>
                   <th>Col 13</th>
                   <th>Col 14</th>
                   <th>Col 15</th>
                 </tr>`;
    items.forEach((x) => {
      tab_text = tab_text + '<tr>' + this.getObjProps(x) + "</tr>";
    })

    tab_text = tab_text + '</table>'

    console.log(tab_text.length)
    //debugger;
    //for (j = 0; j < tab.rows.length; j++) {
    //  tab_text = tab_text + '<tr>' + tab.rows[j].innerHTML + "</tr>";
    //  //tab_text=tab_text+"</tr>";
    //}
    //tab_text = tab_text + "</table>";
    //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    //tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    //tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    let sa: any;
    //debugger;
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
      var txtArea1: any = document.getElementById('txtArea1');
      txtArea1.document.open("txt/html", "replace");
      txtArea1.document.write(tab_text);
      txtArea1.document.close();
      txtArea1.focus();
      sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xlsx");
    }
    else                 //other browser not tested on IE 11
      sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
     

    return (sa);
  }

  getObjProps(obj: any) {
    var txt = '';
    for (var propt in obj) {
      txt += '<td>' + obj[propt] + '</td>'
    }

    return txt;
  }
}
