import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Checklist } from './checklist.model';
import { ChecklistPopupService } from './checklist-popup.service';
import { ChecklistService } from './checklist.service';
import { ChecklistItem, ChecklistItemService } from '../checklist-item';
import { Subitem, SubitemService } from '../subitem';

@Component({
    selector: 'jhi-checklist-dialog',
    templateUrl: './checklist-dialog.component.html'
})
export class ChecklistDialogComponent implements OnInit {

    checklist: Checklist;
    isSaving: boolean;

    checklistitems: ChecklistItem[];

    subitems: Subitem[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private checklistService: ChecklistService,
        private checklistItemService: ChecklistItemService,
        private subitemService: SubitemService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.checklistItemService.query()
            .subscribe((res: HttpResponse<ChecklistItem[]>) => { this.checklistitems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
        this.subitemService.query()
            .subscribe((res: HttpResponse<Subitem[]>) => { this.subitems = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.checklist.id !== undefined) {
            this.subscribeToSaveResponse(
                this.checklistService.update(this.checklist));
        } else {
            this.subscribeToSaveResponse(
                this.checklistService.create(this.checklist));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Checklist>>) {
        result.subscribe((res: HttpResponse<Checklist>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Checklist) {
        this.eventManager.broadcast({ name: 'checklistListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackChecklistItemById(index: number, item: ChecklistItem) {
        return item.id;
    }

    trackSubitemById(index: number, item: Subitem) {
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
    selector: 'jhi-checklist-popup',
    template: ''
})
export class ChecklistPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private checklistPopupService: ChecklistPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.checklistPopupService
                    .open(ChecklistDialogComponent as Component, params['id']);
            } else {
                this.checklistPopupService
                    .open(ChecklistDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
