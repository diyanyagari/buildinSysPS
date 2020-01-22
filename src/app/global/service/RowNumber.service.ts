import { Component, Injectable, forwardRef, Inject } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Configuration } from '../config';
import { HttpClient } from '../service/HttpClient';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject'; 

@Injectable()
export class RowNumberService {

  constructor(private http: HttpClient) {}

  public addRowNumber(page: number, rows: number, listData: any)  {
        
        if(listData != undefined){
        	let number = 0;

        	//validate page, sebagian page berawal dari 0 
        	if(page ==0){
        	   page =1;
        	} 

        	//initial data awals
        	number = page * rows - rows;

/*        	for(let listLittle of listData){        		 
        		let nums={'number': number ++ };
        		listLittle.push(nums);
			 }*/
			 for(let i =0 ; i < listData.length ; i++){  
			    number ++;  
        		listData[i].number= number;
			 }
        }

       
        return listData;
  }
}	

