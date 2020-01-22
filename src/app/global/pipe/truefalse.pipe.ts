import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'truefalse'})
export class TrueFalsePipe implements PipeTransform {

	transform(info: boolean) {
		return (info)?'Aktif':'Tidak Aktif';
	}
}