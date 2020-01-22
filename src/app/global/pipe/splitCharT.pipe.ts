import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'splitCharT'})
export class SplitCharTPipe implements PipeTransform {

	transform(info: string) {
        //console.log(info);
        let finalString;
        let stringTranslate = info;
        let stringSlice = stringTranslate.split("__");
        if(stringSlice[1] != undefined){
                finalString = stringSlice[1];
                // let stringSlice = stringTranslate.slice(0,stringTranslate.indexOf("__"));
                return finalString;
                //console.log(finalString);
        }else if(stringSlice[1] == undefined){
                finalString = stringSlice[0];
                return finalString;
        }
        
	}
}