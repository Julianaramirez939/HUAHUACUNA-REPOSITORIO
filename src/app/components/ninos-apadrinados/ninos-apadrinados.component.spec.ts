import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NinosApadrinadosComponent } from './ninos-apadrinados.component';

describe('NinosApadrinadosComponent', () => {
  let component: NinosApadrinadosComponent;
  let fixture: ComponentFixture<NinosApadrinadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NinosApadrinadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NinosApadrinadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
