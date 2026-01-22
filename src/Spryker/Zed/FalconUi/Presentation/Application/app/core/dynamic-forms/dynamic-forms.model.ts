import { InjectionToken, Provider, Type } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { BaseDynamicControl } from './dynamic-controls/base-dynamic-control';
import { DatasourceConfig } from '@spryker/datasource';

export interface DynamicOptions {
    label: string;
    value: string;
}

export interface CustomValidators {}

type ValidatorKeys = keyof Omit<typeof Validators & CustomValidators, 'prototype' | 'compose' | 'composeAsync'> &
    CustomValidators;

export interface DynamicControlType {
    input: () => Promise<Type<BaseDynamicControl>>;
    select: () => Promise<Type<BaseDynamicControl>>;
    checkbox: () => Promise<Type<BaseDynamicControl>>;
    datepicker: () => Promise<Type<BaseDynamicControl>>;
    toggle: () => Promise<Type<BaseDynamicControl>>;
    radio: () => Promise<Type<BaseDynamicControl>>;
}

export interface DynamicControl<T = string> {
    name: string;
    controlType: keyof DynamicControlType;
    type?: string;
    label: string;
    order?: number;
    value: T | null;
    layout?: {
        template: 'card';
        title?: string;
        [key: string]: unknown;
    };
    interactive?: {
        buttonText: string;
        controlTemplate: DynamicControl;
    };
    activationConfig?: {
        controlPath: string;
        hasValue: unknown;
    };
    controlInstance?: AbstractControl<T>;
    options?: DynamicOptions[] | string[];
    datasource?: DatasourceConfig;
    controls?: DynamicControl[];
    validators?: {
        [key in ValidatorKeys]?: unknown;
    };
}

export const DYNAMIC_FORM_CONTROLS = new InjectionToken<DynamicControlType[]>('DYNAMIC_COMPONENTS');

export function registerDynamicFormControls(components: DynamicControlType): Provider {
    return {
        provide: DYNAMIC_FORM_CONTROLS,
        useValue: components,
        multi: true,
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidationErrorMessageFn = (args?: any) => string;
export type ValidationErrorMessages = Record<string, ValidationErrorMessageFn>;

export const VALIDATION_ERROR_MESSAGES = new InjectionToken<ValidationErrorMessages[]>('Validation Messages');

export function registerValidationErrorMessages(messages: ValidationErrorMessages): Provider {
    return {
        provide: VALIDATION_ERROR_MESSAGES,
        useValue: messages,
        multi: true,
    };
}
