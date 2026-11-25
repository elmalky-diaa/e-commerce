import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  let toastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toastrService.error('Server is unavailable');
      }

      if (error.status === 400) {
        toastrService.warning(error.error.message || 'Bad Request');
      }

      // if (error.status === 401) {
      //   toastrService.error('Unauthorized');
      // }

      if (error.status === 404) {
        toastrService.error(error.error.message || 'Not Found');
      }

      if (error.status === 500) {
        toastrService.error('Internal Server Error');
      }

      return throwError(() => error);
    }),
  );
};
