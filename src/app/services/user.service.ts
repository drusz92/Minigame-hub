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
        this.http.get(`${environment.apiUrl}/User?userId=` + userId).subscribe(
            response => {
              return response;
            },
            error => {
              console.error('Error fetching data:', error);
            }
          );
    }

    saveUser(userId: string, userName: string) {
        const body = {
            UserId: userId,
            UserName: userName
        };
        this.http.post(`${environment.apiUrl}/User`, body).subscribe(
            response => {
              return response;
            },
            error => {
              console.error('Error fetching data:', error);
            }
          );
    }

    private userIdSubject = new BehaviorSubject<string>(''); 
    userId$ = this.userIdSubject.asObservable();

    setUserId(userId: string) {
        this.userIdSubject.next(userId);
    }
  }