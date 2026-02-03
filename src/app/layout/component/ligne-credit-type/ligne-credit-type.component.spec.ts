import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneCreditTypeComponent } from './ligne-credit-type.component';

describe('LigneCreditTypeComponent', () => {
  let component: LigneCreditTypeComponent;
  let fixture: ComponentFixture<LigneCreditTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigneCreditTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigneCreditTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
