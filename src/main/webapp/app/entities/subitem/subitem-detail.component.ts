import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Subitem } from './subitem.model';
import { SubitemService } from './subitem.service';

@Component({
    selector: 'jhi-subitem-detail',
    templateUrl: './subitem-detail.component.html'
})
export class SubitemDetailComponent implements OnInit, OnDestroy {

    subitem: Subitem;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private subitemService: SubitemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSubitems();
    }

    load(id) {
        this.subitemService.find(id)
            .subscribe((subitemResponse: HttpResponse<Subitem>) => {
                this.subitem = subitemResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSubitems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'subitemListModification',
            (response) => this.load(this.subitem.id)
        );
    }
}
