import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Subitem } from './subitem.model';
import { SubitemService } from './subitem.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-subitem',
    templateUrl: './subitem.component.html'
})
export class SubitemComponent implements OnInit, OnDestroy {
subitems: Subitem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private subitemService: SubitemService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.subitemService.query().subscribe(
            (res: HttpResponse<Subitem[]>) => {
                this.subitems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSubitems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Subitem) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInSubitems() {
        this.eventSubscriber = this.eventManager.subscribe('subitemListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
