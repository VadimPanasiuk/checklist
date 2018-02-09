/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ChecklistTestModule } from '../../../test.module';
import { SubitemComponent } from '../../../../../../main/webapp/app/entities/subitem/subitem.component';
import { SubitemService } from '../../../../../../main/webapp/app/entities/subitem/subitem.service';
import { Subitem } from '../../../../../../main/webapp/app/entities/subitem/subitem.model';

describe('Component Tests', () => {

    describe('Subitem Management Component', () => {
        let comp: SubitemComponent;
        let fixture: ComponentFixture<SubitemComponent>;
        let service: SubitemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [SubitemComponent],
                providers: [
                    SubitemService
                ]
            })
            .overrideTemplate(SubitemComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SubitemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SubitemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Subitem(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.subitems[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
