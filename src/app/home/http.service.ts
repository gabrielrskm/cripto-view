import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
@Injectable({
   providedIn: 'root'
})
export class HttpService {
    http = inject(HttpClient);

   getDataCrypto(): Observable<any> {

      const res = this.http.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10');
      return res.pipe(
         catchError((error: HttpErrorResponse) => {
            if (error.status === 404) throw ('Error 404: Recurso no encontrado')
            else if (error.status === 429) throw ('Error 429: limite de peticiones excedido')
            else if (error.status === 500) throw ('Error 500: Servidor no disponible')
            else throw('Erron en el servidor, intente mas tarde');
          })
      );
   }
}