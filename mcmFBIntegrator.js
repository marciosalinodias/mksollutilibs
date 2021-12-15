
var mcmFBIntegrator = (function (PixelId, ApiToken, TestEventCode = null) {
    'use strict';

    let props = {
        poweredBy: 'MCM A TEC',
        fb: {
            BaseUrl: 'https://graph.facebook.com/v12.0/{PixelId}/events',
            PixelId: PixelId,
            ApiToken: ApiToken,
            TestEventCode: TestEventCode,
        }
    };
    let methods = {};

    let privMethods = {
        mcmGetUrl: function () {
            return props.fb.BaseUrl.replace('{PixelId}', props.fb.PixelId).concat('?access_token=', props.fb.ApiToken);
        },
        mcmGetIp: async function () {
            return (await fetch("https://api.ipify.org/?format=json").then(r => r.json())).ip;
        },
        mcmPost: async function (eventname, data = null) {

            let sendData = createSimpleEventObject(eventname);
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
        },
        createSimpleEventObject: function (eventName) {
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

            if (window.mcmFBIntegrator.fb.TestEventCode.length > 0) {
                simpleEvent["test_event_code"] = window.mcmFBIntegrator.fb.TestEventCode;
            }

            return simpleEvent;
        }
    }

    //
    // Methods
    //

    methods.viewContent = function (data = null) {
        privMethods.mcmPost('ViewContent', data);
    };

    methods.PageView = function (data = null) {
        privMethods.mcmPost('PageView', data);
    };

    // Expose the public methods
    return methods;

})();