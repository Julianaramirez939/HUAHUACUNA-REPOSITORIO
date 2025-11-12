import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinosBitacoraComponent } from './ninos-bitacora.component';

describe('NinosBitacoraComponent', () => {
  let component: NinosBitacoraComponent;
  let fixture: ComponentFixture<NinosBitacoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinosBitacoraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NinosBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
