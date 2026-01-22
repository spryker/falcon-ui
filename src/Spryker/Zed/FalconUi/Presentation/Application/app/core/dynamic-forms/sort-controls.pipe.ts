import { Pipe, PipeTransform } from '@angular/core';
import { DynamicControl } from './dynamic-forms.model';

@Pipe({
    name: 'sortControls',
    standalone: true,
})
export class SortControlsPipe implements PipeTransform {
    transform(controls: DynamicControl[] | undefined): DynamicControl[] {
        if (!controls) {
            return [];
        }
        return [...controls].sort((a, b) => (a.order || 0) - (b.order || 0));
    }
}
