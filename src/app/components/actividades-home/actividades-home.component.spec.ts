import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesHomeComponent } from './actividades-home.component';

describe('ActividadesHomeComponent', () => {
  let component: ActividadesHomeComponent;
  let fixture: ComponentFixture<ActividadesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
