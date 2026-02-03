import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionneursComponent } from './actionneurs.component';

describe('ActionneursComponent', () => {
  let component: ActionneursComponent;
  let fixture: ComponentFixture<ActionneursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionneursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
