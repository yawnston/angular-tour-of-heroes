import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes$: Observable<Hero[]>;

  selectedHero: Hero;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes$ = this.heroService.heroes$;
    this.heroService.getHeroes();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero);
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero);
  }
}
