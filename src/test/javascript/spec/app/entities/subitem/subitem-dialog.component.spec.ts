/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ChecklistTestModule } from '../../../test.module';
import { SubitemDialogComponent } from '../../../../../../main/webapp/app/entities/subitem/subitem-dialog.component';
import { SubitemService } from '../../../../../../main/webapp/app/entities/subitem/subitem.service';
import { Subitem } from '../../../../../../main/webapp/app/entities/subitem/subitem.model';
import { ItemService } from '../../../../../../main/webapp/app/entities/item';
import { ChecklistService } from '../../../../../../main/webapp/app/entities/checklist';

describe('Component Tests', () => {

    describe('Subitem Management Dialog Component', () => {
        let comp: SubitemDialogComponent;
        let fixture: ComponentFixture<SubitemDialogComponent>;
        let service: SubitemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [SubitemDialogComponent],
                providers: [
                    ItemService,
                    ChecklistService,
                    SubitemService
                ]
            })
            .overrideTemplate(SubitemDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SubitemDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SubitemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Subitem(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.subitem = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'subitemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new Subitem();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.subitem = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'subitemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
