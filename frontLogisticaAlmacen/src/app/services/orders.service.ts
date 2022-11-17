import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseUrl: String = 'http://localhost:3000/api/orders/';
  constructor(private httpClient: HttpClient) { }
  
  getAll(): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}`));
  }

  getById(pId: Number): Promise<any>{
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}${pId}`));
  }

  create(pOrder: Order): Promise<any>{
    return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}`, pOrder));
  }

  update(pId: Number, pOrder: Order): Promise<any>{
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}${pId}`, pOrder));
  }

  delete(pId: Number): Promise<any>{
    return lastValueFrom(this.httpClient.delete<any>(`${this.baseUrl}${pId}`));
  }
}
