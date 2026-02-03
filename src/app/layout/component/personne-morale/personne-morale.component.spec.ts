import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonneMoraleComponent } from './personne-morale.component';

describe('PersonneMoraleComponent', () => {
  let component: PersonneMoraleComponent;
  let fixture: ComponentFixture<PersonneMoraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonneMoraleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonneMoraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
