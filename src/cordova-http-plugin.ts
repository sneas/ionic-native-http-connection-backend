import { Plugin, Cordova, IonicNativePlugin } from '@ionic-native/core';
import { Injectable } from '@angular/core';

export interface HTTPResponse {
    /**
     * The status number of the response
     */
    status: number;
    /**
     * The data that is in the response. This property usually exists when a promise returned by a request method resolves.
     */
    data?: any;
    /**
     * The headers of the response
     */
    headers: any;
    /**
     * Error response from the server. This property usually exists when a promise returned by a request method rejects.
     */
    error?: string;
}

/**
 * @name HTTP2
 * @description
 * Cordova / Phonegap plugin for communicating with HTTP servers. Supports iOS and Android.
 *
 * Advantages over Javascript requests:
 * - Background threading - all requests are done in a background thread
 * - SSL Pinning
 *
 * @usage
 * ```typescript
 * import { HTTP2 } from 'ionic-native-http-connection-backend';
 *
 * constructor(private http: HTTP2) { }
 *
 * ...
 *
 * this.http.get('http://ionic.io', {}, {})
 *   .then(data => {
 *
 *     console.log(data.status);
 *     console.log(data.data); // data received by server
 *     console.log(data.headers);
 *
 *   })
 *   .catch(error => {
 *
 *     console.log(error.status);
 *     console.log(error.error); // error message as string
 *     console.log(error.headers);
 *
 *   });
 *
 * ```
 * @interfaces
 * HTTPResponse
 */
@Plugin({
    pluginName: 'HTTP2',
    plugin: 'cordova-plugin-http2',
    pluginRef: 'cordovaHTTP2',
    repo: 'https://github.com/sneas/cordova-HTTP2',
    platforms: ['Android', 'iOS']
})
@Injectable()
export class HTTP2 extends IonicNativePlugin {
    /* tslint:disable */
    /**
     * This returns an object representing a basic HTTP Authorization header of the form.
     * @param username {string} Username
     * @param password {string} Password
     * @returns {Object} an object representing a basic HTTP Authorization header of the form {'Authorization': 'Basic base64encodedusernameandpassword'}
     */
    @Cordova({ sync: true })
    getBasicAuthHeader(username: string, password: string): { Authorization: string; } { return; }

    /**
     * This sets up all future requests to use Basic HTTP authentication with the given username and password.
     * @param username {string} Username
     * @param password {string} Password
     */
    @Cordova({ sync: true })
    useBasicAuth(username: string, password: string): void { }

    /**
     * Set a header for all future requests. Takes a header and a value.
     * @param header {string} The name of the header
     * @param value {string} The value of the header
     */
    @Cordova({ sync: true })
    setHeader(header: string, value: string): void { }

    /**
     * Enable or disable SSL Pinning. This defaults to false.
     *
     * To use SSL pinning you must include at least one .cer SSL certificate in your app project. You can pin to your server certificate or to one of the issuing CA certificates. For ios include your certificate in the root level of your bundle (just add the .cer file to your project/target at the root level). For android include your certificate in your project's platforms/android/assets folder. In both cases all .cer files found will be loaded automatically. If you only have a .pem certificate see this stackoverflow answer. You want to convert it to a DER encoded certificate with a .cer extension.
     *
     * As an alternative, you can store your .cer files in the www/certificates folder.
     * @param enable {boolean} Set to true to enable
     * @returns {Promise<void>} returns a promise that will resolve on success, and reject on failure
     */
    @Cordova()
    enableSSLPinning(enable: boolean): Promise<void> { return; }

    /**
     * Accept all SSL certificates. Or disabled accepting all certificates. Defaults to false.
     * @param accept {boolean} Set to true to accept
     * @returns {Promise<void>} returns a promise that will resolve on success, and reject on failure
     */
    @Cordova()
    acceptAllCerts(accept: boolean): Promise<void> { return; }

    /**
     * Whether or not to validate the domain name in the certificate. This defaults to true.
     * @param validate {boolean} Set to true to validate
     * @returns {Promise<void>} returns a promise that will resolve on success, and reject on failure
     */
    @Cordova()
    validateDomainName(validate: boolean): Promise<void> { return; }

    /**
     * Make a POST request
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    post(url: string, body: any, headers: any): Promise<HTTPResponse> { return; }

    /**
     * Make a POST request with JSON payload
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    postJson(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    /**
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    put(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    /**
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    delete(_url: string, _body: any, _headers: any): Promise<HTTPResponse> { return; }

    /**
     *
     * @param url {string} The url to send the request to
     * @param parameters {Object} Parameters to send with the request
     * @param headers {Object} The headers to set for this request
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    get(url: string, parameters: any, headers: any): Promise<HTTPResponse> { return; }

    /**
     *
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @param filePath {string} The local path of the file to upload
     * @param name {string} The name of the parameter to pass the file along as
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    uploadFile(url: string, body: any, headers: any, filePath: string, name: string): Promise<HTTPResponse> { return; }

    /**
     *
     * @param url {string} The url to send the request to
     * @param body {Object} The body of the request
     * @param headers {Object} The headers to set for this request
     * @param filePath {string} The path to donwload the file to, including the file name.
     * @returns {Promise<HTTPResponse>} returns a promise that resolve on success, and reject on failure
     */
    @Cordova()
    downloadFile(url: string, body: any, headers: any, filePath: string): Promise<HTTPResponse> { return; }
    /* tslint:enable */
}
