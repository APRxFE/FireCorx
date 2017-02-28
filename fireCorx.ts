import * as Rx from 'rxjs'
import { Injectable, NgZone } from '@angular/core'

import * as firebase from 'firebase'
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2'


@Injectable()
export class FireCorx {

	at = firebase.database['ServerValue'].TIMESTAMP // Firebase TIMESTAMP
	auth: any = this.af.auth // Auth
	rdb: any = this.af.database // Database

	root$: any = this.rdb.object('/')
	rootRef: any = this.root$.$ref // Firebase Ref

	private _auth$: any

	private _isAuth: boolean = null
	get isAuth(){ return this._isAuth }
	get isAuthLoad(){ return this._isAuth === null ? true : false }

	private _authUid: string = null
	get authUid(){ return this._authUid }

	private _appStart = new Rx.Subject()

	appStartRx: any = this._appStart.first() // Auth 확인 후 처리를 위한..

	constructor(
		public af: AngularFire,
		private _zone: NgZone
	) {

		// Auth
		this._auth$ = this.auth
			.do(_=> {
				_ === null && (this._isAuth = false)
				_ !== null && this._appStart.next(true)
			})
			.filter(_=>!!_).subscribe(auth => {
				auth.uid && this._zone.run(() => {
					this._authUid = auth.uid
					this._isAuth = true
				})
			})

	}

	login(type: string) {
		this.loginRn(type).subscribe(ok => {})
	}

	loginRn = (type: string) => {
		if(type === 'google') return this._loginGoogleRn()
		return Rx.Observable.of(null)
	} 

	private _loginGoogleRn = () => {
		return Rx.Observable.fromPromise(
			this.auth.login({ provider: AuthProviders.Google, method: AuthMethods.Redirect }) 
		)
	}

	logout() {
		this.logoutRn().subscribe(ok => {})
	}

	logoutRn = () => Rx.Observable.fromPromise(this.auth.logout())
		.do(_ => {
			this._isAuth = false
			this._authUid = null
		})

}