import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PaypalService } from './paypal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'angular-paypal';
  paymentDetails: any
  capturedDetails: any
  fetchedDetails: any
  paymentInitiated:boolean = true
  loginDetails:any
  orderId:any

  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef
  @ViewChild('paymentDetailsSection', { static: true }) paymentDetailsSection!: ElementRef
  @ViewChild('fetchedDetailsSection', { static: true }) fetchedDetailsSection!: ElementRef
  @ViewChild('capturedDetailsSection', { static: true }) capturedDetailsSection!: ElementRef
  @ViewChild('loginDetailSection', { static: true }) loginDetailSection!: ElementRef
  @ViewChild('fetchedOrderSection', { static: true }) fetchedOrderSection!: ElementRef
  fetchedOrderDetails: any;

  constructor(private render:Renderer2,private paypalService:PaypalService) {

  }

  ngOnInit(): void {
    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        console.log(data)
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: '10.00' // Sample amount
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        console.log(data);
        console.log(actions);
        this.paymentDetails = data
        let paymentTemp : string | null  = JSON.stringify(data, null, 2) 
        this.render.setProperty(this.paymentDetailsSection.nativeElement, 'textContent', paymentTemp);

        actions.order.capture().then((details: any) => {
          this.capturedDetails = details 
          let captureTemp : string | null  = JSON.stringify(details, null, 2) 
          this.render.setProperty(this.capturedDetailsSection.nativeElement, 'textContent', captureTemp);

        }).catch(function (err: any) {
          console.error('Capture error:', err);
        });

        actions.order.get().then((details: any) => {
          this.fetchedDetails = details 
          let fetchTemp : string | null  = JSON.stringify(details, null, 2) 
          this.render.setProperty(this.fetchedDetailsSection.nativeElement, 'textContent', fetchTemp);

        }).catch(function (err: any) {
          console.error('get error:', err);
        });

      },
      onError: (err: any) => {
        console.error('An error occurred:', err);
      }
    }).render(this.paymentRef.nativeElement);
  }

  generateToken() {
    this.paypalService.generateAccessToken().subscribe(
      (response: any) => {
        this.loginDetails = response

        let loginTemp : string | null  = JSON.stringify(response, null, 2) 
        this.render.setProperty(this.loginDetailSection.nativeElement, 'textContent', loginTemp);

      },
      (error:any) => {
        console.error('Error:', error);
      }
    );
  }


  getOrderDetails(){
    this.paypalService.generateOrderDetails(this.paymentDetails.orderID,this.loginDetails.access_token).subscribe(
      (response: any) => {
        console.log(response)
        this.fetchedOrderDetails = response

        let orderTemp : string | null  = JSON.stringify(response, null, 2) 
        this.render.setProperty(this.fetchedOrderSection.nativeElement, 'textContent', orderTemp);
      },
      (error:any) => {
        console.error('Error:', error);
      }
    );
  }

}
