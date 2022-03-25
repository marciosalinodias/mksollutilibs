'use strict';

class mcmFBIntegrator { 
    #props = {
        poweredBy: 'MCM A TEC',
        fb: {
            BaseUrl: 'https://graph.facebook.com/v12.0/{PixelId}/events',
            PixelId: '',
            ApiToken: '',
            TestEventCode: null,
        }
    };
    
    constructor (PixelId, ApiToken, TestEventCode = null) {
        this.#props.fb.PixelId = PixelId;
        this.#props.fb.ApiToken = ApiToken;
        this.#props.fb.TestEventCode = TestEventCode;
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
            "event_id": Date.now(),
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
    pageView = function (data = null) {
        let returnVal = this.#mcmPost('PageView', data);
        console.log(returnVal);
        return returnVal;
    };
    
    viewContent = function (data = null) {
        let returnVal = this.#mcmPost('ViewContent', data);
        console.log(returnVal);
        return returnVal;
    };

    viewCategory = function (data = null) {
        let returnVal = this.#mcmPost('ViewCategory', data);
        console.log(returnVal);
        return returnVal;
    };

    search = function (data = null) {
        let returnVal = this.#mcmPost('Search', data);
        console.log(returnVal);
        return returnVal;
    };

    addPayment = function (data = null) {
        let returnVal = this.#mcmPost('AddPaymentInfo', data);
        console.log(returnVal);
        return returnVal;
    };
    
    completeRegister = function (data = null) {
        let returnVal = this.#mcmPost('CompleteRegistration', data);
        console.log(returnVal);
        return returnVal;
    };
    
    addToCart = function (data = null) {
        let returnVal = this.#mcmPost('AddToCart', data);
        console.log(returnVal);
        return returnVal;
    };

    initiateCheckout = function (data = null) {
        let returnVal = this.#mcmPost('InitiateCheckout', data);
        console.log(returnVal);
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
        console.log(returnVal);
        return returnVal;
    };
};