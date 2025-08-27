import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClassForm } from './create-class-form';

describe('CreateClassForm', () => {
  let component: CreateClassForm;
  let fixture: ComponentFixture<CreateClassForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClassForm]
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
