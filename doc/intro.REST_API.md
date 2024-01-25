REST is an acronym for Representational State Transfer and an architectural style for distributed hypermedia systems. Roy Fielding first presented it in 2000 in his famous [dissertation](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). Like other architectural styles, REST has its guiding principles and constraints. These principles must be satisfied if a service interface needs to be referred to as RESTful.

Ksike provide an easy way to create REST API services through a preconfigured skeleton project, for more information access to this link [KsMf REST API Project](https://github.com/ameksike/ksmf-skeleton-rest).

## Guiding Principles of REST
The six guiding principles or [constraints of the RESTful architecture](https://restfulapi.net/rest-architectural-constraints/) are:

### Uniform Interface
By applying the [principle of generality](https://www.d.umn.edu/~gshute/softeng/principles.html) to the components interface, we can simplify the overall system architecture and improve the visibility of interactions. Multiple architectural constraints help in obtaining a uniform interface and guiding the behavior of components.

The following four constraints can achieve a uniform REST interface:

- **Identification of resources**: The interface must uniquely identify each resource involved in the interaction between the client and the server.
- **Manipulation of resources through representations**: The resources should have uniform representations in the server response. API consumers should use these representations to modify the resources state in the server.
- **Self-descriptive messages**: Each resource representation should carry enough information to describe how to process the message. It should also provide information of the additional actions that the client can perform on the resource.
- **Hypermedia as the engine of application state**: The client should have only the initial URI of the application. The client application should dynamically drive all other resources and interactions with the use of hyperlinks.

### Client-Server
The client-server design pattern enforces the separation of concerns, which helps the client and the server components evolve independently.

By separating the user interface concerns (client) from the data storage concerns (server), we improve the portability of the user interface across multiple platforms and improve scalability by simplifying the server components.

### Stateless
[Statelessness](https://restfulapi.net/statelessness/) mandates that each request from the client to the server must contain all the information necessary to understand and complete the request. The server cannot take advantage of any previously stored context information on the server. 
For this reason, the client application must entirely keep the session state.

### Cacheable
The [cacheable constraint](https://restfulapi.net/caching/) requires that a response should implicitly or explicitly label itself as cacheable or non-cacheable. If the response is cacheable, the client application gets the right to reuse the response data later for equivalent requests and a specified period.

### Layered System
The layered system style allows an architecture to be composed of hierarchical layers by constraining component behavior. For example, in a layered system, each component cannot see beyond the immediate layer they are interacting with.

### Code on Demand (Optional)
REST also allows client functionality to extend by downloading and executing code in the form of applets or scripts. The downloaded code simplifies clients by reducing the number of features required to be pre-implemented. Servers can provide part of features delivered to the client in the form of code, and the client only needs to execute the code.

## Resource
The key abstraction of information in REST is a [resource](https://restfulapi.net/resource-naming/). Any information that we can name can be a resource. For example, a REST resource can be a document or image, a temporal service, a collection of other resources, or a non-virtual object (e.g., a person). The state of the resource, at any particular time, is known as the resource representation.

The resource representations are consist of:
- the data
- the metadata describing the data
- the hypermedia links that can help the clients in transition to the next desired state.

### Resource Identifiers
REST uses resource identifiers to identify each resource involved in the interactions between the client and the server components.

### Hypermedia
The data format of a representation is known as a [media type](https://www.iana.org/assignments/media-types/media-types.xhtml). The media type identifies a specification that defines how a representation is to be processed. A RESTful API looks like [hypertext](https://restfulapi.net/hateoas/). Every addressable unit of information carries an address, either explicitly (e.g., link and id attributes) or implicitly (e.g., derived from the media type definition and representation structure).

### Self-Descriptive
Further, resource representations shall be self-descriptive: the client does not need to know if a resource is an employee or a device. It should act based on the media type associated with the resource. So in practice, we will create lots of custom media types – usually one media type associated with one resource. Every media type defines a default processing model. For example, HTML defines a rendering process for hypertext and the browser behavior around each element.

### Resource Methods
Another important thing associated with REST is resource methods. These resource methods are used to perform the desired transition between two states of any resource. Numerous people wrongly relate resource methods to [HTTP methods](https://restfulapi.net/http-methods/) (i.e., GET/PUT/POST/DELETE). Roy Fielding has never mentioned any recommendation around which method to be used in which condition. All he emphasizes is that it should be a uniform interface.

## Summary
In simple words, in the REST architectural style, data, and functionality are considered resources and are accessed using Uniform Resource Identifiers (URIs).

The resources are acted upon by using a set of simple, well-defined operations. Also, the resources have to be decoupled from their representation so that clients can access the content in various formats, such as HTML, XML, plain text, PDF, JPEG, JSON, and others.

The clients and servers exchange representations of resources by using a standardized interface and protocol. Typically, HTTP is the most used protocol, but REST does not mandate it.

Metadata about the resource is made available and used to control caching, detect transmission errors, negotiate the appropriate representation format, and perform authentication or access control.

And most importantly, every interaction with the server must be stateless.

All these principles help RESTful applications to be simple, lightweight, and fast.

The next recomended topic: [Full Stack App (Angular, React, VueJs)](./intro.fullstack_app.md).
