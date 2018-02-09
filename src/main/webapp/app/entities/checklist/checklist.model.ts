import { BaseEntity } from './../../shared';

export class Checklist implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public order?: number,
        public identifier?: string,
        public imageContentType?: string,
        public image?: any,
        public checklistitems?: BaseEntity[],
        public subitems?: BaseEntity[],
    ) {
    }
}
