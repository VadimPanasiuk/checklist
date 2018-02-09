import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ChecklistItem } from './checklist-item.model';
import { ChecklistItemPopupService } from './checklist-item-popup.service';
import { ChecklistItemService } from './checklist-item.service';
import { Checklist, ChecklistService } from '../checklist';

@Component({
    selector: 'jhi-checklist-item-dialog',
    templateUrl: './checklist-item-dialog.component.html'
})
export class ChecklistItemDialogComponent implements OnInit {

    checklistItem: ChecklistItem;
    isSaving: boolean;

    checklists: Checklist[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private checklistItemService: ChecklistItemService,
        private checklistService: ChecklistService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.checklistService.query()
            .subscribe((res: HttpResponse<Checklist[]>) => { this.checklists = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.checklistItem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.checklistItemService.update(this.checklistItem));
        } else {
            this.subscribeToSaveResponse(
                this.checklistItemService.create(this.checklistItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ChecklistItem>>) {
        result.subscribe((res: HttpResponse<ChecklistItem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ChecklistItem) {
        this.eventManager.broadcast({ name: 'checklistItemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackChecklistById(index: number, item: Checklist) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}

@Component({
    selector: 'jhi-checklist-item-popup',
    template: ''
})
export class ChecklistItemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private checklistItemPopupService: ChecklistItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.checklistItemPopupService
                    .open(ChecklistItemDialogComponent as Component, params['id']);
            } else {
                this.checklistItemPopupService
                    .open(ChecklistItemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
