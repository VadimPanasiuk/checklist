/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ChecklistTestModule } from '../../../test.module';
import { SubitemDetailComponent } from '../../../../../../main/webapp/app/entities/subitem/subitem-detail.component';
import { SubitemService } from '../../../../../../main/webapp/app/entities/subitem/subitem.service';
import { Subitem } from '../../../../../../main/webapp/app/entities/subitem/subitem.model';

describe('Component Tests', () => {

    describe('Subitem Management Detail Component', () => {
        let comp: SubitemDetailComponent;
        let fixture: ComponentFixture<SubitemDetailComponent>;
        let service: SubitemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [SubitemDetailComponent],
                providers: [
                    SubitemService
                ]
            })
            .overrideTemplate(SubitemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SubitemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SubitemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Subitem(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.subitem).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
