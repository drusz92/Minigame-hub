import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Encounter } from '../models/encounter.model';

@Injectable({
    providedIn: 'root'
  })
  export class EncounterService {

    constructor(private http: HttpClient) { 
    }
  
    getEncounter(userId: string): Observable<Encounter>{
        return this.http.get<Encounter>(`${environment.apiUrl}/Encounter/${userId}`).pipe(
        map(response => {
            return response;
            })
        );
    }

    generateEncounter(userId: string, creatureLevel: number, location: string, isGym: boolean): Observable<any> {
        var body = {
            UserId: userId,
            CreatureLevel: creatureLevel,
            Location: location,
            IsGym: isGym
        };
        return this.http.post(`${environment.apiUrl}/Encounter`, body);
    }

    generateGymEncounter(userId: string, location: string, isGym: boolean): Observable<any> {
        var body = {
            UserId: userId,
            Location: location,
            IsGym: isGym
        };
        return this.http.post(`${environment.apiUrl}/Encounter/GymEncounter`, body);
    }

    run(userId: string): Observable<any> {
        var body = {
            UserId: userId
        };
        return this.http.post(`${environment.apiUrl}/Encounter/Run`, body);
    }

    failedCatch(userId: string): Observable<any> {
        var body = {
            UserId: userId
        };
        return this.http.post(`${environment.apiUrl}/Encounter/FailedCatch`, body);
    }

    successfulCatch(userId: string): Observable<any> {
        var body = {
            UserId: userId
        };
        return this.http.post(`${environment.apiUrl}/Encounter/SuccessfulCatch`, body);
    }

    fight(userId: string): Observable<any> {
        var body = {
            UserId: userId
        };
        return this.http.post(`${environment.apiUrl}/Encounter/Fight`, body);
    }
}