import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProyectos } from './lista-proyectos';

describe('ListaProyectos', () => {
  let component: ListaProyectos;
  let fixture: ComponentFixture<ListaProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
