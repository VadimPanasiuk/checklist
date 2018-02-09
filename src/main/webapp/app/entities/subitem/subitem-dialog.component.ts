import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Subitem } from './subitem.model';
import { SubitemPopupService } from './subitem-popup.service';
import { SubitemService } from './subitem.service';
import { Item, ItemService } from '../item';
import { Checklist, ChecklistService } from '../checklist';

@Component({
    selector: 'jhi-subitem-dialog',
    templateUrl: './subitem-dialog.component.html'
})
export class SubitemDialogComponent implements OnInit {

    subitem: Subitem;
    isSaving: boolean;

    items: Item[];

    checklists: Checklist[];

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private subitemService: SubitemService,
        private itemService: ItemService,
        private checklistService: ChecklistService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.itemService.query()
            .subscribe((res: HttpResponse<Item[]>) => { this.items = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.subitem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.subitemService.update(this.subitem));
        } else {
            this.subscribeToSaveResponse(
                this.subitemService.create(this.subitem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Subitem>>) {
        result.subscribe((res: HttpResponse<Subitem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Subitem) {
        this.eventManager.broadcast({ name: 'subitemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackItemById(index: number, item: Item) {
        return item.id;
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
    selector: 'jhi-subitem-popup',
    template: ''
})
export class SubitemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private subitemPopupService: SubitemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.subitemPopupService
                    .open(SubitemDialogComponent as Component, params['id']);
            } else {
                this.subitemPopupService
                    .open(SubitemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
