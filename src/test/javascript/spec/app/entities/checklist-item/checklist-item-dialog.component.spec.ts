/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistItemDialogComponent } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item-dialog.component';
import { ChecklistItemService } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.service';
import { ChecklistItem } from '../../../../../../main/webapp/app/entities/checklist-item/checklist-item.model';
import { ChecklistService } from '../../../../../../main/webapp/app/entities/checklist';

describe('Component Tests', () => {

    describe('ChecklistItem Management Dialog Component', () => {
        let comp: ChecklistItemDialogComponent;
        let fixture: ComponentFixture<ChecklistItemDialogComponent>;
        let service: ChecklistItemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistItemDialogComponent],
                providers: [
                    ChecklistService,
                    ChecklistItemService
                ]
            })
            .overrideTemplate(ChecklistItemDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistItemDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistItemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ChecklistItem(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.checklistItem = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'checklistItemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new ChecklistItem();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.checklistItem = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'checklistItemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
