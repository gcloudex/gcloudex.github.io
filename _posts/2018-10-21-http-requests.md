---
layout: post
title: Http Requests
subtitle: Making Http Request call to REST API
tags: [technical, coding]
published: true
---

Software pattern for modern *client* applications, also known as the
user-interface (UI) application and whether it's web-based, mobile, IoT or
traditional desktop-based, should be based on API, de-coupling the client 
functionality from the *logic*, i.e., the *application logic*. 
The logics are developed using a different software pattern which is not 
covered in this post but in short it shoud be implemented as a **RESTful API**.

The second reason for separating the logic from the client is for
*rapid development*. The logic can be developed *in-house*, or 
using externally available logics so called *services*. There are many 
services avaiable as RESTful APIs (or **API** for short) that can be access 
through their endpoints. In fact, most SaaS applications also make available
all the APIs that their applications use.     

![Http Requests](/img/http-requests.png)
*Source: Testing Excellence*  
**Note:** the left-hand side, *i.e.*, Computer (Client) refers to any client
application as discussed above including: desktop, mobile, IoT, etc;
the right hand-side, *i.e.,* Computer (Server) refers to APIs whether they are
developed in-house and hosted on a physical server, or from external source
accessed as endpoints.  

In this article, we are discussing about **how to access the API from the client**,
speicially from a web-based client accessible from a browser whether a desktop
or mobile phone browser.  The method to access the API is called
Http Request because it is based on the Http protocol as defined in RFC 2616.
For more information, 
go to [W3C - RFC2616](https://www.w3.org/Protocols/rfc2616/rfc2616.html).
In addition, we will only be discussing about what *API client framework*
to use from the client application.

The API endpoint, used for this article, is from the *Random User Generator*.
It's a free, open source, API that provides a randomly generated user data; 
very similar to Microsoft Northwind sample database if you are old enough to
remember.

There are many *free* REST APIs that you can use for development or testing 
and I have listed some popular ones [below](#apis).

### <a name="apis"></a>REST APIs

- [Random User Generator](https://randomuser.me/)