/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ChecklistTestModule } from '../../../test.module';
import { ChecklistDialogComponent } from '../../../../../../main/webapp/app/entities/checklist/checklist-dialog.component';
import { ChecklistService } from '../../../../../../main/webapp/app/entities/checklist/checklist.service';
import { Checklist } from '../../../../../../main/webapp/app/entities/checklist/checklist.model';
import { ChecklistItemService } from '../../../../../../main/webapp/app/entities/checklist-item';
import { SubitemService } from '../../../../../../main/webapp/app/entities/subitem';

describe('Component Tests', () => {

    describe('Checklist Management Dialog Component', () => {
        let comp: ChecklistDialogComponent;
        let fixture: ComponentFixture<ChecklistDialogComponent>;
        let service: ChecklistService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [ChecklistDialogComponent],
                providers: [
                    ChecklistItemService,
                    SubitemService,
                    ChecklistService
                ]
            })
            .overrideTemplate(ChecklistDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChecklistDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ChecklistService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Checklist(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.checklist = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'checklistListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Checklist();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.checklist = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'checklistListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
