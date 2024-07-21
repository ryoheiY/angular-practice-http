import {bootstrapApplication} from '@angular/platform-browser';

import {AppComponent} from './app/app.component';
import {HttpEventType, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors} from "@angular/common/http";
import {tap} from "rxjs";

function loggingInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  console.log("Request interceptor");
  console.log(request);
  return next(request).pipe(
    tap({
      next: event => {
        if(event.type === HttpEventType.Response){
          console.log("Received response");
          console.log(event.status);
          console.log(event.body);
        }
      }
    })
  );
}


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([
      loggingInterceptor,
    ])),
  ],
}).catch((err) => console.error(err));
