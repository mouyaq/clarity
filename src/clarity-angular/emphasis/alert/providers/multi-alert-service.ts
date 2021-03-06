/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {Injectable, QueryList} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

import {Alert} from "../alert";

@Injectable()
export class MultiAlertService {
    private allAlerts: QueryList<Alert> = new QueryList<Alert>();
    private _current = 0;

    /**
     * The Observable that lets other classes subscribe to changes
     */
    private _change = new Subject<number>();
    public get changes(): Observable<number> {
        return this._change.asObservable();
    }

    get current() {
        return this._current;
    }
    set current(index: number) {
        if (index !== this._current) {
            this._current = index;
            this._change.next(index);
        }
    }

    get activeAlerts() {
        return this.allAlerts.filter((alert) => !alert._closed);
    }

    get currentAlert() {
        return this.activeAlerts[this.current];
    }

    set currentAlert(alert: Alert) {
        this.current = this.activeAlerts.indexOf(alert);
    }

    get count() {
        return this.activeAlerts.length;
    }

    manage(alerts: QueryList<Alert>) {
        this.allAlerts = alerts;
    }

    next() {
        this.current = (this.current === this.activeAlerts.length - 1) ? 0 : this.current + 1;
    }

    previous() {
        this.current = (this.current === 0) ? this.activeAlerts.length - 1 : this.current - 1;
    }

    close() {
        this.previous();
    }
}
