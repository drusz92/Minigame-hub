import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Monster } from '../models/monster.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MonsterCode } from '../models/monsterCode.model';
import { Gym } from '../models/gym.model';

@Injectable({
    providedIn: 'root'
  })
  export class MonsterService {

    constructor(private http: HttpClient) { 
    }
  
    getMonster(userId: string): Observable<Monster>{
        return this.http.get<Monster>(`${environment.apiUrl}/Monster/${userId}`);
    }

    getCodes(userId: string): Observable<MonsterCode>{
        return this.http.get<MonsterCode>(`${environment.apiUrl}/Monster/${userId}/GetCodes`);
    }

    generateMonster(userId: string, text: string): Observable<any> {
        var body = {
            UserId: userId,
            Text: text
        };
        return this.http.post(`${environment.apiUrl}/Monster/Generate`, body);
    }

    releaseMonster(userId: string): Observable<any> {
        var body = {
            UserId: userId
        };
        return this.http.post(`${environment.apiUrl}/Monster/Release`, body);
    }

    freezeMonster(userId: string): Observable<any> {
        var body = {
            UserId: userId
        };
        return this.http.post(`${environment.apiUrl}/Monster/Freeze`, body);
    }

    unFreezeMonster(userId: string, monsterId: string): Observable<any> {
        var body = {
            UserId: userId,
            CreatureName: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/UnFreeze`, body);
    }

    combineMonster(userId: string, monsterId: string): Observable<any> {
        var body = {
            UserId: userId,
            CreatureName: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/Combine`, body);
    }

    rest(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/Rest`, body);
    }

    trainStrength(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/TrainStrength`, body);
    }

    trainDefense(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/TrainDefense`, body);
    }

    trainSpeed(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/TrainSpeed`, body);
    }

    trainAccuracy(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/TrainAccuracy`, body);
    }

    trainHealth(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/TrainHealth`, body);
    }

    failTraining(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/FailTraining`, body);
    }

    retire(userId: string, monsterId: number): Observable<any> {
        var body = {
            UserId: userId,
            Id: monsterId
        };
        return this.http.post(`${environment.apiUrl}/Monster/Retire`, body);
    }

    challengeGym(userId: string, gym: Gym): Observable<any> {
        var body = {
            UserId: userId,
            CreatureName: gym.name
        };
        return this.http.post(`${environment.apiUrl}/Monster/ChallengeGym`, body);
    }

    
}