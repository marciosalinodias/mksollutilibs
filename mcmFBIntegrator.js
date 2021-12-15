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

        let sendData = this.#createSimpleEventObject(eventname);
        if (data != null) {
            sendData = { ...sendData, data };
        }

        const response = await fetch(this.#mcmGetUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        return response.json();
    };

    #createSimpleEventObject = async function (eventName) {
        let ip = (await fetch("https://api.ipify.org/?format=json").then(r => r.json())).ip;
        let simpleEvent = {
            "data": [
                {
                    "event_name": eventName,
                    "event_time": Date.now(),
                    "event_source_url": window.location.origin,
                    "user_data": {
                        "client_ip_address": ip,
                        "client_user_agent": window.navigator.userAgent
                    }
                }
            ]
        };

        if (this.#props.fb.TestEventCode != null){
            if(this.#props.fb.TestEventCode.length > 0) {
                simpleEvent["test_event_code"] = this.#props.fb.TestEventCode;
            }
        }

        return simpleEvent;
    }

    //
    // Methods
    //

    viewContent = function (data = null) {
        let returnVal = this.#mcmPost('ViewContent', data);
        console.log(returnVal);
        return returnVal;
    };

    pageView = function (data = null) {
        let returnVal = this.#mcmPost('PageView', data);
        console.log(returnVal);
        return returnVal;
    };   
};