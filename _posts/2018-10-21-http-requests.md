---
layout: post
title: Http Requests
subtitle: Making Http Request call to REST API
tags: [technical, coding]
published: true
---
*Revision: March 3, 2019*

Software pattern for modern *client* applications, whether it's desktop-based, 
mobile, IoT or other modality, should be using API to perform *business logics* 
de-coupling the client logics from business logics. 
The logics are developed using a different software pattern which is not 
covered here but it shoud be implemented as a **RESTful API** consumable from
the client.

The second benefit from separating the client and business logics is enabling
*rapid development*. The client is typically domain specific so it is most
likely custom developed either in-house or outsourced. The logic can be 
developed in-house, or leveraging on externally available so called *services* 
or *APIs*. There are many services available (some are free) as RESTful APIs 
(**API** for short) that can be accessed via their endpoints.
I have listed some *free* APIs [below](#apis) that you can use for development
or testing.
In fact, most SaaS applications make available the same APIs that their 
client applications also use. Looking further ahead, many of these services
should be implemented using the *serverless* architecture for cost 
optimizations among other benefits.

![Http Requests](/img/http-requests.png)
[*Source*](https://www.testingexcellence.com/page/5/){:target="_blank"}  
**Note:** the left-hand side, *i.e.*, Computer (Client) refers to any client
application as discussed above including: desktop, mobile, IoT, etc;
the right hand-side, *i.e.,* Computer (Server) refers to APIs whether they are
running in-house, or from external services accessed via endpoints.  

The method to access the API is called *Http Request* because it is based on 
the Http protocol as defined in RFC 2616. For more information, go to 
[W3C - RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616.html){:target="_blank"}.

In this article, we summarize our experiences using different 
**Javascript client libraries to access APIs**, including (if applicable): 
demo and/or code, lesson learned or gotcha, pros/cons, references, etc.

Frameworks evaluated include: XMLHttpRequest, fetch, Google Client Libraries,
Axios (*future*).

The API endpoint, used for this article, is from the *Random User Generator*.
It's a free, open source, API that provides a randomly generated user data; 
very similar to Microsoft Northwind sample database if you are old enough to
remember.


### <a name="xhr"></a>XHR or <code>XMLHttpReuqest()</code>
XHR is the first Javacript framework that enables the client to make 
Http Request to APIs. Prior to this, the best practice was to make any
service calls from the server, process it, and generate the UI before 
sending back to the browser to render. XHR enables the so called thin client 
revolution with the software pattern called 
**AJAX** (*A*synchronous *J*avascript *A*nd *X*ML). With XHR, client can make 
service calls from the browser directly without hopping back to the server
where the client was served from.   

Example of how to make **GET** request:

~~~
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    renderPerson(JSON.parse(this.responseText));
  }
};
xmlhttp.open('GET', 'https://api.com/v1/person');
xmlhttp.send();
~~~

Similarly, a **POST** request can be made; see reference below. 
We will not be evaluating XHR any furthers. See references below if you are
interested to use XHR.  

The XHR coding structure requires handling of many callbacks that can become
tedious and overwhelming, hence the term *callback hell*. This issue is
addressed by newer frameworks using 
[*Promise*](https://developers.google.com/web/fundamentals/primers/promises){:target="_blank"}.
<code>fect()</code>, the framework we evaluated [below](#fetch), uses Promise.

**References:**
- [w3schools XMLHttpRequest](https://www.w3schools.com/xml/xml_http.asp){:target="_blank"}
- [MDN XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest){:target="_blank"}


### <a name="fetch"></a>Fetch framework
<code>fetch()</code> is similar to [XHR](#xhr) but uses 
[Promise](https://developers.google.com/web/fundamentals/primers/promises){:target="_blank"} 
such that the client codes become simpler and cleaner in comparison to XHR.
Please refer to the 
[Introduction to fetch()](https://developers.google.com/web/updates/2015/03/introduction-to-fetch){:target="_blank"}
for details on <code>fetch()</code>.

A skeleton implementation of Http Request using <code>fetch()</code> looks
like the following:

~~~
fetch('./api/person')
  .then(
    function(response) {
      // error 200
      if (response.status !== 200) {
        console.log('some issue with status Code: ' + response.status);
        return;
      }
      // success
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Error: ', err);
  });
~~~

A [demo](/prj2rest), showing Http Request using <code>fetch()</code> 
calling an API from Random User Generator. [code tbd]()

References:
- [Introduction to fetch()](https://developers.google.com/web/updates/2015/03/introduction-to-fetch){:target="_blank"}
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API){:target="_blank"} 


### <a name="gcp"></a>Google API Client Libraries 
Google provides client libraries for calling their cloud APIs.
The Javascript client libraries can be found [here](https://developers.google.com/api-client-library/javascript/start/start-js){:target="_blank"}.

A demo (tbd) showing a call to Google API using the JS client libraries. 

References:
- [Google Cloud Client Libraries](https://cloud.google.com/apis/docs/cloud-client-libraries){:target="_blank"}


### <a name="apis"></a>REST APIs
- [Random User Generator](https://randomuser.me/){:target="_blank"}