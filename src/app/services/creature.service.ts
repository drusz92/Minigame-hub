import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Creature } from '../models/creature.model';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class CreatureService {

    constructor(private http: HttpClient) { 
    }
  
    getCreature(userId: string): Observable<Creature>{
        return this.http.get<Creature>(`${environment.apiUrl}/Creature/${userId}`);
    }

    getPokemon(userId: string): Observable<Creature>{
        return this.http.get<Creature>(`${environment.apiUrl}/Creature/GetPokemon/${userId}`);
    }

    evolve(userId: string): Observable<Creature>{
        return this.http.get<Creature>(`${environment.apiUrl}/Creature/Evolve/${userId}`);
    }

    evolveEevee(userId: string, eeveeValue: string): Observable<Creature>{
        return this.http.get<Creature>(`${environment.apiUrl}/Creature/Evolve/${userId}/${eeveeValue}`);
    }
    
    releasePokemon(userId: string): Observable<Creature>{
        return this.http.get<Creature>(`${environment.apiUrl}/Creature/ReleasePokemon/${userId}`);
    }

    getMyPokemon(userId: string): Observable<Creature>{
        return this.http.get<Creature>(`${environment.apiUrl}/Creature/GetMyPokemon/${userId}`);
    }
}