import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesNinosHomeComponent } from './mensajes-ninos-home.component';

describe('MensajesNinosHomeComponent', () => {
  let component: MensajesNinosHomeComponent;
  let fixture: ComponentFixture<MensajesNinosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesNinosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajesNinosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
