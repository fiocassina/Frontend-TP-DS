import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';      
import { HttpClientTestingModule } from '@angular/common/http/testing';import { CreateClassForm } from './create-class-form';

describe('CreateClassForm', () => {
  let component: CreateClassForm;
  let fixture: ComponentFixture<CreateClassForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClassForm, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClassForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
