import { BaseEntity } from './../../shared';

export class Subitem implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public order?: number,
        public identifier?: string,
        public imageContentType?: string,
        public image?: any,
        public item?: BaseEntity,
        public checklists?: BaseEntity[],
    ) {
    }
}
