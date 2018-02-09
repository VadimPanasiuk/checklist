/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { ChecklistTestModule } from '../../../test.module';
import { SubitemDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/subitem/subitem-delete-dialog.component';
import { SubitemService } from '../../../../../../main/webapp/app/entities/subitem/subitem.service';

describe('Component Tests', () => {

    describe('Subitem Management Delete Component', () => {
        let comp: SubitemDeleteDialogComponent;
        let fixture: ComponentFixture<SubitemDeleteDialogComponent>;
        let service: SubitemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [ChecklistTestModule],
                declarations: [SubitemDeleteDialogComponent],
                providers: [
                    SubitemService
                ]
            })
            .overrideTemplate(SubitemDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SubitemDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SubitemService);
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
