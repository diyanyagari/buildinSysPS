export { AppComponent } from './app.component';
export { AppMenuComponent, AppSubMenu } from './app.menu.component';
export { AppSideBarComponent } from './app.sidebar.component';
export { AppSidebarTabContent } from './app.sidebartabcontent.component';
export { AppTopBar } from './app.topbar.component';
export { AppFooter } from './app.footer.component';

import * as app from './';

export const apps = [
    app.AppComponent,   
    app.AppMenuComponent,   
    app.AppSubMenu,   
    app.AppSideBarComponent,   
    app.AppSidebarTabContent,   
    app.AppTopBar,   
    app.AppFooter   
];


import * as ng from 'primeng/primeng';

// import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
// import { BlockUIModule } from 'primeng/components/blockui/blockui';
// import { ButtonModule } from 'primeng/components/button/button';
// import { CalendarModule } from 'primeng/components/calendar/calendar';
// import { ChartModule } from 'primeng/components/chart/chart';
// import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
// import { ConfirmDialogModule} from 'primeng/components/confirmdialog/confirmdialog';
// import { ContextMenuModule } from 'primeng/components/contextmenu/contextmenu';
// import { DataTableModule } from 'primeng/components/datatable/datatable';
// import { DialogModule } from 'primeng/components/dialog/dialog';
// import { DragDropModule } from 'primeng/components/dragdrop/dragdrop';
// import { DropdownModule } from 'primeng/components/dropdown/dropdown';
// import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
// import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
// import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
// import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
// import { InputTextModule } from 'primeng/components/inputtext/inputtext';
// import { StepsModule } from 'primeng/components/steps/steps';
// import { ToolbarModule } from 'primeng/components/toolbar/toolbar';
// import { TooltipModule } from 'primeng/components/tooltip/tooltip';
// import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
// import { OrganizationChartModule } from 'primeng/components/organizationchart/organizationchart';
// import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
// import { PaginatorModule } from 'primeng/components/paginator/paginator';
// import { PanelModule } from 'primeng/components/panel/panel';
// import { ProgressBarModule } from 'primeng/components/progressbar/progressbar';
// import { ProgressSpinnerModule } from 'primeng/components/progressspinner/progressspinner';
// import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
// import { ScheduleModule } from 'primeng/components/schedule/schedule';
// import { SidebarModule } from 'primeng/components/sidebar/sidebar';
// import { SpinnerModule } from 'primeng/components/spinner/spinner';
// import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
// import { TabViewModule } from 'primeng/components/tabview/tabview';
// import { TreeModule } from 'primeng/components/tree/tree';

///////////////////////////////
/// PrimeNg Module         ///
/// Berurutan sesuai Abjad ///
//////////////////////////////

export const primeAppModule = [
    ng.ButtonModule,
    ng.ConfirmDialogModule,
    ng.DialogModule,
    ng.DragDropModule,
    ng.DropdownModule,
    ng.FileUploadModule,
    ng.InputTextModule,
    ng.ProgressBarModule,
    ng.StepsModule,
    ng.ToolbarModule,
    ng.BreadcrumbModule,
    ng.TooltipModule,
];


export const primeNgModule = [
    // ng.AccordionModule,
    ng.AutoCompleteModule,
    ng.BlockUIModule,
    ng.BreadcrumbModule,
    ng.ButtonModule,
    //ng.CalendarModule,
    // ng.CarouselModule,
    ng.ChartModule,
    ng.CheckboxModule,
    // ng.ChipsModule,
    // ng.CodeHighlighterModule,
    // ng.ColorPickerModule,
    ng.ConfirmDialogModule,
    ng.ContextMenuModule,
    // ng.DataGridModule,
    // ng.DataListModule,
    // ng.DataScrollerModule,
    ng.DataTableModule,
    ng.DialogModule,
    // ng.DragDropModule,
    ng.DropdownModule,
    // ng.EditorModule,
    ng.FieldsetModule,
    ng.FileUploadModule,
    // ng.GalleriaModule,
    // ng.GMapModule,
    // ng.GrowlModule,
    // ng.LightboxModule,
    // ng.ListboxModule,
    // ng.InplaceModule,
    ng.InputMaskModule,
    // ng.InputSwitchModule,
    ng.InputTextareaModule,
    ng.InputTextModule,
    // ng.MegaMenuModule,
    // ng.MessagesModule,
    // ng.MenubarModule,
    // ng.MenuModule,
    ng.MultiSelectModule,
    // ng.OrderListModule,
    ng.OrganizationChartModule,
    ng.OverlayPanelModule,
    ng.PaginatorModule,
    // ng.PanelMenuModule,
    ng.PanelModule,
    // ng.PasswordModule,
    // ng.PickListModule,
    // ng.ProgressBarModule,
    ng.ProgressSpinnerModule,
    ng.RadioButtonModule,
    // ng.RatingModule,
    ng.ScheduleModule,
    // ng.SelectButtonModule,
    ng.SharedModule,
    ng.SidebarModule,    
    // ng.SlideMenuModule,
    // ng.SliderModule,
    ng.SpinnerModule,
    ng.SplitButtonModule,
    // ng.TabMenuModule,
    ng.TabViewModule,
    // ng.TerminalModule,
    // ng.TieredMenuModule,
    // ng.ToggleButtonModule,
    ng.ToolbarModule,
    ng.TooltipModule,
    ng.TreeModule,
    // ng.TreeTableModule,
    // ng.TriStateCheckboxModule,
];

