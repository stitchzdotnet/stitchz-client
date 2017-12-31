/*************************************************************************
Stitchz Site: http://www.stitchz.net/Products/Login
Created: 26-Nov-2013
Author: Ethan Peteson
License: Apache 2.0 Licensed

Updated: 28-Dec-2017

Copyright 2014 Stitchz.net

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*************************************************************************/

var StitchzClient = (function () {

	// public variables
    let pub = {};

    // client specific variables; should be set at runtime by client
    pub.ApiKey = '';
    pub.ReturnUrl = '';
    pub.Height = '280';
    pub.Width = '330';
    pub.MaxHeight = '768';
    pub.MaxWidth = '480';
    pub.AutoResize = true;
    pub.AppURL = '';
    pub.HtmlElementIdNameToAddIframeTo = 'stitchzsociallogin';
    pub.Version = 1;

    // standard variables
    let IsMobileBrowser = false;
    let IsTabletBrowser = false;

    // private variables
    let iframeIdName = 'stitchzframe';
    let iframe;
    let numberOfTiles = 0;

    pub.addEventHandler = (elem, eventType, handler) => {
        if (elem && eventType && handler) {
            let events = [];
            events = eventType.split(' ');
            for (let i = 0; i < events.length; i++) {
                if (elem.addEventListener) {
                    elem.addEventListener(events[i], handler, false);
                } else if (elem.attachEvent) {
                    elem.attachEvent('on' + events[i], handler);
                }
            }
        }
    };

    pub.ready = (func) => {
        //let me = this;

        pub.addEventHandler(window, 'load', func);

        return this;
    };

    pub.onMessageReceived = (func) => {
        //let me = this;

        pub.addEventHandler(window, 'message', func);

        return this;
    };

    pub.ResizeFrame = (data) => {
        //let me = this;

        if (this.AutoResize) {
            let width, currentWidth, maximumWidth;
            let height, maximumHeight;
            
            iframe = document.getElementById(iframeIdName);

            if (iframe !== null) {
                IsMobileBrowser = (data.IsMobileBrowser ? data.IsMobileBrowser : false);
                IsTabletBrowser = (data.IsTabletBrowser ? data.IsTabletBrowser : false);
                numberOfTiles = (data.numberOfTiles ? parseInt(data.numberOfTiles) : 0);

                if (numberOfTiles > 0) {

                    currentWidth = ((window.innerWidth > 0) ? window.innerWidth : screen.width);

                    maximumWidth = (currentWidth > this.MaxWidth ? this.MaxWidth : currentWidth);
                    maximumHeight = this.MaxHeight;

                    width = this.MaxWidth;
                    
                    // constrain the width within the client specified width or screen width
                    if (width > maximumWidth) {
                        width = maximumWidth;
                    }
                    
                    let cellWidth = (width >= 768 ? data.scale[768] : width >= 640 ? data.scale[640] : width >= 480 ? data.scale[480] : width >= 320 ? data.scale[320] : data.scale[320]);
                    let d = (width < 768 ? 3 : 5);
                    let h = (Math.ceil(numberOfTiles / d) * cellWidth) + 40;
                    height = (width >= 768 ? h : width >= 640 ? h : width >= 480 ? h : width >= 320 ? h : 768);
                    
                    if (height > maximumHeight) {
                        height = maximumHeight;
                    }

                    if (!isNaN(height) && height !== this.Height) {
                        // Height has changed, update the iframe
                        iframe.style.height = height + 'px';
                    }
                    
                    if (!isNaN(width) && width !== this.Width) {
                        // Width has changed, update the iframe
                        iframe.style.width = width + 'px';
                    }
                }
            }
        }
    };

    pub.ResetFrameSize = () => {
        //let me = this;

        iframe = document.getElementById(iframeIdName);

        if (iframe !== null) {
            if (iframe.style.height !== this.Height) {
                iframe.style.height = this.Height + 'px';
            }

            if (iframe.style.width !== this.Width) {
                iframe.style.width = this.Width + 'px';
            }
        }
    };

    pub.AddIframeToDOM = (settings) => {
        //let me = this;

        this.ApiKey = settings.ApiKey;
        this.ReturnUrl = settings.ReturnUrl;
        this.AppURL = settings.AppURL;
        this.Height = (settings.Height ? settings.Height : this.Height);
        this.Width = (settings.Width ? settings.Width : this.Width);
        this.MaxHeight = (settings.MaxHeight ? settings.MaxHeight : this.MaxHeight);
        this.MaxWidth = (settings.MaxWidth ? settings.MaxWidth : this.MaxWidth);
        this.AutoResize = (settings.AutoResize ? settings.AutoResize : this.AutoResize);
        this.HtmlElementIdNameToAddIframeTo = settings.HtmlElementIdNameToAddIframeTo;
        this.Version = parseInt(settings.Version ? settings.Version : this.Version);

		if (typeof(window) !== 'undefined') {
			if (window.console) {
				this._console;
			}
		} else if (typeof(console) !== 'undefined') {
			this._console = console;
		}

        // check if the version value is a Number
        if (isNaN(parseFloat(this.Version)) || isNaN(this.Version - 0) || this.Version === null || this.Version === '') {
            if (this._console) this._console.warn('The version provided must be a number, i.e. 1 or 2');
            this.Version = 1;
        }

        if (this.AppURL && this.ApiKey && this.ReturnUrl) {
            let elem = document.createElement("iframe");
            elem.src = this.AppURL + '/Authentication/v' + this.Version + '/Index?ApiKey=' + this.ApiKey + '&ReturnUrl=' + this.ReturnUrl + '#' + encodeURIComponent(document.location.href);
            elem.height = this.Height;
            elem.width = this.Width;
            elem.scrolling = 'no';
            elem.frameBorder = 'no';
            elem.id = iframeIdName;

            let frame = document.getElementById(this.HtmlElementIdNameToAddIframeTo);
            
            if (frame)
                frame.appendChild(elem);

            iframe = document.getElementById(iframeIdName);

            pub.onMessageReceived((e) => {
                if (e.origin !== this.AppURL) { return; }
                let data = e.data;
                switch (data.cmd) {
                    case 'resize':
						pub.ResizeFrame(data);
                        break;
                    case 'reset':
					pub.ResetFrameSize();
                        break;
                    case 'heartbeat':
                        iframe.contentWindow.postMessage({
                            'cmd': 'heartbeat'
                        },
                        e.origin);
                        break;
                    default:
                        break;
                }
            });
        }
    };

    return pub;
}());

module.exports = StitchzClient;