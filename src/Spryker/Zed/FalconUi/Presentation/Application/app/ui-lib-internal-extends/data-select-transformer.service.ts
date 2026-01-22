import { Injectable } from '@angular/core';
import { DataTransformer, DataTransformerConfig } from '@spryker/data-transformer';
import { SelectOption } from '@spryker/select';
import { Observable, of } from 'rxjs';

interface SelectMemberData {
    value: string;
    title: string;
}

interface SelectResponseData {
    member: SelectMemberData[];
}

interface SelectTransformerConfig extends DataTransformerConfig {
    valueField?: keyof SelectMemberData;
    titleField?: keyof SelectMemberData;
}

// Do not use, should be fixed in ui-library
@Injectable({
    providedIn: 'root',
})
export class DataSelectTransformerService implements DataTransformer<SelectResponseData, SelectTransformerConfig> {
    transform(data: SelectResponseData, config: SelectTransformerConfig): Observable<SelectOption[]> {
        return of(
            (data.member ?? []).map((item) => ({
                value: item[config.valueField ?? 'value'],
                title: item[config.titleField ?? 'title'],
            })),
        );
    }
}
