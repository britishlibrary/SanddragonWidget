<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="SanddragonWidget.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- /*
* Copyright (c) 2012, The British Library Board
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of The British Library nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/ -->
<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title></title>
<link href="css/screen.css" media="screen" rel="stylesheet" type="text/css" />   
<link rel="stylesheet" type="text/css" media="print" href="css/SanddragonWidget.print.css" />
<link href="css/SanddragonWidget.css" media="screen" rel="stylesheet" type="text/css" />   
<script type="text/javascript" src="JS/drag.js">
    /**************************************************
    * dom-drag.js
    * 09.25.2001
    * www.youngpup.net
    * Script featured on Dynamic Drive (http://www.dynamicdrive.com) 12.08.2005
    * License terms found here - http://www.dynamicdrive.com/notice.htm
    **************************************************/
</script>
<script type="text/javascript" src="JS/fade.js"></script>
<script type="text/javascript" src="JS/spin.js"></script>
<script type="text/javascript" src="JS/SanddragonWidget.js"></script>
<script type="text/javascript" src="JS/OpenSeadragon.debug.js"></script>
        
        <script type="text/javascript">
            var ImageServer = "";
            var SanddragonWidgetServer = "";
            var screenWidth = 0;
            var screenHeight = 0;

            function maximiseWindow() {
                top.window.moveTo(0, 0);
                top.window.resizeTo(screen.width, screen.height);

                if (document.all)
                { top.window.resizeTo(screen.availWidth, screen.availHeight); }
                else if (document.layers || document.getElementById) {
                    if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                        top.window.outerHeight = top.screen.availHeight;
                        top.window.outerWidth = top.screen.availWidth;
                    }
                }
            }

            function setScreenSize() {
                var verticalMargin = 3;
                var horizontalMargin = 5; // 30;

                if (typeof (window.innerWidth) == 'number') {
                    //Non-IE
                    screenWidth = window.innerWidth - horizontalMargin;
                    screenHeight = window.innerHeight - verticalMargin;
                } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                    //IE 6+ in 'standards compliant mode'
                    screenWidth = document.documentElement.clientWidth - horizontalMargin;
                    screenHeight = document.documentElement.clientHeight - verticalMargin;
                } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                    //IE 4 compatible
                    screenWidth = document.body.clientWidth - horizontalMargin;
                    screenHeight = document.body.clientHeight - verticalMargin;
                }
            }

            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (elt) {
                    var len = this.length;

                    var from = Number(arguments[1]) || 0;
                    from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                    if (from < 0)
                        from += len;

                    for (; from < len; from++) {
                        if (from in this &&
                            this[from] === elt)
                            return from;
                    }
                    return -1;
                };
            }

            var Item = null;
            var view1 = null;
            var view2 = null;
            var page1 = null;
            var page2 = null;
            var rotate1 = null;
            var rotate2 = null;

            var NumViews = 1;
            var AsBook = true;

            this.init = function () {
                ImageServer = document.getElementById("ImageServer").value;
                SanddragonWidgetServer = document.getElementById("SanddragonWidgetServer").value;
                setScreenSize();

                document.getElementById("view1").style.width = document.getElementById("view2").style.width = screenWidth + "px";
                document.getElementById("view1").style.height = document.getElementById("view2").style.height = screenHeight + "px";

                page1 = document.getElementById("Page1").value;
                page2 = document.getElementById("Page2").value;

                rotate1 = document.getElementById("Rotate1").value;
                rotate2 = document.getElementById("Rotate2").value;

                NumViews = parseInt(document.getElementById("NumViews").value);

                view1 = new SanddragonWidget("view1", document.getElementById("Region1").value, document.getElementById("ParentView").value, document.getElementById("Landscape").value);
                view1.init("left", NumViews);

                if (document.getElementById("Maximise").value == "true") {
                    maximiseWindow();
                }
                else {
                    view2 = new SanddragonWidget("view2", document.getElementById("Region2").value, document.getElementById("ParentView").value);
                    view2.init("right", NumViews);
                }
                setViews(parseInt(document.getElementById("Width1").value), parseInt(document.getElementById("Height1").value), parseInt(document.getElementById("JP2Levels1").value), document.getElementById("Rotate1").value,
                        parseInt(document.getElementById("Width2").value), parseInt(document.getElementById("Height2").value), parseInt(document.getElementById("JP2Levels2").value), document.getElementById("Rotate2").value);
            }

            function setViews(width1, height1, jp2levels1, rotate1, width2, height2, jp2levels2, rotate2) {
                if (NumViews == 2) {
                    document.getElementById("view1").style.width = document.getElementById("view2").style.width = screenWidth / 2 - 4 + "px";
                }
                else {
                    document.getElementById("view1").style.width = document.getElementById("view2").style.width = screenWidth + "px";
                    document.getElementById("view2").style.display = "none";
                }


                if (page1 == "") {
                    view1.updateImage(null);
                }
                else {
                    view1.updateImage(page1,
                        rotate1,
                        width1,
                        height1,
                        jp2levels1);
                }

                if (NumViews == 2) {
                    document.getElementById("view2").style.display = "block";
                    if (page2 == "") {
                        view2.updateImage(null);
                    }
                    else {
                        view2.updateImage(page2,
                        rotate2,
                        width2,
                        height2,
                        jp2levels2);
                    }
                }
            }

            //window.onload = init; 
            Seadragon.Utils.addEvent(window, "load", init);
        </script>    
        <style type="text/css">
            #pages
            {
                clear:both;
                position:relative;
            }
            #view1
            {
                float:left;
                width: 100px;
                height: 100px;
                background-color: black;
                border: 1px solid black;
                color: white;   /* for error messages, etc. */
            }
            #view2
            {
                float:left;
                margin-left:5px;
                width: 100px;
                height: 100px;
                background-color: black;
                border: 1px solid black;
                color: white;   /* for error messages, etc. */
                display:none;
            }            
            #download1
            {
                float:left;
            }
            #download2
            {
                display:none;
                float:left;
            }
        </style>    
</head>
<body class="document">
    <form id="form1" runat="server">
        <asp:HiddenField ID="ImageServer" runat="server" />
        <asp:HiddenField ID="SanddragonWidgetServer" runat="server" />
        <asp:HiddenField ID="NumViews" runat="server" />
        <asp:HiddenField ID="ShowMetadata" runat="server" />
        <asp:HiddenField ID="OrderViewType" runat="server" value="p" />  
        <asp:HiddenField ID="Maximise" runat="server" value="false" />  
        <asp:HiddenField ID="Landscape" runat="server" value="" />  
        <asp:HiddenField ID="Region1" runat="server" value="" />  
        <asp:HiddenField ID="Region2" runat="server" value="" />  
        <asp:HiddenField ID="ContentHeight" runat="server" value="" />  
        <asp:HiddenField ID="AspectRatio" runat="server" value="" />  
        <asp:HiddenField ID="ParentView" runat="server" value="" />  
        <asp:HiddenField ID="ImageSwitch" runat="server" value="" />  
        <asp:HiddenField ID="Page1" runat="server" value="" />  
        <asp:HiddenField ID="Page2" runat="server" value="" />  
        <asp:HiddenField ID="Rotate1" runat="server" value="" />  
        <asp:HiddenField ID="Rotate2" runat="server" value="" />  
        <asp:HiddenField ID="Width1" runat="server" value="" />  
        <asp:HiddenField ID="Height1" runat="server" value="" />  
        <asp:HiddenField ID="JP2Levels1" runat="server" value="" />  
        <asp:HiddenField ID="Width2" runat="server" value="" />  
        <asp:HiddenField ID="Height2" runat="server" value="" />  
        <asp:HiddenField ID="JP2Levels2" runat="server" value="" />  
    <div id="pages">
        <div class="bl-viewer" id="view1">
        </div>
        <div class="bl-viewer" id="view2">
        </div>
    </div>
    </form>
</body>
</html>
