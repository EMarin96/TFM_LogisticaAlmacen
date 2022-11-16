import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsLocationsService {

  baseUrl: String = 'http://localhost:3000/api/materials-locations/'
  constructor(private httpClient: HttpClient) { }

  getAll(pWarehouseId: Number): Promise<any>{
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}${pWarehouseId}`));
  }
}
