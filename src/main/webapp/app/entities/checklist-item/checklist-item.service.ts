import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ChecklistItem } from './checklist-item.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ChecklistItem>;

@Injectable()
export class ChecklistItemService {

    private resourceUrl =  SERVER_API_URL + 'api/checklist-items';

    constructor(private http: HttpClient) { }

    create(checklistItem: ChecklistItem): Observable<EntityResponseType> {
        const copy = this.convert(checklistItem);
        return this.http.post<ChecklistItem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(checklistItem: ChecklistItem): Observable<EntityResponseType> {
        const copy = this.convert(checklistItem);
        return this.http.put<ChecklistItem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ChecklistItem>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ChecklistItem[]>> {
        const options = createRequestOption(req);
        return this.http.get<ChecklistItem[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ChecklistItem[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ChecklistItem = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ChecklistItem[]>): HttpResponse<ChecklistItem[]> {
        const jsonResponse: ChecklistItem[] = res.body;
        const body: ChecklistItem[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ChecklistItem.
     */
    private convertItemFromServer(checklistItem: ChecklistItem): ChecklistItem {
        const copy: ChecklistItem = Object.assign({}, checklistItem);
        return copy;
    }

    /**
     * Convert a ChecklistItem to a JSON which can be sent to the server.
     */
    private convert(checklistItem: ChecklistItem): ChecklistItem {
        const copy: ChecklistItem = Object.assign({}, checklistItem);
        return copy;
    }
}
