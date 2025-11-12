import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonantesHomeComponent } from './donantes-home.component';

describe('DonantesHomeComponent', () => {
  let component: DonantesHomeComponent;
  let fixture: ComponentFixture<DonantesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonantesHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonantesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
