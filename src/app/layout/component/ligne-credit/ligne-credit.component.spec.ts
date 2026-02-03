import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneCreditComponent } from './ligne-credit.component';

describe('LigneCreditComponent', () => {
  let component: LigneCreditComponent;
  let fixture: ComponentFixture<LigneCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigneCreditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigneCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
