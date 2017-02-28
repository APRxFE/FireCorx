import { Injectable, NgZone } from '@angular/core'

import * as firebase from 'firebase'
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2'


@Injectable()
export class FireCorx {

	at = firebase.database['ServerValue'].TIMESTAMP
	auth: any = this.af.auth
	rdb: any = this.af.database

	root$: any = this.rdb.object('/')
	rootRef: any = this.root$.$ref

	private _auth$: any = null
	isAuth: boolean = false

	authUid: string = null

	constructor(
		public af: AngularFire,
		private _zone: NgZone
	){

		// Auth 감시
		this._auth$ = this.auth.filter(_=>!!_).subscribe(auth => {
			auth.uid && this._zone.run(() => {
				this.authUid = auth.uid
				//this.router.navigate(['/'])
			})
		})

	}

	login(type: string){
		if(type === 'google') return this._loginGoogle()
	}

	private _loginGoogle(){
		this.auth.login({
			provider: AuthProviders.Google,
			method: AuthMethods.Redirect			
		}).then(d => {
		})
	}

}