import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadrinosHomeComponent } from './padrinos-home.component';

describe('PadrinosHomeComponent', () => {
  let component: PadrinosHomeComponent;
  let fixture: ComponentFixture<PadrinosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PadrinosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PadrinosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
