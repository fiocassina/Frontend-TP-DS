import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaClase } from './vista-clase';

describe('VistaClase', () => {
  let component: VistaClase;
  let fixture: ComponentFixture<VistaClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
