import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Checklist } from './checklist.model';
import { ChecklistService } from './checklist.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-checklist',
    templateUrl: './checklist.component.html'
})
export class ChecklistComponent implements OnInit, OnDestroy {
checklists: Checklist[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private checklistService: ChecklistService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.checklistService.query().subscribe(
            (res: HttpResponse<Checklist[]>) => {
                this.checklists = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInChecklists();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Checklist) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInChecklists() {
        this.eventSubscriber = this.eventManager.subscribe('checklistListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
