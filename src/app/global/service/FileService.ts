import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
declare var jsPDF: any; // Important

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const PDF_EXTENSION = '.pdf';

@Injectable()
export class FileService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  //PDF
  public exportAsPdfFile(title:string,header:any,json: any, fileName: string): void {
    var rows=[];
    var doc = new jsPDF('landscape');
    for(var key in json){
      var temp=json[key];
      var arr = Object.keys(temp).map(function(k) { return temp[k] });
      rows.push(arr);
    }
    
           doc.setFontSize(12);//doc.internal.pageSize.width/2
           doc.text(title, doc.internal.pageSize.width-95, 20,  'center');
             //doc.text('Col and row span', 14, 20);
            //doc.text("Overflow 'linebreak'", 7, doc.autoTable.previous.finalY  + 10);
            /* doc.autoTable(col, rows, {
                startY: doc.autoTable.previous.finalY + 15,
                margin: {horizontal: 7},
                bodyStyles: {valign: 'top'},
                styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                columnStyles: {text: {columnWidth: 'auto'}}
              }); */
              var options ={
                // tableWidth: 'wrap',
                // columnWidth: 'auto',
                // pageBreak : 'always'
                styles: {
                  // overflow: 'linebreak',
                  columnWidth: 'wrap',
                  tableWidth: 'auto',
                },
                columnStyles: {
                  1: {columnWidth: 'auto'}
                } 
              };
              doc.autoTable(header, rows, options);
              doc.save(fileName+'_' + new Date().getTime() + PDF_EXTENSION); 
            }

          }