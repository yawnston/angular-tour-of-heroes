import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, filter, switchMap, mergeMap, take } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api

  private heroes: BehaviorSubject<Hero[]>;
  heroes$: Observable<Hero[]> = this.heroes;

  private dataStore: {
    heroes: Hero[]
  };

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.dataStore = { heroes: [] };
    this.heroes = new BehaviorSubject<Hero[]>([]);
    this.heroes$ = this.heroes;
  }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetching heroes');
    this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('Fetched heroes')),
      catchError(this.handleError('getHeroes', []))
    ).subscribe(data => {
      this.dataStore.heroes = data;
      // Push a copy, not a reference
      this.heroes.next(Object.assign({}, this.dataStore).heroes);
    });

    return this.heroes$;
  }

  searchHeroes(term: string): Observable<Hero[]> {
    // Return empty list for empty query
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`Found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', [])),
      tap(data => this.updateHeroStorage(data))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`Fetched hero: id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    ).subscribe(data => {
      this.updateHeroStorage([data]);
      this.heroes.next(Object.assign({}, this.dataStore).heroes);
    });

    return this.heroes$.pipe(
      mergeMap(item => item),
      filter(item => item.id === id),
      take(1)
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    this.http.post(this.heroesUrl, hero, httpOptions).pipe(
      tap((addedHero: Hero) => this.log(`Added hero: id=${addedHero.id}`)),
      catchError(this.handleError<Hero>(`addHero`))
    ).subscribe(data => {
      this.dataStore.heroes.push(data);
      this.heroes.next(Object.assign({}, this.dataStore).heroes);
    });

    return this.heroes$.pipe(
      mergeMap(item => item),
      filter(item => item.id === hero.id),
      take(1)
    );
  }

  updateHero(hero: Hero): Observable<Hero> {
    this.http.put(`${this.heroesUrl}`, hero, httpOptions).pipe(
      tap(_ => this.log(`Updated hero: id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    ).subscribe(data => {
      this.updateHeroStorage([data]);
      this.heroes.next(Object.assign({}, this.dataStore).heroes);
    });

    return this.heroes$.pipe(
      mergeMap(item => item),
      filter(item => item.id === hero.id),
      take(1)
    );
  }

  deleteHero(hero: Hero | number): void {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`Deleted hero: id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    ).subscribe(_ => {
      this.dataStore.heroes.forEach((t, i) => {
        if (t.id === id) { this.dataStore.heroes.splice(i, 1); }
      });
      this.heroes.next(Object.assign({}, this.dataStore).heroes);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private updateHeroStorage(heroList: Hero[]) {
    heroList.forEach((v, _) => {
      const updateIndex = this.dataStore.heroes.findIndex(hero => v.id === hero.id);
      if (updateIndex !== -1) {
        this.dataStore.heroes[updateIndex] = v;
      } else {
        this.dataStore.heroes.push(v);
      }
    });
  }
}
