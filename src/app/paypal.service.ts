import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PaypalService {
    private clientId = 'AdoXaKmy6VLVoqFXH0TMdtQHEPVcpsPwRCxd73T2U3X1HE-jIrAA3BmeWjH6I0BfKPSb_2AAkl8ng1HB';
    private clientSecret = 'EP0n3nhx_CniSRuZ8-vOASl77mfISvc2lPbeD7au_a4zp1xdS53HG0fg2P8tww0jiJF-Xen6jeuiyfAy';
    private paypalTokenUrl = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

    constructor(private http: HttpClient) { }

    generateAccessToken() {
        const body = 'grant_type=client_credentials';
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`));

        return this.http.post(this.paypalTokenUrl, body, { headers });
    }

    generateOrderDetails(data: any, authToken: any) {
        const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + authToken);

        return this.http.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${data}`, { headers });
    }
}
