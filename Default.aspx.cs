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
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SanddragonWidget
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            ImageServer.Value = ConfigurationManager.AppSettings["ImageServer"];
            ImageMetadataServer.Value = ConfigurationManager.AppSettings["ImageMetadataServer"];
            SanddragonWidgetServer.Value = ConfigurationManager.AppSettings["SanddragonWidgetServer"];
            Page1.Value = string.IsNullOrEmpty(Request["page1"]) ? ConfigurationManager.AppSettings["View1"] : Request["page1"];
            Page2.Value = string.IsNullOrEmpty(Request["page2"]) ? ConfigurationManager.AppSettings["View2"] : Request["page2"];
            Width1.Value = string.IsNullOrEmpty(Request["width1"]) ? "" : Request["width1"];
            Width2.Value = string.IsNullOrEmpty(Request["width2"]) ? "" : Request["width2"];
            Height1.Value = string.IsNullOrEmpty(Request["height1"]) ? "" : Request["height1"];
            Height2.Value = string.IsNullOrEmpty(Request["height2"]) ? "" : Request["height2"];
            JP2Levels1.Value = string.IsNullOrEmpty(Request["jp2Levels1"]) ? "" : Request["jp2Levels1"];
            JP2Levels2.Value = string.IsNullOrEmpty(Request["jp2Levels2"]) ? "" : Request["jp2Levels2"];
            Rotate1.Value = string.IsNullOrEmpty(Request["rotate1"]) ? "0" : Request["rotate1"];
            Rotate2.Value = string.IsNullOrEmpty(Request["rotate2"]) ? "0" : Request["rotate2"];
            NumViews.Value = string.IsNullOrEmpty(Request["NumViews"]) ? "1" : Request["NumViews"]; ;
            Maximise.Value = string.IsNullOrEmpty(Request["maximise"]) ? "false" : Request["maximise"];
            Landscape.Value = string.IsNullOrEmpty(Request["landscape"]) ? "" : Request["landscape"];
            Region1.Value = string.IsNullOrEmpty(Request["region1"]) ? "" : Request["region1"];
            Region2.Value = string.IsNullOrEmpty(Request["region2"]) ? "" : Request["region2"];
            ContentHeight.Value = string.IsNullOrEmpty(Request["contentheight"]) ? "" : Request["contentheight"];
            AspectRatio.Value = string.IsNullOrEmpty(Request["aspectratio"]) ? "" : Request["aspectratio"];
            ParentView.Value = string.IsNullOrEmpty(Request["parentview"]) ? "" : Request["parentview"];
            ImageSwitch.Value = string.IsNullOrEmpty(Request["imageswitch"]) ? "" : Request["imageswitch"];
        }
    }
}