import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'roundnum'})
export class RoundNumPipe implements PipeTransform {

	transform(nilai: any) {
		return Math.round(nilai);
	}
}