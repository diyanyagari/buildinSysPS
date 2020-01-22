import { Router, Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { routeAuth } from './page/auth/path';
import { routeRedirect } from './steps/path';
import { routeDashboard } from './page/dashboard/path'; 
import { routeBsc } from './page/bsc/path';

import { routeMaster } from './page/master/path';
import { routeMasterSK } from './page/master/path-sk';
import { routeMasterMap } from './page/master/path-map';
import { routeMasterData } from './page/master/path-master';

import { routeKlinik } from './page/klinik/path';
import { routeKiosk } from './page/kiosk/path';
import { routeDatabasePegawai } from './page/database-histori-pegawai/path-database-pegawai';

export const routes: Routes = [
	...routeAuth,
	...routeRedirect,
	...routeDashboard,
    ...routeMaster,
    ...routeKlinik,
    ...routeDatabasePegawai,
    {
        path:'kiosk',
        children: [...routeKiosk],        
    },
	{
        path: 'master-sk',
        children:  [...routeMasterSK]
    },
	{
        path: 'master-map',
        children:  [...routeMasterMap]
    },
	{
        path: 'master-data',
        children:  [...routeMasterData]
    },
    {
        path: 'pegawai',
        children:  [...routeDatabasePegawai]
    },
	...routeBsc
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true});
