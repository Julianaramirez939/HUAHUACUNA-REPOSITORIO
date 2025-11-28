import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoNinosComponent } from './progreso-ninos.component';

describe('ProgresoNinosComponent', () => {
  let component: ProgresoNinosComponent;
  let fixture: ComponentFixture<ProgresoNinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoNinosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoNinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
