import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {

    constructor(private http: HttpClient) { 
    }
  
    getUser(userId: string) {
        return this.http.get(`${environment.apiUrl}/User?userId=` + userId);
    }
    
    saveUser(userId: string, userName: string) {
        const body = {
            UserId: userId,
            UserName: userName
        };
        return this.http.post(`${environment.apiUrl}/User`, body);
    }

    private userIdSubject = new BehaviorSubject<string>(''); 
    userId$ = this.userIdSubject.asObservable();

    setUserId(userId: string) {
        this.userIdSubject.next(userId);
    }
  }