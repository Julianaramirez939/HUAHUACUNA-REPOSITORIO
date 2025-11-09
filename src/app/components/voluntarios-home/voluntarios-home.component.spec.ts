import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoluntariosHomeComponent } from './voluntarios-home.component';

describe('VoluntariosHomeComponent', () => {
  let component: VoluntariosHomeComponent;
  let fixture: ComponentFixture<VoluntariosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoluntariosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoluntariosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
