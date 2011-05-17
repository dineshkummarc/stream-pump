Stream Pump
================

Live media stream "muliplier" written in Node.js.  It currently only
supports Microsoft MMSH video streams.

Copyright 2010-2011 Government of Canada

Written by Andrew Clunis <aclunis@credil.org>, at CREDIL
(http://www.credil.org)

Licensed under the GNU General Public License, version 3.  Please see
COPYING for details.

Website
=======

[http://code.credil.org/projects/stream-pump](http://code.credil.org/projects/stream-pump)

Synopsis
========

Stream Pump is intended as a way to "multiply" or "reflect" a live
video stream from one source to many clients, and do it with something
rather smaller and lighter than the big and proprietary (and
expensive) media server applications (like Windows Media Server).  It
was originally written to serve a need for serving video to many
clients behind a bottle-neck.  Currently, the only protocol type
supported is Microsoft's MMSH.

On account of multicast being a non-starter these days, and the
knowledge of protocol state and framing necessary to late-join a
stream, it remains necessary to use a program like this one all the
way up at layer 5 or so (depending on how you're counting) to get this
job done.

It does:

* bounce a live video stream from one source to many clients
  (currently only MMSH supported)
* simple setup
* nest within itself; that is, you can daisy-chain Stream Pumps

It does *not* do:

* transcoding
* format/protocol conversion
* manipulation of anything deeper than the highest layer of
  encapsulation
* sophisticated playlist control
* DRM (well, duh)

Dependencies
============

* Node.js v0.4
* `jasmine-node` (http://pivotal.github.com/jasmine/), installed for use with
  Node
* `strtok` (https://github.com/pgriess/node-strtok)

Both of those packages are available in NPM under the name given.

NB. Older versions of Node.js v0.4 doesn't realize that Pragma HTTP
headers can be joined with commas.  Add `case 'pragma':` to the switch
statement in `IncomingMessage.prototype._addHeaderLine` in node's
lib/http.js.  The spec suite tests make sure that this issue is fixed.

Usage
=====

To increase confidence of sanity, run the test suite first:

    $ ./specs.js

Look in `config.js.example`, copy and adjust to taste.

Create as many streams as you like in config.js.  The only two types
you choose right now are `mmsh_push` and `mmsh_pull`.  The stream
becomes available at the HTTP path `/streams/$pathname`, at the path
name you provided.

The "push" type makes a push endpoint available at
`/streams/$pathname_push`.  Push a video stream to it with Microsoft
Expression Encoder 4, or another product that integrates the Microsoft
media stack (the old Windows Media Encoder 9 doesn't appear
to work, and it sucks anyway).  I've tried pushing to it from a NewTek
TriCaster, which worked great.

The "pull" type will attempt to connect to an MMSH stream server at
the place you provide (which could in fact be another Stream Pump),
and attempt to pull a stream from that.

No authentication for pushers or viewers yet, unfortunately.

Run the Pump itself with:

    $ ./http-stream-pump.js config.js

Start your pusher, or wait for your pull source(s) to come up, and
point your MMSH-capable user agent (aka player) the appropriate URI,
which will look something like this:

    mms://mypump.local/streams/pushed_video

Note the `mms` URI scheme.  This actually asks the user agent to try
both the old MMS protocol and MMSH, but that URI scheme has the
greatest compatibility with the user agents I've tried (Windows Media
Player, VLC, Gstreamer, mplayer).  Specifying http:// or mmsh:// can
also work depending on your user agent, but why bother?

Pushing from the Encoder with SSL
=================================

EE4 (and presumably similar) don't seem to support pushing over HTTPS.
However, Stream Pump supports SSL perfectly well (look in
`config.js.example`).

You can solve this problem by using Stunnel 4 as the SSL client.

1. Install a copy of Stunnel 4 (Windows version is available
http://www.stunnel.org, although you have to look in the Downloads
directory to see it), and configure it using the example config below.

2. Configure Stream Pump to use SSL (see `config.js.example`).

3. Point your EE4 at it (ie., change the hostname and port part of the
push URL to point at your Stunnel client instead of directly at the
pump), and you'll be pushing over SSL in no time.

I found this particularly useful because I had to push from EE4 on a
rather hostile network with an enforced (thankfully HTTP CONNECT
capable) proxy to a Pump outside on the Public Internet (and the 0x46
bug I mention below was causing mysterious failures).

Stunnel 4 example config as follows:

    ;; Some performance tunings
    socket = l:TCP_NODELAY=1
    socket = r:TCP_NODELAY=1

    debug = 6

    client = yes

    [mmsh]
    ;; listen on port 8080 on 127.0.0.1; this is what you point your EE4 to.
    accept = localhost:8080

    ;; to use an HTTP CONNECT proxy, add these lines:
    ; protocol = connect
    ; protocolHost = mypump.org:8089 
    ;; but wait! you have to put your target (ie., pump's address) here,
    ;; *not* your proxy's address.  Silly Stunnel.

    ;; coordinates of the SSL service of your Stream Pump:
    ;; and, to use an HTTP CONNECT proxy, put your proxy server's
    ;; coordinates here, *not* your pump's address.
    connect = mypump.org:8089

Pump House
==========

The Pump House is a facility that manages a deployed fleet of Pumps, and
can delegate stream viewers to them automatically.

It will (I'm actively working on this part, so these are my task notes):

* maintain a roster of Pumps
* for now, that roster is predfined in a JSON flat-file.  database
  later.
* set up Pumps with centrally defined configuration, with a minimum of
  configuration required on the Pump itself
* for now at least, it will be manually specified in the roster which
  pump will pull from which other pump.  if none is specified, it will
  use the original source specified to Pump House
* receive continuous telemetry from Pumps
* associate IPv4 networks with a given Pump, and delegate clients
  coming from that network to that Pump (defined in CIDR notation)
* serve a simple (but attractive!) HTML status page that will show the
  status and throughput of each pump, along with client status
* Pump should verify the X509 certificate of the Pump House before
  sendings its key
* contain integration points for use with an external streaming
  frontend, notably tracking of clients with externally assigned IDs.
  this might not be a comprehensive enough interface for the frontend
  to provide straight-forward presentation to a moderator of the
  health of a given one of their users.  a bit of a REST API or similar
  may need to be added eventually
* automatic provisioning of new Pumps into the roster
* when this list is further along to completion, replace it with a
  proper top-down description of the purpose and behaviour of the Pump
  House component
* might do automatic discovery of shortest routes between pumps, and
  thus be able to automatically position pumps in the stream pump
  graph... eventally.  by definition kind of heurist-acular
* eventually replacing pump keys with X509 client-side certificates

Pump House Configuration
------------------------

In the pump house config file (see `pump-house-config.json.example`),
set pumps_roster_json to a JSON file containing the pre-defined roster
of pumps, as explained below.  Relative paths are considered from the
path of the config file.  In the `streams` section, enter a stream
source configuration like you would do in a standard Stream Pump
configuration.  Typically, pull sources make more sense here.

In the pumps roster JSON (see `pumps-roster.json.example`), pumps are
specified in an array of hashes with IDs, human-readable titles, an
authentication key, which other pump in the roster that it should
source its streams from (if any), and the list of networks that it
serves, as an array of CIDRs.

Further Reading
===============

[MS-WMSP], from http://msdn.microsoft.com/en-us/library/cc239311.aspx

RFC 4632, Section 3.1: http://tools.ietf.org/html/rfc4632#section-3.1

TODO
====

This is still very new, and kind of buggy.  My TODO notes follow:

* more internal documentation, docstrings, etc.
* authentication
* do more integration tests, preferably with factored-out steps
* make appropriate behavoural descisions for the different user agents
  as per the MMSH spec, such as it is
* warn and fail if fragmented ASF headers (any packets?) arrive
* does the MMSH preheader location id field have a appropriate wrap
  behaviour when it overflows the 32-bits?
* proper IPv6 support
* sometimes, an undocumented MMSH packet type, 0x46, can sometimes
  appear in the incoming stream from a Microsoft encoder.  I have no
  idea what to do with it.  It seems to happen far more often if
  you're pushing through a proxy, which was part of my reason for
  developing the stunnel procedure you see above.
* implement some stream protocols other than MMSH.  RTSP and
  RTMP seem like good candidates.
* permission dropping, so it can be started as root but run as nobody
