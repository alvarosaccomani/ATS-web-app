import { HttpInterceptorFn } from '@angular/common/http';
import { getCookie } from '../utils/cookie-utils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getCookie('ats_token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
