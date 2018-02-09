import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Subitem } from './subitem.model';
import { SubitemPopupService } from './subitem-popup.service';
import { SubitemService } from './subitem.service';

@Component({
    selector: 'jhi-subitem-delete-dialog',
    templateUrl: './subitem-delete-dialog.component.html'
})
export class SubitemDeleteDialogComponent {

    subitem: Subitem;

    constructor(
        private subitemService: SubitemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.subitemService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'subitemListModification',
                content: 'Deleted an subitem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-subitem-delete-popup',
    template: ''
})
export class SubitemDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private subitemPopupService: SubitemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.subitemPopupService
                .open(SubitemDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
