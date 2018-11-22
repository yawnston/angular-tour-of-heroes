import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-creation',
  templateUrl: './hero-creation.component.html',
  styleUrls: ['./hero-creation.component.css']
})
export class HeroCreationComponent implements OnInit {

  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];

  model: Hero = { id: 7, name: 'Example Hero' };

  submitted = false;

  onSubmit() {
    this.submitted = true;
    this.heroService.addHero({ name: this.model.name } as Hero);
    this.router.navigateByUrl('/heroes', {skipLocationChange: true});
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  constructor(private router: Router,
    private heroService: HeroService) { }

  ngOnInit() {
  }

}
