import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';      
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VistaClase } from './vista-clase';

describe('VistaClase', () => {
  let component: VistaClase;
  let fixture: ComponentFixture<VistaClase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaClase, HttpClientTestingModule, RouterTestingModule]
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
