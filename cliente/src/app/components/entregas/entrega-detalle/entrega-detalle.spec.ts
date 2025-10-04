import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaDetalleComponent } from './entrega-detalle';

describe('EntregaDetalle', () => {
  let component: EntregaDetalleComponent;
  let fixture: ComponentFixture<EntregaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
