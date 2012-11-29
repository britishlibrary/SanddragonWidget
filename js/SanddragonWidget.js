/*
* Copyright (c) 2012, The British Library Board
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of The British Library nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/ 

var SanddragonWidget = function (viewerName, region, parentView, setSourceIsLandscape) {
    var image = null;

    var viewer = null;
    var ZoomInButton = null;
    var ZoomOutButton = null;
    var GoHomeButton = null;
    var FullScreenButton = null;
    var RotateButton = null;
    var RotateValue = null;
    var ControlsHidden = false;
    var canBeClosed = false;
    var initialImageSet = false;
    var controlPosition = null;
    var metadata = null;
    var imageOpenedAdded = false;
    var rotate = 0;
    var hasFullScreenListener = false;

    this.init = function (controlPosition, numViews) {
        viewer = new Seadragon.Viewer(viewerName);

        viewer.config.showNavigationControl = false;
        viewer.set_autoHideControls(true);

        ZoomInButton = new Seadragon.Button(
                { config: null, tooltip: 'Zoom In', srcRest: "JS/images/zoomIn.png", srcGroup: "JS/images/zoomIn.png", srcHover: "JS/images/zoomIn_over.png", srcDown: "JS/images/zoomIn.png" },
                { onPress: null, onRelease: null, onClick: onZoomIn, onEnter: function () { showControls(); }, onExit: hideControls });
        ZoomInButton._button.setAttribute("class", "no-print view_control offsetTop");

        ZoomOutButton = new Seadragon.Button(
                { config: null, tooltip: "Zoom Out", srcRest: "JS/images/zoomOut.png", srcGroup: "JS/images/zoomOut.png", srcHover: "JS/images/zoomOut_over.png", srcDown: "JS/images/zoomOut.png" },
                { onPress: null, onRelease: null, onClick: onZoomOut, onEnter: function () { showControls(); }, onExit: hideControls });
        ZoomOutButton._button.setAttribute("class", "no-print view_control offsetTop");

        GoHomeButton = new Seadragon.Button(
                { config: null, tooltip: "Reset", srcRest: "JS/images/reset.png", srcGroup: "JS/images/reset.png", srcHover: "JS/images/reset_over.png", srcDown: "JS/images/reset.png" },
                { onPress: null, onRelease: null, onClick: this.onGoHome, onEnter: function () { showControls(); }, onExit: hideControls });
        GoHomeButton._button.setAttribute("class", "no-print view_control offsetTop");

        FullScreenButton = showFullButton();

        var RotateButtonContainer = this.showRotateButton();

        setupSpinner(numViews);

        this.controlPosition = controlPosition;
        var controlAnchor = Seadragon.ControlAnchor.TOP_LEFT;
        if (controlPosition == "right")
            controlAnchor = Seadragon.ControlAnchor.TOP_RIGHT;

        if (controlPosition == "right") {
            viewer.addControl(RotateButtonContainer, controlAnchor);
            viewer.addControl(FullScreenButton, controlAnchor);
            viewer.addControl(GoHomeButton._button, controlAnchor);
            viewer.addControl(ZoomOutButton._button, controlAnchor);
            viewer.addControl(ZoomInButton._button, controlAnchor);

            document.getElementById("view2").onmousemove = function (e) {
                if (Seadragon.Utils.getMousePosition(e).x > screenWidth - 50) {
                    if (ControlsHidden) {
                        ControlsHidden = false;
                        showControls();
                    }
                }
                else if (!ControlsHidden) {
                    ControlsHidden = true;
                    hideControls();
                }
            };
        }
        else {
            viewer.addControl(ZoomInButton._button, controlAnchor);
            viewer.addControl(ZoomOutButton._button, controlAnchor);
            viewer.addControl(GoHomeButton._button, controlAnchor);
            viewer.addControl(FullScreenButton, controlAnchor);
            viewer.addControl(RotateButtonContainer, controlAnchor);

            document.getElementById("view1").onmousemove = function (e) {
                if (Seadragon.Utils.getMousePosition(e).x < 50) {
                    if (ControlsHidden) {
                        ControlsHidden = false;
                        showControls();
                    }
                }
                else if (!ControlsHidden) {
                    ControlsHidden = true;
                    hideControls();
                }
            };
        }

        viewer.add_animationfinish(this.onAnimationFinish);

        if (document.getElementById("Maximise").value != "true") {
            viewer.add_animation(this.onAnimation);

            setupOverview(controlPosition);
        }
    }

    function showControls() {
        if (!viewer.isOpen()) {
            return;
        }

        viewer._abortControlsAutoHide();
    }

    function hideControls() {
        if (!viewer.isOpen()) {
            return;
        }

        viewer._beginControlsAutoHide();
    }

    var fullScreenOpen = null;

    this.updateImage = function (image, rotate, width, height, jp2levels, afterRotate) {
        if (overview)
            overview.style.visibility = "hidden";
        if (image == null) {
            viewer.setVisible(false);
            hideSpinner();
        }
        else {
            if (!afterRotate) {
                imageBounds = null;
                viewAspect = 0;
                sourceIsLandscape = null;
                prevRotate = 0;
            }

            this.setRotateValue(rotate);

            viewer.setVisible(true);
            this.image = image;
            prevRotate = this.rotate = Number(rotate);
            this.viewer = viewer;

            var viewid = "1";

            if (document.getElementById("width" + viewid) != 0) {
                if (viewerName == "view2") {
                    viewid = "2";
                }

                if (!isNaN(jp2levels) && jp2levels > 0) {
                    this.metadata = new Object();

                    this.metadata.width = width;
                    this.metadata.height = height;
                    this.metadata.jp2levels = jp2levels;
                }
            }
            else {
                this.metadata = null;
            }

            this.metadata = viewer.openDzi(this.image + '.jp2', rotate, this.metadata);
            if (document.getElementById("Maximise").value == "true") {
                if (!hasFullScreenListener) {
                    hasFullScreenListener = true;
                    viewer.add_open(onFullScreen);
                }
            }
            else {
                var imgUrl = ImageServer + image +
                        "/full/150,/" + rotate + "/native";
                overviewImg.setAttribute("src", imgUrl);
            }
            if (!imageOpenedAdded) {
                viewer.add_open(this.imageOpened);
            }
        }
    }

    this.imageOpened = function () {
        imageOpenedAdded = true;
        if (region && !initialImageSet) {
            initialImageSet = true;
            var regions = region.split(",");
            var contentHeight = document.getElementById('ContentHeight').value;
            var rect = new Seadragon.Rect(parseFloat(regions[0]),
                parseFloat(regions[1]),
                parseFloat(regions[2]),
                parseFloat(regions[3]));

            viewer.viewport.fitBounds(rect, true);
            viewer._updateOnce();
            viewer.viewport.applyConstraints(false);
        }

        //
        if (viewAspect == 0) {
            viewAspect = viewer.getAspectRatio();
        }

        imageAspect = viewer.getContentAspectRatio();

        if (sourceIsLandscape == null) {
            if (setSourceIsLandscape)
                sourceIsLandscape = setSourceIsLandscape === "true";
            else
                sourceIsLandscape = imageAspect > 1;
        }

        if (imageBounds != null) {
            viewer.viewport.fitBounds(imageBounds, true);
            viewer._updateOnce();
            viewer.zoomBy(1.0000000000001); // to make seadragon do a final update
        }
        //

        hideSpinner();

        if (document.getElementById("Maximise").value != "true")
            drawOverviewRectangleTimer();
    }

    function drawOverviewRectangleTimer() {
        setTimeout(viewerName + ".drawOverviewRectangleFromTimer()", 1000);
    }

    this.getViewParams = function () {
        var rect = viewer.getImageBounds();

        var proportion = viewer.getZoom();
        var aspect = viewer.getContentAspectRatio()

        rect.x = rect.x;
        rect.y = (rect.y * aspect);
        rect.height = (rect.height * aspect);

        if (rect.x < 0) {
            rect.width += rect.x;
            rect.x = 0;
        }
        if (rect.y < 0) {
            rect.height += rect.y;
            rect.y = 0;
        }

        var params = "id=" + this.image +
        "&width=" + this.metadata.width +
        "&height=" + this.metadata.height +
        "&proportion=" + proportion +
        "&rotate=" + (Number(RotateValue.innerHTML) - 90) +
        "&region=" + rect.x.toFixed(6) + "," + rect.y.toFixed(6) + "," +
        rect.width.toFixed(6) + "," + rect.height.toFixed(6);

        return params;
    }

    this.downloadFile = function () {
        var url = "DownloadFileHandler.ashx?" + this.getViewParams();

        window.open(url, "", "width=100,height=100,left=-100");
    }

    function onZoomIn(event) {
        if (!viewer.isOpen()) {
            return;
        }
        viewer.viewport.zoomBy(1.5);
        viewer.viewport.ensureVisible();

        Seadragon.Utils.cancelEvent(event); // don't process link
    }

    function onZoomOut(event) {
        if (!viewer.isOpen()) {
            return;
        }

        viewer.viewport.zoomBy(0.75);
        viewer.viewport.ensureVisible();

        Seadragon.Utils.cancelEvent(event); // don't process link
    }

    this.onGoHome = function (event) {
        if (!viewer.isOpen()) {
            return;
        }

        var view = view1;
        if (viewerName == "view2")
            view = view2;

        if (view.rotate != 0) {
            imageBounds = null;
            if (view.metadata)
                view.updateImage(view.image, 0, view.metadata.width, view.metadata.height, view.metadata.jp2levels);
            else
                view.updateImage(view.image, 0);
        }
        else {
            viewer.viewport.goHome();
            viewer.viewport.ensureVisible();
        }

        overview.style.left = "0px";
        overview.style.top = "0px";

        Seadragon.Utils.cancelEvent(event); // don't process link
    }

    function showFullButton() {
        var control = document.createElement("img");
        control.setAttribute("src", "JS/images/fullscreen.png");
        control.setAttribute("onmouseover", "showControls();FullOver(true);");
        control.setAttribute("onmouseout", "hideControls();FullOver(false);");
        control.setAttribute("title", "Full Screen");
        control.setAttribute("onclick", "onFullScreen();");
        control.setAttribute("class", "no-print view_controlImg offsetTop");

        control.onclick = function () { if (window.opener != null) window.opener.focus(); canBeClosed = true; onFullScreen(); }; // for IE
        control.onmouseover = function () { showControls(); FullOver(true); }; // for IE
        control.onmouseout = function () { hideControls(); FullOver(false); }; // for IE 

        return control;
    }

    this.showRotateButton = function () {
        var container = document.createElement("div");

        var control = document.createElement("img");
        control.setAttribute("src", "JS/images/rotate.png");
        control.setAttribute("onmouseover", "showControls();RotateOver(true);");
        control.setAttribute("onmouseout", "hideControls();RotateOver(false);");

        control.setAttribute("title", "Rotate 90 degrees");
        control.setAttribute("onclick", "onRotate();");
        control.setAttribute("class", "no-print view_controlImg offsetTop");

        RotateValue = document.createElement("div");
        RotateValue.style.position = "absolute";
        RotateValue.style.cursor = "default";
        RotateValue.style.color = "white";
        RotateValue.onclick = function () { onRotate(); }; // for IE

        this.setRotateValue(0);
        container.appendChild(RotateValue);

        control.onclick = function () { onRotate(); }; // for IE
        control.onmouseover = function () { showControls(); RotateOver(true); }; // for IE
        control.onmouseout = function () { hideControls(); RotateOver(false); }; // for IE 

        RotateButton = control;

        container.appendChild(control);
        return container;
    }

    this.setRotateValue = function (val) {
        RotateValue.style.left = "10px";
        RotateValue.style.top = "22px";
        RotateValue.innerHTML = (Number(val) + 90 > 360 ? 0 : Number(val) + 90);
    }

    this.setBounds = function (bounds, rotate) {
        // need to do this in order to keep it in scope
        imageBounds = new Seadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);

        this.updateImage(this.image, rotate, null, null, null, true);
    }

    var imageBounds = null;
    var viewAspect = 0;
    var sourceIsLandscape = null;
    var prevRotate = 0;
    var imageAspect = 0;

    function onRotate(event) {
        var view = null;
        if (viewerName == "view1")
            view = view1;
        else
            view = view2;

        view.rotate += 90;
        if (view.rotate > 270)
            view.rotate = 0;

        view.setRotateValue(view.rotate);

        var width = null;
        var height = null;
        var jp2levels = null;

        if (view.metadata != null) {
            width = view.metadata.width;
            height = view.metadata.height;
            jp2levels = view.metadata.jp2levels;
        }

        //
        var newRotate = view.rotate;
        var nextRotate = 0;
        var newAspect = sourceIsLandscape ? 1 : viewAspect;

        newImage = false;

        imageBounds = view.viewer.getImageBounds();

        var imageCenter = view.viewer.getCenter();

        if (prevRotate == 0) {
            prevRotate = nextRotate = newRotate;
        }
        else if (prevRotate == 90) {
            if (newRotate == 0) {
                nextRotate = 270;
                if (sourceIsLandscape)
                    imageBounds.width = imageBounds.height * imageAspect;
            }
            else if (newRotate == 270) {
                nextRotate = 180;
            }
            else if (newRotate == 180) {
                nextRotate = 90;
                if (sourceIsLandscape)
                    imageBounds.width = imageBounds.height * imageAspect;
            }
        }
        else if (prevRotate == 270) {
            if (newRotate == 0) {
                nextRotate = 90;
                if (sourceIsLandscape) {
                    imageBounds.width = imageBounds.height * imageAspect;
                }
            }
            else if (newRotate == 90) {
                nextRotate = 180;
            }
            else if (newRotate == 180) {
                nextRotate = 270;

                if (sourceIsLandscape)
                    imageBounds.width = imageBounds.height * imageAspect;
            }
        }
        else if (prevRotate == 180) {
            if (newRotate == 0) {
                nextRotate = 180;
                if (sourceIsLandscape)
                    imageBounds.width = imageBounds.width / imageAspect;
            }
            else if (newRotate == 90) {
                nextRotate = 270;
            }
            else if (newRotate == 270) {
                nextRotate = 90;
            }
        }

        prevRotate = newRotate;

        if (nextRotate == 90) {
            var oldX = imageCenter.x;
            imageCenter.x = 1 - imageCenter.y * imageAspect;
            imageCenter.y = oldX * imageAspect;

            if (sourceIsLandscape) {
                imageBounds.height = imageBounds.width;
                imageBounds.width = imageBounds.height * imageAspect;
            }
            else {
                imageBounds.height = imageBounds.width * imageAspect / newAspect;
                imageBounds.width = imageBounds.height / newAspect;

                if (viewAspect < 1) {
                    imageBounds.height *= viewAspect * newAspect;
                    imageBounds.width *= viewAspect * newAspect;
                }
            }
        }
        else if (nextRotate == 270) {
            var oldX = imageCenter.x;
            imageCenter.x = imageCenter.y * imageAspect;
            imageCenter.y = aspect - oldX * imageAspect;

            if (sourceIsLandscape) {
                imageBounds.height = imageBounds.width;
                imageBounds.width = imageBounds.height * imageAspect;
            }
            else {
                imageBounds.height = imageBounds.width * imageAspect / newAspect;
                imageBounds.width = imageBounds.height / newAspect;

                if (viewAspect < 1) {
                    imageBounds.height *= viewAspect * newAspect;
                    imageBounds.width *= viewAspect * newAspect;
                }
            }
        }
        else if (nextRotate == 180) {
            imageCenter.x = 1 - imageCenter.x;
            imageCenter.y = (1 - (imageCenter.y * imageAspect)) / imageAspect;
        }

        imageBounds.x = imageCenter.x - (imageBounds.width / 2);
        imageBounds.y = imageCenter.y - (imageBounds.height / 2);
        //

        view.updateImage(view.image, view.rotate, width, height, jp2levels, true);
    }

    function onFullScreen(event) {
        if (document.getElementById("Maximise").value == "true") {
            if (!viewer.isOpen()) {
                return;
            }

            viewer.setFullPage((!canBeClosed && hasFullScreenListener) || !viewer.isFullPage());

            if (viewer.isFullPage()) {
                FullScreenButton.setAttribute("src", "JS/images/original.png");
                FullScreenButton.setAttribute("title", "Standard View");
                FullScreenButton.setAttribute("onmouseover", "StandardOver(true)");
                FullScreenButton.setAttribute("onmouseout", "StandardOver(false)");
                FullScreenButton.onmouseover = function () { StandardOver(true); }; // for IE
                FullScreenButton.onmouseout = function () { hideControls(); StandardOver(false); }; // for IE
            }
            else {
                if (canBeClosed) {
                    var regions = region.split(",");
                    var bounds = viewer.getImageBounds();

                    if (parentView == "view1") {
                        window.opener.view1.imageBounds = bounds;
                        window.opener.view1.setBounds(bounds, view1.rotate);
                    }
                    else if (parentView == "view2") {
                        window.opener.view2.setBounds(bounds, view1.rotate);
                    }
                    window.close();
                }

                FullScreenButton.setAttribute("src", "JS/images/fullscreen.png");
                FullScreenButton.setAttribute("title", "Full Page");
                FullScreenButton.setAttribute("onmouseover", "FullOver(true)");
                FullScreenButton.setAttribute("onmouseout", "FullOver(false)");
                FullScreenButton.onmouseover = function () { FullOver(true); }; // for IE
                FullScreenButton.onmouseout = function () { hideControls(); FullOver(false); }; // for IE        
            }

            viewer.viewport.ensureVisible();

            Seadragon.Utils.cancelEvent(event); // don't process link 

        } else {
            var rect = viewer.getImageBounds();
            var view = viewerName == "view1" ? view1 : view2;
            var url = SanddragonWidgetServer + "?maximise=true&page1=" +
                viewer.source.tilesUrl.substr(0, viewer.source.tilesUrl.indexOf("_files")) +
                "&width1=" + document.getElementById("Width1").value +
                "&height1=" + document.getElementById("Height1").value +
                "&jp2levels1=" + document.getElementById("JP2Levels1").value +
                "&region1=" +
                rect.x.toFixed(6) + "," +
                rect.y.toFixed(6) + "," +
                rect.width.toFixed(6) + "," +
                rect.height.toFixed(6) +
                "&rotate1=" + view.rotate +
                "&contentHeight=" + viewer.viewport._contentHeight +
                "&aspectratio=" + viewer.viewport._contentAspect +
                "&parentview=" + viewerName +
                "&landscape=" + sourceIsLandscape +
                (document.getElementById("ImageSwitch").value ? "&imageswitch=y" : "");

            window.open(url, 'viewer', false);
        }
    }

    function FullOver(isOver) {
        if (isOver) {
            FullScreenButton.setAttribute("src", "JS/images/fullscreen_over.png");
        }
        else {
            FullScreenButton.setAttribute("src", "JS/images/fullscreen.png");
        }
    }

    function RotateOver(isOver) {
        if (isOver) {
            RotateButton.setAttribute("src", "JS/images/rotate_over.png");
        }
        else {
            RotateButton.setAttribute("src", "JS/images/rotate.png");
        }
    }

    function StandardOver(isOver) {
        if (isOver) {
            FullScreenButton.setAttribute("src", "JS/images/original_over.png");
        }
        else {
            FullScreenButton.setAttribute("src", "JS/images/original.png");
        }
    }

    // spinner function

    var opts = {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        color: '#fff', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false // Whether to use hardware acceleration
    };

    var spinner = null;

    function setupSpinner(numViews) {
        spinner = new Spinner(opts).spin();
        spinner.el.style.bottom = screenHeight / 2 + "px";
        spinner.el.style.left = screenWidth / numViews / 2 + "px";

        var target = document.getElementById(viewerName);
        target.appendChild(spinner.el);
    }

    function hideSpinner() {
        if (spinner != null)
            spinner.stop();
    }

    // overview functions 
    var overviewDiv = null;
    var overview = null;
    var overviewBar = null;
    var overviewRect = null;
    var overviewInnerRect = null;
    var overviewImg = null;
    var aspect = null;

    function setupOverview(controlPosition) {
        // setup the overview divs
        overviewDiv = document.createElement("div");
        overviewDiv.id = viewerName + "-bl_overviewContainer";
        overviewDiv.className = "bl_overviewContainer" + (controlPosition == "right" ? "_right" : "");

        disableSelect(overviewDiv);

        overview = document.createElement("div");
        overview.id = viewerName + "-bl_overview";
        overview.className = "bl_overview";
        overview.style.visibility = "hidden";

        overviewBar = document.createElement("div");
        overviewBar.id = viewerName + "-bl_overviewBar";
        overviewBar.className = "bl_overviewBar";

        var overviewInnerBar = document.createElement("div");
        overviewInnerBar.style.backgroundColor = "#eee";
        overviewInnerBar.style.width = "10";
        overviewInnerBar.style.height = "10";
        overviewBar.appendChild(overviewInnerBar);

        overviewRect = document.createElement("div");
        overviewRect.id = viewerName + "-bl_overviewRect";
        overviewRect.className = "bl_overviewRect";

        overviewInnerRect = document.createElement("div");
        overviewInnerRect.id = viewerName + "-bl_overviewInnerRect";
        overviewInnerRect.className = "bl_overviewInnerRect";

        disableSelect(overviewInnerRect);

        overviewRect.appendChild(overviewInnerRect);

        overviewImg = document.createElement("img");
        overviewImg.id = viewerName + "-bl_overviewImg";
        overviewImg.className = "bl_overviewImg";

        overview.appendChild(overviewBar);
        overview.appendChild(overviewRect);
        overview.appendChild(overviewImg);

        overviewDiv.appendChild(overview);

        document.getElementById(viewerName).appendChild(overviewDiv);

        overviewImg.onclick = jumpTo;

        Drag.init(overviewBar, overview);
        overview.onDrag = function (x, y) {
            overview.style.display = "block";
            overview.style.visibility = "visible";
            overview.style.opacity = 1.0;
            overview.style.filter = 'alpha(opacity=100)';
            isDragOverview = true;
        }
        overview.onDragEnd = function (x, y) {
            isDragOverview = false;
        }

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

        if (overviewRect.attachEvent) //if IE (and Opera depending on user setting)
            overviewRect.attachEvent("on" + mousewheelevt, zoomImage)
        else if (overviewRect.addEventListener) //WC3 browsers
            overviewRect.addEventListener(mousewheelevt, zoomImage, false)

        if (overviewImg.attachEvent) //if IE (and Opera depending on user setting)
            overviewImg.attachEvent("on" + mousewheelevt, zoomImage)
        else if (overviewImg.addEventListener) //WC3 browsers
            overviewImg.addEventListener(mousewheelevt, zoomImage, false)
    }

    function jumpTo(event) {
        var point = new Seadragon.Point();
        var aspect = viewer.getContentAspectRatio();

        if (!event) var event = window.event;

        point.x = (event.clientX - getX(overviewImg) - 3) / overviewImg.width;

        var scrollOffset = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

        point.y = ((event.clientY + scrollOffset - getY(overviewImg)) / overviewImg.height) / aspect;

        viewer.panTo(point, true);

        startFadeTimer();
    };

    function getX(oElement) {
        var iReturnValue = 0;
        while (oElement != null) {
            iReturnValue += oElement.offsetLeft;
            oElement = oElement.offsetParent;
        }
        return iReturnValue;
    }

    function getY(oElement) {
        var iReturnValue = 0;
        while (oElement != null) {
            iReturnValue += oElement.offsetTop;
            oElement = oElement.offsetParent;
        }
        return iReturnValue;
    }

    function getRectangle(w, h, x, y, bCol) {
        var rect = overviewRect;

        rect.style.position = "absolute";
        rect.style.width = w + "px";

        if (h > 4)
            rect.style.height = h + "px";
        else
            rect.style.height = "1px";

        rect.style.left = x + overviewImg.offsetLeft + "px";
        rect.style.top = y + overviewImg.offsetTop + "px";
        rect.style.borderColor = bCol;

        // fixed
        rect.style.borderStyle = "solid"
        rect.style.borderWidth = 2;
        rect.style.cursor = 'move';

        return rect
    }

    this.drawOverviewRectangleFromTimer = function () {
        drawOverviewRectangle();
    }

    function drawOverviewRectangle() {
        var imgBounds = viewer.getImageBounds();
        var aspect = viewer.getContentAspectRatio();
        var round = 1000000;

        x = Math.round(imgBounds.x * round) / round;
        y = Math.round(imgBounds.y * round) / round;
        w = Math.round(imgBounds.width * round) / round;
        h = Math.round(imgBounds.height * round) / round;

        if (overviewImg.width > 0 && aspect) {
            if (w > h || viewer.getAspectRatio() < 1) {
                w = w * overviewImg.width;
                y = y * overviewImg.height * aspect;
                x = x * overviewImg.width;
                h = h * overviewImg.height * aspect;
            }
            else {
                w = w * overviewImg.width * aspect;
                y = y * overviewImg.height;
                x = x * overviewImg.width * aspect;
                h = h * overviewImg.height;
            }

            overview.replaceChild(document.getElementById(viewerName + "-bl_overviewRect"), getRectangle(w, h, x, y, "red"));

            setTimeout(viewerName + ".setupDragBox(" + w + "," + h + ")", 800);
        }
    }

    var isDragOn = false;
    var isDragOverview = false;

    function getRectCenter() {
        var rect = document.getElementById(viewerName + "-bl_overviewRect");
        var style = rect.style;
        var center = new Seadragon.Point();
        var aspect = viewer.getContentAspectRatio();

        center.x = (parseInt(style.width.replace("px", "") / 2) + parseInt(style.left.replace("px", "")) - overviewImg.offsetLeft + 1);
        center.y = (parseInt(style.height.replace("px", "") / 2) + parseInt(style.top.replace("px", "")) - overviewImg.offsetTop + 3);

        // normalise co-ords to SeaDragon co-ords
        center.x = center.x / overviewImg.clientWidth;
        center.y = center.y / (overviewImg.clientHeight * aspect);
        return center;
    }

    this.setupDragBox = function (w, h) {
        var limit = 0.1;
        Drag.init(overviewRect, null,
                         -(overviewImg.clientWidth * limit),
                         overviewImg.clientWidth - w + (overviewImg.clientWidth * limit),
                         overviewBar.clientHeight - (overviewImg.clientHeight * limit),
                         overviewImg.clientHeight + overviewBar.clientHeight - h +
                         (overviewImg.clientHeight * limit));

        overviewRect.onDrag = function (x, y) {
            isDragOn = true;
            viewer.panTo(getRectCenter(), true);
        }
    }

    this.onAnimation = function () {
        if (!isDragOn) {
            drawOverviewRectangle();
        }
        overview.style.display = "block";
        overview.style.visibility = "visible";
        overview.style.opacity = 1.0;
        overview.style.filter = 'alpha(opacity=100)';
        overview.FadeState = 1;
    }

    this.onAnimationFinish = function () {
        isDragOn = false;

        viewer.viewport.applyConstraints(false);

        startFadeTimer();
    }

    var fadeTimer = null;

    function startFadeTimer() {
        if (document.getElementById("Maximise").value != "true")
            overview.FadeState = null;

        if (fadeTimer != null) {
            clearTimeout(fadeTimer);
        }

        fadeTimer = setTimeout(viewerName + ".fadeOverview()", 3000);
    }

    this.fadeOverview = function () {
        if (!isDragOn && !isDragOverview) {
            if (overview)
                fade(overview.id);

            hideControls();
        }
        isDragOn = false;
    }

    function zoomImage(e) {
        var evt = window.event || e //equalize event object
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //delta returns +120 when wheel is scrolled up, -120 when scrolled down
        isDragOn = false;

        if (delta > 0) {
            viewer.viewport.zoomBy(1.5);
            viewer.viewport.ensureVisible();
        }
        else {
            viewer.viewport.zoomBy(0.75);
            viewer.viewport.ensureVisible();
        }

        overviewImg.focus();

        if (evt.preventDefault) //disable default wheel action of scrolling page
            evt.preventDefault();
        else
            return false;
    }

    // prevent text selection
    function disableSelect(el) {
        if (el.addEventListener) {
            el.addEventListener("mousedown", disabler, "false");
        } else {
            el.attachEvent("onselectstart", disabler);
        }
    }

    function enableSelect(el) {
        if (el.addEventListener) {
            el.removeEventListener("mousedown", disabler, "false");
        } else {
            el.detachEvent("onselectstart", disabler);
        }
    }

    function disabler(e) {
        if (e.preventDefault) { e.preventDefault(); }
        return false;
    }
};