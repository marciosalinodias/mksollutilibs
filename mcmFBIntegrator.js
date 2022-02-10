'use strict';

class mcmFBIntegrator { 
    #props = {
        poweredBy: 'MCM A TEC',
        fb: {
            BaseUrl: 'https://graph.facebook.com/v12.0/{PixelId}/events',
            PixelId: '',
            ApiToken: '',
            TestEventCode: null,
            FbPixelToo: false
        },
        ShowConsole: false
    };
    
    constructor (PixelId, ApiToken, TestEventCode = null, FbPixelToo = false, ShowConsole = false) {
        this.#props.fb.PixelId = PixelId;
        this.#props.fb.ApiToken = ApiToken;
        this.#props.fb.TestEventCode = TestEventCode;
        this.#props.fb.FbPixelToo = FbPixelToo;
        this.#props.ShowConsole = ShowConsole;
    }

    #mcmGetUrl = function () {
        return this.#props.fb.BaseUrl.replace('{PixelId}', this.#props.fb.PixelId).concat('?access_token=', this.#props.fb.ApiToken);
    };
    #mcmGetIp = async function () {
        return (await fetch("https://api.ipify.org/?format=json").then(r => r.json())).ip;
    };
    #mcmPost = async function (eventname, data = null) {
        let sendData = await this.#createSimpleEventObject(eventname, data);
        const response = await fetch(this.#mcmGetUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        return response.json();
    };

    #createSimpleEventObject = async function (eventName, data = null) {
        let clientIp = await this.#mcmGetIp();

        let simpleEvent = {
            "event_id": 'fbapi_' + Date.now(),
            "event_name": eventName,
            "event_time": Math.floor(Date.now() / 1000),
            "event_source_url": "https://www.vimoveisdecor.com.br",
            "user_data": {
                "client_ip_address": clientIp,
                "client_user_agent": window.navigator.userAgent
            }
        };

        if(data != null){
            simpleEvent = {...simpleEvent, ...data};
        }

        let dataEvent = {
            "data": [
                simpleEvent
            ]
        };

        if (this.#props.fb.TestEventCode != null){
            if(this.#props.fb.TestEventCode.length > 0) {
                dataEvent["test_event_code"] = this.#props.fb.TestEventCode;
            }
        }

        return dataEvent;
    }

    //
    // Methods
    //
    pageView = async function (data = null) {
        let returnVal = await this.#mcmPost('PageView', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP PageView');
            }
            fbq('track', 'PageView', {}, {eventID: 'fbp_' + Date.now()});
        }
        if(this.#props.ShowConsole){
            console.log('PageView', data, returnVal);
        }
        return returnVal;
    };
    
    viewContent = async function (data = null) {
        let returnVal = await this.#mcmPost('ViewContent', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP ViewContent');
            }
            fbq('track', 'ViewContent', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('ViewContent', data, returnVal);
        }
        return returnVal;
    };
    
    completeRegistration = async function (data = null) {
        let returnVal = await this.#mcmPost('CompleteRegistration', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP CompleteRegistration');
            }
            fbq('track', 'CompleteRegistration', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('CompleteRegistration', data, returnVal);
        }
        return returnVal;
    };

    addPaymentInfo = async function (data = null) {
        let returnVal = await this.#mcmPost('AddPaymentInfo', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP AddPaymentInfo');
            }
            fbq('track', 'AddPaymentInfo', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('AddPaymentInfo', data, returnVal);
        }
        return returnVal;
    };

    search = async function (data = null) {
        let returnVal = await this.#mcmPost('Search', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP Search');
            }
            fbq('track', 'Search', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('Search', data, returnVal);
        }
        return returnVal;
    };
    
    addToCart = async function (data = null) {
        let returnVal = await this.#mcmPost('AddToCart', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP AddToCart');
            }
            fbq('track', 'AddToCart', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('AddToCart', data, returnVal);
        }
        return returnVal;
    };

    initiateCheckout = function (data = null) {
        let returnVal = this.#mcmPost('InitiateCheckout', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP InitiateCheckout');
            }
            fbq('track', 'InitiateCheckout', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('InitiateCheckout', data, returnVal);
        }
        return returnVal;
    };

    purchase = function (value, data = null) {

        if(data == null){
            data = {
                "custom_data": {
                    "currency": "BRL",
                    "value": value
                }
            }
        }

        let returnVal = this.#mcmPost('Purchase', data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP Purchase');
            }
            fbq('track', 'Purchase', {}, {eventID: 'fbp_' + Date.now()} );
        }
        if(this.#props.ShowConsole){
            console.log('Purchase', data, returnVal);
        }
        return returnVal;
    };
};