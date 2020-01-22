import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'roundup'})
export class RoundUpPipe implements PipeTransform {

	transform(nilai: any) {
		return Math.ceil(nilai);
	}
}