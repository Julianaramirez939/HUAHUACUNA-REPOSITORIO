import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasNinosHomeComponent } from './noticias-ninos-home.component';

describe('NoticiasNinosHomeComponent', () => {
  let component: NoticiasNinosHomeComponent;
  let fixture: ComponentFixture<NoticiasNinosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiasNinosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiasNinosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
