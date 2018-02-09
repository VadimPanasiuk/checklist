/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistItemComponent } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.component';
import { ChecklistItemService } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.service';
import { ChecklistItem } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.model';

describe('Component Tests', () => {

    describe('ChecklistItem Management Component', () => {
        let comp: ChecklistItemComponent;
        let fixture: ComponentFixture<ChecklistItemComponent>;
        let service: ChecklistItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistItemComponent],
                providers: [
                    ChecklistItemService
                ]
            })
            .overrideTemplate(ChecklistItemComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistItemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ChecklistItem(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.checklistItems[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
