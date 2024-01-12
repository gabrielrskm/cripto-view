import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError,  } from 'rxjs';
@Injectable({
   providedIn: 'root'
})
export class HttpService {
    http = inject(HttpClient);

   getDataCrypto(): Observable<any> {

      const res = this.http.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10');
      return res.pipe(
         catchError((error: HttpErrorResponse) => {
            if (error.error instanceof ErrorEvent) throw (error.error.message);
            else throw (error.status + ' message: '+error.message);
          })
      );
   }
}