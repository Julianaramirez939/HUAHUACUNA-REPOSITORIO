import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarPadrinoHomeComponent } from './navbar-padrino-home.component';

describe('NavbarPadrinoHomeComponent', () => {
  let component: NavbarPadrinoHomeComponent;
  let fixture: ComponentFixture<NavbarPadrinoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarPadrinoHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarPadrinoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
