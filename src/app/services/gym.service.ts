import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Gym } from '../models/gym.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class GymService {

    constructor(private http: HttpClient) { 
    }
  
    getGyms(userId: string): Observable<Gym[]>{
        return this.http.get<Gym[]>(`${environment.apiUrl}/Gym/${userId}`);
    }
}