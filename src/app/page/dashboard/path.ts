export const routeDashboard = [
	{ path: '', loadChildren: './page/dashboard/page-dashboard.module#MainDashboardModule' },
	{ path:'pencarian', loadChildren: './page/dashboard/page-dashboard.module#PencarianModule' }
];	