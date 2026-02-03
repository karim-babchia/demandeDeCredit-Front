import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerantsComponent } from './gerants.component';

describe('GerantsComponent', () => {
  let component: GerantsComponent;
  let fixture: ComponentFixture<GerantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
