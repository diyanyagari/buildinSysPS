import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepsModule, MenuItem } from 'primeng/primeng';
import { Router } from "@angular/router";
@Component({
    selector: 'app-proses-penggajian',
    templateUrl: './proses-penggajian.component.html',
    styleUrls: ['./proses-penggajian.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProsesPenggajianComponent implements OnInit {
    items: MenuItem[];
    activeIndex: number = 0;

    constructor(private route: Router) { }
    ngOnInit() {
        this.activeIndex = parseInt(localStorage.getItem('proses-penggajian'));
        this.items = [
        /*{
            label: 'Import Absensi',
            command: (event: any) => {
                this.activeIndex = 0;
                this.route.navigate(['import-data-absensi']);
                localStorage.setItem('proses-penggajian', String(this.activeIndex));
            }
        },*/
        {
            label: 'Rekap Absensi',
            command: (event: any) => {
                this.activeIndex = 0;
                this.route.navigate(['rekapitulasi-perhitungan-absensi']);
                localStorage.setItem('proses-penggajian', String(this.activeIndex));
            }
        },
        {
            label: 'Hitung Lembur',
            command: (event: any) => {
                this.activeIndex = 1;
                this.route.navigate(['rekapitulasi-perhitungan-lembur']);
                localStorage.setItem('proses-penggajian', String(this.activeIndex));
            }
        },
        // {
        //     label: 'Hitung Cicilan',
        //     command: (event: any) => {
        //         this.activeIndex = 3;
        //         this.route.navigate(['perhitungan-cicilan-pinjaman']);
        //         localStorage.setItem('proses-penggajian',String(this.activeIndex));
        //     }
        // },
        // {
        //     label: 'Hitung Struktur Gaji',
        //     command: (event: any) => {
        //         this.activeIndex = 4;
        //         this.route.navigate(['perhitungan-gaji']);
        //         localStorage.setItem('proses-penggajian',String(this.activeIndex));
        //     }
        // },
        // {
        //     label: 'Hitung Asuransi',
        //     command: (event: any) => {
        //         this.activeIndex = 5;
        //         this.route.navigate(['perhitungan-biaya-asuransi-kesehatan']);
        //         localStorage.setItem('proses-penggajian',String(this.activeIndex));
        //     }
        // },
        // {
        //     label: 'Hitung Pajak',
        //     command: (event: any) => {
        //         this.activeIndex = 6;
        //         this.route.navigate(['perhitungan-pajak']);
        //         localStorage.setItem('proses-penggajian',String(this.activeIndex));
        //     }
        // },
        
        {
            label: 'Payroll',
            command: (event: any) => {
                this.activeIndex = 2;
                this.route.navigate(['payroll']);
                localStorage.setItem('proses-penggajian', String(this.activeIndex));
            }
        }/*,
        {
            label: 'Monitoring gaji',
            command: (event: any) => {
                this.activeIndex = 3;
                this.route.navigate(['daftar-monitoring-penggajian']);
                localStorage.setItem('proses-penggajian',String(this.activeIndex));
            }
        },*/

        ];

    }

}
