'use strict';

class mkFBIntegrator { 
    #props = {
        poweredBy: 'MK Sollution',
        fb: {
            BaseUrl: 'https://graph.facebook.com/v14.0/{PixelId}/events',
            PixelId: '',
            ApiToken: '',
            TestEventCode: null,
            FbPixelToo: false
        },
        idPrefix: 'mkfb_',
        ShowConsole: false
    };
    
    constructor (PixelId, ApiToken, TestEventCode = null, FbPixelToo = false, ShowConsole = false) {
        this.#props.fb.PixelId = PixelId;
        this.#props.fb.ApiToken = ApiToken;
        this.#props.fb.TestEventCode = TestEventCode;
        this.#props.fb.FbPixelToo = FbPixelToo;
        this.#props.ShowConsole = ShowConsole;
    }

    #mkGetUrl = function () {
        return this.#props.fb.BaseUrl.replace('{PixelId}', this.#props.fb.PixelId).concat('?access_token=', this.#props.fb.ApiToken);
    };
    #mkGetIp = async function () {
        return (await fetch("https://api.ipify.org/?format=json").then(r => r.json())).ip;
    };
    #mkPost = async function (eventname, id, data = null) {
        let sendData = await this.#createSimpleEventObject(eventname, id, data);
        const response = await fetch(this.#mkGetUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        return response.json();
    };

    #createSimpleEventObject = async function (eventName, id, data = null) {
        let clientIp = '0.0.0.0';
        try{
            clientIp = await this.#mkGetIp();
        }catch(ex){
            //ignore
        }
        
        let simpleEvent = {
            "event_id": id, //'fbapi_' + Date.now(),
            "event_name": eventName,
            "event_time": Math.floor(Date.now() / 1000),
            "event_source_url": window.location.origin,
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
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost('PageView', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP PageView');
            }
            fbq('track', 'PageView', data, {eventID: eventId});
        }
        if(this.#props.ShowConsole){
            console.log('PageView', data, returnVal);
        }
        return returnVal;
    };
    
    viewContent = async function (data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost('ViewContent', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP ViewContent');
            }
            fbq('track', 'ViewContent', data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log('ViewContent', data, returnVal);
        }
        return returnVal;
    };
    
    completeRegistration = async function (data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost('CompleteRegistration', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP CompleteRegistration');
            }
            fbq('track', 'CompleteRegistration', data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log('CompleteRegistration', data, returnVal);
        }
        return returnVal;
    };

    addPaymentInfo = async function (data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost('AddPaymentInfo', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP AddPaymentInfo');
            }
            fbq('track', 'AddPaymentInfo', data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log('AddPaymentInfo', data, returnVal);
        }
        return returnVal;
    };

    search = async function (data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost('Search', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP Search');
            }
            fbq('track', 'Search', data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log('Search', data, returnVal);
        }
        return returnVal;
    };
    
    addToCart = async function (data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost('AddToCart', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP AddToCart');
            }
            fbq('track', 'AddToCart', data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log('AddToCart', data, returnVal);
        }
        return returnVal;
    };

    initiateCheckout = function (data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = this.#mkPost('InitiateCheckout', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP InitiateCheckout');
            }
            fbq('track', 'InitiateCheckout', data, {eventID: eventId} );
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

        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = this.#mkPost('Purchase', eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP Purchase');
            }
            fbq('track', 'Purchase', data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log('Purchase', data, returnVal);
        }
        return returnVal;
    };

    callEvent = async function (event, data = null) {
        let eventId = this.#props.idPrefix + Date.now();
        let returnVal = await this.#mkPost(event, eventId, data);
        if(this.#props.fb.FbPixelToo && fbq){
            if(this.#props.ShowConsole){
                console.log('FBP '+ event);
            }
            fbq('track', event, data, {eventID: eventId} );
        }
        if(this.#props.ShowConsole){
            console.log(event, data, returnVal);
        }
        return returnVal;
    };
};