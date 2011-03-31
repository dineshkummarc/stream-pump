// HTTP Stream Pump - HTTP live video stream reflector written in Node.js
// Copyright (C) 2010-2011  Government of Canada
// Written by Andrew Clunis <aclunis@credil.org>
// See COPYING for license terms.

var mmsh_stream = require('../lib/mmsh-stream.js');


// MMSH integration should start, receive a client

describe("MMSH integration should", function() {
    describe("start, ", function() {
	beforeEach(function() {
	});

	it("successfully", function() {
	    
	});

	describe("begin receiving a stream, ", function() {

	});
    });
});

//module.exports = testCase({
    // setUp: function(cb) {
    // 	this.stream = new mmsh_stream.MMSHStream();
    // },

    // shouldRefuseNewClientsWhenStreamNotStarted: {
    // 	// before a pushstart has occured, refuse everyone
    // },

    // shouldreceivePushSetup: function() {
    // 	this.stream.consumeRequest(req);
    // 	// bollocks, how do I stub things (replace a constructor to produce mocks, for instance?) temporarily inside nodeunit tests?

    // 	// let request have content type "application/x-wms-pushsetup"
    // 	// a real WMS server will create a new stream (permissions notwithstanding),
    // 	// context based on this.  Since H-S-P is configured ahead of time,
    // 	// merely send HTTP 204 back to confirm that yes, this is the right place :)
    // },

    // streamOpened: {
    // 	setUp: function(cb) {
    // 	    // it should start MMSHDemuxer, begin listening for MMSH packets from it
    // 	    // receiving PushStart request containing stream

    // 	    // let request have content type "application/x-wms-pushstart"
    // 	    // this request is the big one, the one that will contain the entire video stream
    // 	},

    // 	clientConnected: function(cb) {
    // 	    // a client has connected but we haven't received the headers yet.
    // 	    // do we block them (please hold...!) instead of shitcanning them immediately
    // 	    // like we do in the fully unconnected state?  Maybe not a bad idea.
    // 	},

    // 	receivedHeaders: {
    // 	    setUp: function(cb) {
    // 		// send it a HeaderPacket
    // 		// at this point, it should consider itself Ready for Clients
    // 	    },

    // 	    clientConnected: {
    // 		setUp: {
    // 		    // a client arrives, see ee4_to_wmp9.pcap
    // 		    // it should send the client the saved header!
    // 		    // client should be mocked, of course
    // 		    // ... (and put it in the list to receive packets in the future)
    // 		},

    // 		dataReceived: {
    // 		    // it should send DataPackets to the client as they arrive
    // 		    // iterate a few, to be sure
    // 		},

    // 		clientDisconnected: {
    // 		    // disconnect the client, make sure that sending more
    // 		    // DataPackets is fine
    // 		}
    // 	    },
    // 	},

    // 	sourceDisconnected: function(cb) {
    // 	    // if the source has disconnected/sent EOS, close it send EOS to all the clients and go back into our starting state
    // 	}
    // },
//});
