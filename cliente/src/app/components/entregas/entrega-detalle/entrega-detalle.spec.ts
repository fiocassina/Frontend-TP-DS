import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaDetalle } from './entrega-detalle';

describe('EntregaDetalle', () => {
  let component: EntregaDetalle;
  let fixture: ComponentFixture<EntregaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregaDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
