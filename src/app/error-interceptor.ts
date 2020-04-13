import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";

import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  // should implement this method of the HttpInterceptor interface
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred!";

        if (httpErrorResponse.error.message) {
          errorMessage = httpErrorResponse.error.message;
        }

        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });

        // throw the error as an observable
        return throwError(httpErrorResponse);
      })
    );
  }
}
