import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCreationComponent } from './hero-creation.component';

describe('HeroCreationComponent', () => {
  let component: HeroCreationComponent;
  let fixture: ComponentFixture<HeroCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
