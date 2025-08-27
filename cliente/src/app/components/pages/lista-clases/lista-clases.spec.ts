import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaClases } from './lista-clases';

describe('ListaClases', () => {
  let component: ListaClases;
  let fixture: ComponentFixture<ListaClases>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaClases]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaClases);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
