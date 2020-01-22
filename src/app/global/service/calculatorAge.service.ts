import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class CalculatorAgeService {
  constructor() { }


  getUmurByDate(tgl, buln, tahun) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    var dob = new Date();
    dob.setDate(tgl);
    dob.setMonth(buln);
    dob.setFullYear(tahun);

    var yearDob = dob.getFullYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    var age = {};

    let yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };
    return age;
  }

  getDateByAge(tahun,bulan,hari) {
    let birthDate;
    birthDate = moment().subtract(parseInt(tahun), 'years').subtract(parseInt(bulan), 'months').subtract(parseInt(hari), 'days');
    return birthDate._d;
  }
}