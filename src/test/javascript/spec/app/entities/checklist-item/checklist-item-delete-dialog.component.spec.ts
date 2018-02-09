/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistItemDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item-delete-dialog.component';
import { ChecklistItemService } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.service';

describe('Component Tests', () => {

    describe('ChecklistItem Management Delete Component', () => {
        let comp: ChecklistItemDeleteDialogComponent;
        let fixture: ComponentFixture<ChecklistItemDeleteDialogComponent>;
        let service: ChecklistItemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistItemDeleteDialogComponent],
                providers: [
                    ChecklistItemService
                ]
            })
            .overrideTemplate(ChecklistItemDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistItemDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistItemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
