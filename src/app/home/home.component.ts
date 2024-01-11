import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe,DatePipe } from '@angular/common';
import { Crypto } from './data.interface';
import { HttpService } from './http.service';
import { interval } from 'rxjs';

@Component({
   imports: [DecimalPipe, DatePipe],
   standalone: true,
   selector: 'app-name',
   template: `
      <div>
         @if( err() !== '') {
         <p class="text-red-500 text-wrap">{{ err() }}</p>
         } @else if(typeScreen() === 'pc') {
         <table class="table-lg">
            <thead>
               <tr>
                  <th>Assets</th>
                  <th>Price</th>
                  <th>24hs</th>
                  <th>Market Cap</th>
               </tr>
            </thead>
            <tbody>
               @for( item of data(); track $index ){
               <tr>
                  <td>
                     <div class="flex items-center gap-3">
                        <div class="avatar">
                           <div class="mask mask-squircle w-12 h-12">
                              <img
                                 src="{{ item.image }}"
                                 alt="{{ item.atl_date }}"
                              />
                           </div>
                        </div>
                        <div>
                           <div class="font-bold">{{ item.name }}</div>
                        </div>
                     </div>
                  </td>
                  <td>{{ item.current_price | number : '1.2-2' }}</td>
                  @if(item.market_cap_change_percentage_24h>0){
                  <td class="text-success">
                     {{
                        item.market_cap_change_percentage_24h
                           | number : '1.2-2'
                     }}%
                  </td>
                  } @else{
                  <td class="text-danger">
                     {{
                        item.market_cap_change_percentage_24h
                           | number : '1.2-2'
                     }}%
                  </td>
                  }
                  <td>{{ item.market_cap / 1000000 | number : '1.0-0' }}M</td>
               </tr>
               }
            </tbody>
         </table>
         } @else{ @for(item of data();track $index){
         <div class="collapse bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title text-sm font-medium">
               <div class="flex items-center gap-3">
                  <div class="avatar">
                     <div class="mask mask-squircle w-10 h-10">
                        <img src="{{ item.image }}" alt="{{ item.atl_date }}" />
                     </div>
                  </div>
                  <div>
                     <div class="font-bold">{{ item.name }}</div>
                  </div>
                  <p>{{ item.current_price | number : '1.2-2' }} U$D</p>
               </div>
            </div>
            <div class="collapse-content">
               @if(item.market_cap_change_percentage_24h>0){
               <div class="text-success">
                  Variation 24hs :
                  {{
                     item.market_cap_change_percentage_24h | number : '1.2-2'
                  }}%
               </div>
               } @else{
               <div class="text-red-700">
               Variation 24hs :
                  {{
                     item.market_cap_change_percentage_24h | number : '1.2-2'
                  }}%
               </div>
               }
               <div>Market Cap : {{ item.market_cap / 1000000 | number : '1.0-0' }}M</div>

            </div>
         </div>
         } }
         <br>
         <p class="text-center">Last update : {{ lastUpdate() | date : 'd/M/yy, h:mm a' }}</p>
      </div>
   `,
})
export default class HomeComponent implements OnInit {
   data = signal<Crypto[]>([]);
   service = inject(HttpService);
   err = signal('');
   typeScreen = signal('');
   lastUpdate = signal<string>('');

   constructor() {
      this.typeScreen.set(this.getTypeScreen());
   }

   ngOnInit(): void {
      interval(600000).subscribe(() => {
         this.getData();
      });
      this.getData();
   }
   @HostListener('window:resize', ['$event'])
   onResize(event: any) {
      this.typeScreen.set(this.getTypeScreen());
   }

   private getTypeScreen() {
      const type = window.innerWidth;
      if (type < 600) return 'smartphone';
      return 'pc';
   }

   private getData() {
      const res$ = this.service.getDataCrypto();
      res$.subscribe({
         next: (data) => {
            this.data.set(data);
            this.err.set('');
         },
         error: (msg) => {
            this.err.set(msg);
         },
         complete: () => {
            this.lastUpdate.set(Date.now().toString());
         },
      });
   }

}
