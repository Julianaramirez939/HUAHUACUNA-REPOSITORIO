import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAdminPadrinoComponent } from './navbar-admin-padrino.component';

describe('NavbarAdminPadrinoComponent', () => {
  let component: NavbarAdminPadrinoComponent;
  let fixture: ComponentFixture<NavbarAdminPadrinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAdminPadrinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAdminPadrinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
