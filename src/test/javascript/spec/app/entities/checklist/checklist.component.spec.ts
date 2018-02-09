/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistComponent } from '../../../../../../main/webapp/app/entities/checklist/checklist.component';
import { ChecklistService } from '../../../../../../main/webapp/app/entities/checklist/checklist.service';
import { Checklist } from '../../../../../../main/webapp/app/entities/checklist/checklist.model';

describe('Component Tests', () => {

    describe('Checklist Management Component', () => {
        let comp: ChecklistComponent;
        let fixture: ComponentFixture<ChecklistComponent>;
        let service: ChecklistService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistComponent],
                providers: [
                    ChecklistService
                ]
            })
            .overrideTemplate(ChecklistComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Checklist(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.checklists[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
