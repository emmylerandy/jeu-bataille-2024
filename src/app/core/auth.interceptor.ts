
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = 'MySecretToken';

    // Clone la requête et ajoute le header Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `${authToken}`
      }
    });
    return next(authReq);
  
};
