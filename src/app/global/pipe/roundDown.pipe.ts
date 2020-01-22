import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'rounddown'})
export class RoundDownPipe implements PipeTransform {

	transform(nilai: any) {
		return Math.floor(nilai);
	}
}