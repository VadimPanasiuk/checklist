/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistDetailComponent } from '../../../../../../main/webapp/app/entities/checklist/checklist-detail.component';
import { ChecklistService } from '../../../../../../main/webapp/app/entities/checklist/checklist.service';
import { Checklist } from '../../../../../../main/webapp/app/entities/checklist/checklist.model';

describe('Component Tests', () => {

    describe('Checklist Management Detail Component', () => {
        let comp: ChecklistDetailComponent;
        let fixture: ComponentFixture<ChecklistDetailComponent>;
        let service: ChecklistService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistDetailComponent],
                providers: [
                    ChecklistService
                ]
            })
            .overrideTemplate(ChecklistDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Checklist(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.checklist).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
