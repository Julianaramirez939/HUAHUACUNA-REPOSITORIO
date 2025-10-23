import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReestablecerContrasenaComponent } from './restablecer-contrasena.component';

describe('ReestablecerContrasenaComponent', () => {
  let component: ReestablecerContrasenaComponent;
  let fixture: ComponentFixture<ReestablecerContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReestablecerContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReestablecerContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
