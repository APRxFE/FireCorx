import 'rxjs/Rx'

import { NgModule } from '@angular/core'
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2'
import { environment } from '../../src/environments/environment' // Firebase Config

import { FireCorx } from './fireCorx'


@NgModule({
	imports: [
		AngularFireModule.initializeApp(environment.firebase)
	],
	providers: [
		FireCorx
	]
})
export class FireCorxModule {
	static initializeApp(config: FirebaseAppConfig){
		return {
			ngModule: FireCorxModule,
			imports: [
				AngularFireModule.initializeApp(config)
			],
			providers: [
				FireCorx
			]
		}
	}	
}

export { FireCorx }