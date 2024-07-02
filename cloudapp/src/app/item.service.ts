// imports
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CloudAppRestService, CloudAppEventsService, Request, HttpMethod,
  Entity, RestErrorResponse, AlertService
} from '@exlibris/exl-cloudapp-angular-lib';
import { Item } from './interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})

export class ItemService {

  constructor(private restService: CloudAppRestService) { }

  getItemByBarcode(barcode: string): Observable<Item> {

    const request: Request = {
      url: `/almaws/v1/items?item_barcode=${encodeURI(barcode)}`,
      method: HttpMethod.GET
    };
    return this.restService.call(request);
  }

  setLocationID(item: Item):Observable<Item> {
      const request: Request = {
      url: item.link,
        method: HttpMethod.PUT,
        requestBody: item
      }
      return this.restService.call(request);
    }
}

  





