import { Component, OnInit } from '@angular/core';
import { RadioButtonModule } from 'primeng/primeng';
import { Validators,FormControl,FormGroup,FormBuilder, FormArray} from '@angular/forms';
import { Router} from "@angular/router";
import { HttpClient} from '../../../global/service/HttpClient';
import { LazyLoadEvent, Message, ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
import { AlertService,  InfoService, Configuration, AuthGuard } from '../../../global';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard-monitoring-bsc',
  templateUrl: './dashboard-monitoring-bsc.component.html',
  styleUrls: ['./dashboard-monitoring-bsc.component.scss'],
  providers: [ConfirmationService]
})
export class DashboardMonitoringBscComponent implements OnInit {
  tanggalAwal:any;
	tanggalAkhir:any;
  constructor(
    private alertService: AlertService,
		private InfoService: InfoService,
		private httpService: HttpClient,
		private cdRef: ChangeDetectorRef,
		private confirmationService: ConfirmationService,
		private fb: FormBuilder,
		private route: Router
  ) { }

  ngOnInit() {
    this.tanggalAwal = new Date();
		this.tanggalAkhir = new Date();
		this.tanggalAwal.setHours(0, 0, 0, 0);
  }

  setTimeStamp(date) {

		if (date == null || date == undefined || date == '') {
			let dataTimeStamp = (new Date().getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		} else {
			let dataTimeStamp = (new Date(date).getTime() / 1000);
			return dataTimeStamp.toFixed(0);
		}

  }

}
