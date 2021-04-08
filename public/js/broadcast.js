window.onload = () => {
    document.getElementById('my-button').onclick = () => {
        init();
    }
}

async function init() {
    //const stream1 = await navigator.mediaDevices.getUserMedia({ video: true });
    //document.getElementById("teacher").srcObject = stream1;
    //document.getElementById("teacher").style.display = "block";
    const stream2 = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    document.getElementById("board").srcObject = stream2;
    document.getElementById("board").style.display = "block";
    const peer = createPeer();
    //stream1.getTracks().forEach(track => peer.addTrack(track, stream1));
    stream2.getTracks().forEach(track => peer.addTrack(track, stream2));
}


function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription
    };

    const { data } = await axios.post('/broadcast', payload);
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch(e => console.log(e));
}