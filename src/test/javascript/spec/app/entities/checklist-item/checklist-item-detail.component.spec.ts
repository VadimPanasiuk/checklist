/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistItemDetailComponent } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item-detail.component';
import { ChecklistItemService } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.service';
import { ChecklistItem } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.model';

describe('Component Tests', () => {

    describe('ChecklistItem Management Detail Component', () => {
        let comp: ChecklistItemDetailComponent;
        let fixture: ComponentFixture<ChecklistItemDetailComponent>;
        let service: ChecklistItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistItemDetailComponent],
                providers: [
                    ChecklistItemService
                ]
            })
            .overrideTemplate(ChecklistItemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistItemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ChecklistItem(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.checklistItem).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
