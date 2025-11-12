import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonacionesHomeComponent } from './donaciones-home.component';

describe('DonacionesHomeComponent', () => {
  let component: DonacionesHomeComponent;
  let fixture: ComponentFixture<DonacionesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonacionesHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonacionesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
