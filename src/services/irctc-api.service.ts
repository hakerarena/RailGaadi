import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchRequest } from '../interfaces/SearchRequest.model';
import { Train } from '../interfaces/Train.model';

@Injectable({
  providedIn: 'root',
})
export class IrctcApiService {
  private apiUrl = 'YOUR_API_URL'; // Replace with the actual API endpoint

  constructor(private http: HttpClient) {}

  searchTrains(searchRequest: SearchRequest): Observable<Train[]> {
    return this.http.post<Train[]>(this.apiUrl + '/trains', searchRequest);
  }
}
