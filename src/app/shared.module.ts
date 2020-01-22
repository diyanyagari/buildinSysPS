import { NgModule, ModuleWithProviders, LOCALE_ID } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { globalServices } from './global';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule } from '@ngx-translate/core';
import { StepsModule } from './steps/';
import { GlobalModule } from './global/global.module';

import { primeNgModule } from './';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ImageViewerModule } from "ngx-image-viewer";
import { PickListModule, PickList } from 'primeng/primeng';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditorModule, GalleriaModule } from 'primeng/primeng';
import { ListboxModule, CarouselModule, InputSwitchModule, AccordionModule, TreeTableModule, ToggleButtonModule } from 'primeng/primeng';
import {MatTooltipModule} from '@angular/material/tooltip';
@NgModule({
    imports: [
        ...primeNgModule,
        CommonModule,
        ...StepsModule,
        NgxDnDModule,
        NgxPaginationModule,
        EditorModule,
        PickListModule,
        MatTooltipModule,

        AgmCoreModule.forRoot({
            apiKey: "AIzaSyCRxO0Do1r9-Ufaz47q8ml-7PtFF7DmZ_0",
            libraries: ["places"]
        }),
        ImageViewerModule.forRoot(),
        ListboxModule,
        PickListModule,
        CarouselModule,
        InputSwitchModule,
        GalleriaModule,
        ToggleButtonModule
    ],
    exports: [
        ...primeNgModule,
        GlobalModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ...StepsModule,
        NgxDnDModule,
        NgxPaginationModule,
        EditorModule,
        PickListModule,
        MatTooltipModule,
        TranslateModule,
        AgmCoreModule,
        ImageViewerModule,
        ListboxModule,
        CarouselModule,
        InputSwitchModule,
        GalleriaModule,
        AccordionModule,
        TreeTableModule,
        ToggleButtonModule]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, { provide: LOCALE_ID, useValue: 'id-ID' }]
        };
    }
}