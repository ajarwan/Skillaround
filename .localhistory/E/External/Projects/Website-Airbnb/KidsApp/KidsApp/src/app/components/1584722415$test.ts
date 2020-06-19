import { BaseComponent } from '../core/core.base';
import { OnInit, Component, AfterViewInit } from '@angular/core';


declare var $: any;

declare var Tapjsli: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.html'
})
export class Test extends BaseComponent implements OnInit, AfterViewInit {


  public Tap: any;

  public Card: any;

  /*****************************
 *    Constructor
 ****************************/
  constructor() {
    super();


  }



  /*****************************
   *    Implementations
   ****************************/
  ngOnInit(): void {
  }



  ngAfterViewInit() {

    //pass your public key from tap's dashboard
    this.Tap = Tapjsli('pk_test_SETO8gkepLmNhU2a1dWtqwC0');

    var elements = this.Tap.elements({});

    var style = {
      base: {
        color: '#535353',
        lineHeight: '18px',
        fontFamily: 'sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(0, 0, 0, 0.26)',
          fontSize: '15px'
        }
      },
      invalid: {
        color: 'red'
      }
    };

    // input labels/placeholders
    var labels = {
      cardNumber: "Card Number",
      expirationDate: "MM/YY",
      cvv: "CVV",
      cardHolder: "Card Holder Name"
    };
    //payment options
    var paymentOptions = {
      currencyCode: ["AED"],
      labels: labels,
      TextDirection: 'ltr'
    }
    //create element, pass style and payment options
    this.Card = elements.create('card', { style: style }, paymentOptions);
    //mount element
    this.Card.mount('#element-container');
    //card change event listener
    this.Card.addEventListener('change', (event) => {
      if (event.BIN) {
        console.log(event.BIN)
      }
      if (event.loaded) {
        console.log("UI loaded :" + event.loaded);
        console.log("current currency is :" + this.Card.getCurrency())
      }
      var displayError = document.getElementById('error-handler');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Handle form submission
    let me = this;
    var form = document.getElementById('form-container');
    //form.addEventListener('submit', function (event) {
    //  event.preventDefault();

    //  me.Tap.createToken(me.Card).then(function (result) {
    //    console.log(result);
    //    if (result.error) {
    //      // Inform the user if there was an error
    //      var errorElement = document.getElementById('error-handler');
    //      errorElement.textContent = result.error.message;
    //    } else {
    //      // Send the token to your server
    //      var errorElement = document.getElementById('success');
    //      errorElement.style.display = "block";
    //      var tokenElement = document.getElementById('token');
    //      tokenElement.textContent = result.id;
    //      console.log(result.id);
    //      console.log(result);
    //    }
    //  });
    //});
  }


  public OnSubmit() {

    this.Tap.createToken(this.Card).then(function (result) {
      console.log(result);
      if (result.error) {
        // Inform the user if there was an error
        var errorElement = document.getElementById('error-handler');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server
        var errorElement = document.getElementById('success');
        errorElement.style.display = "block";
        var tokenElement = document.getElementById('token');
        tokenElement.textContent = result.id;
        console.log(result.id);
        console.log(result);
        this.SendToken(result);
      }
    });

  }


  public SendToken(token:any) {

  }




}
