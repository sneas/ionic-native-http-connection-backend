import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';

import { HTTPError } from './http-error';

export class HTTPMock extends HTTP {
    requestResolve: (response: HTTPResponse) => void;
    requestReject: (error: HTTPError) => void;

    sendRequest(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    post(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    get(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    put(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    delete(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    patch(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }

    head(): Promise<HTTPResponse> {
        return new Promise((resolve, reject) => {
            this.requestResolve = resolve;
            this.requestReject = reject;
        });
    }
}
