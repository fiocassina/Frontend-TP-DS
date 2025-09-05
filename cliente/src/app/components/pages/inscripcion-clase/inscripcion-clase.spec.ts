import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionClase } from './inscripcion-clase';

describe('InscripcionClase', () => {
  let component: InscripcionClase;
  let fixture: ComponentFixture<InscripcionClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscripcionClase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionClase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
