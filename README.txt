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

//
// Overview
//
For an overview of this project please visit http://sanddragon.bl.uk

//
// SanddragonWidget Installation
//

1. Ensure that SanddragonImageService website has been installed and note down the url address.
2. Build the SanddragonWidget application using Visual Studio 2010 and then build the deployment package, the default zip location will be obj\Debug\Package\SanddragonWidget.zip.
3. Use the Web Deploy feature in IIS 7 to import the SanddragonWidget application onto your web server.
4. Update the following values in the web.config 
	- ImageServer - http://[SanddragonImageService server]/[SanddragonImageService website]/Image/
	- ImageMetadataServer - http://[SanddragonImageService server]/[SanddragonImageService website]/Metadata/
	- SanddragonWidgetServer - http://[SanddragonWidget server]/[SanddragonWidget website]/
	- View1 - [Default JP2 to show, filename without the file extension]
5. Note that if you install the IIFSanddragonWidget on a different server from the SanddragonImageService you will get 
	cross site scripting dialog, to avoid this install the SanddragonWidget on the same server as the SanddragonImageService.

//
// Example Usage
//

If you want to view JP2 other than the default 
http://[SanddragonWidget server]/[SanddragonWidget website]/?page1=[JP2 filename without the file extension]

If you want to view 2 images side by side -
http://[SanddragonWidget server]/[SanddragonWidget website]/?page1=[JP2 filename without the file extension]&page2=[JP2 filename without the file extension]&numviews=2