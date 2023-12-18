import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(withHttpTransferCacheOptions({includePostRequests: true})),
    importProvidersFrom(BrowserAnimationsModule, BrowserModule, HttpClientModule,FormsModule,ReactiveFormsModule ), ]
};
