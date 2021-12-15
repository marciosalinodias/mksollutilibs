'use strict';

class mcmFBIntegrator { 
    #props = {
        poweredBy: 'MCM A TEC',
        fb: {
            BaseUrl: 'https://graph.facebook.com/v12.0/{PixelId}/events',
            PixelId: '',
            ApiToken: 'ApiToken',
            TestEventCode: null,
        }
    };
    
    constructor (PixelId, ApiToken, TestEventCode = null) {
        this.#props.PixelId = PixelId;
        this.#props.ApiToken = ApiToken;
        this.#props.TestEventCode = TestEventCode;
    }

    #mcmGetUrl = function () {
        return props.fb.BaseUrl.replace('{PixelId}', props.fb.PixelId).concat('?access_token=', props.fb.ApiToken);
    };
    #mcmGetIp = async function () {
        return (await fetch("https://api.ipify.org/?format=json").then(r => r.json())).ip;
    };
    #mcmPost = async function (eventname, data = null) {

        let sendData = this.#createSimpleEventObject(eventname);
        if (data != null) {
            sendData = { ...sendData, data };
        }

        const response = await fetch(privMethods.mcmGetUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        });
        return response.json();
    };

    #createSimpleEventObject = function (eventName) {
        var simpleEvent = {
            "data": [
                {
                    "event_name": eventName,
                    "event_time": Date.now(),
                    "event_source_url": window.location.origin,
                    "user_data": {
                        "client_ip_address": privMethods.mcmGetIp(),
                        "client_user_agent": window.navigator.userAgent
                    }
                }
            ]
        };

        if (this.#props.TestEventCode.fb.TestEventCode.length > 0) {
            simpleEvent["test_event_code"] = this.#props.TestEventCode.fb.TestEventCode;
        }

        return simpleEvent;
    }

    //
    // Methods
    //

    viewContent = function (data = null) {
        this.#mcmPost('ViewContent', data);
    };

    pageView = function (data = null) {
        this.#mcmPost('PageView', data);
    };   
};