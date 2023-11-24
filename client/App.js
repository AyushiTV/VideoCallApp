// yeeeee banayiiiiii haiiiiii
// import React, {useEffect, useState, useRef} from 'react';
// import {
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   View,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import TextInputContainer from './components/TextInputContainer';
// import SocketIOClient from 'socket.io-client';
// import {
//   mediaDevices,
//   RTCPeerConnection,
//   RTCView,
//   RTCIceCandidate,
//   RTCSessionDescription,
// } from 'react-native-webrtc';
// import CallEnd from './asset/CallEnd';
// import CallAnswer from './asset/CallAnswer';
// import MicOn from './asset/MicOn';
// import MicOff from './asset/MicOff';
// import VideoOn from './asset/VideoOn';
// import VideoOff from './asset/VideoOff';
// import CameraSwitch from './asset/CameraSwitch';
// import IconContainer from './components/IconContainer';
// import InCallManager from 'react-native-incall-manager';

// export default function App({}) {
//   const [localStream, setlocalStream] = useState(null);

//   const [remoteStream, setRemoteStream] = useState(null);

//   const [type, setType] = useState('JOIN');

//   const [callerId] = useState(
//     Math.floor(100000 + Math.random() * 900000).toString(),
//   );
//   const otherUserId = useRef(null);

//   const socket = SocketIOClient('https://nice-pens-cut.loca.lt', {
//     transports: ['websocket'],
//     query: {
//       callerId,
//     },
//   });

//   const [localMicOn, setlocalMicOn] = useState(true);
//   const [localWebcamOn, setlocalWebcamOn] = useState(true);
//   const peerConnection = useRef(
//     new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: 'stun:stun.l.google.com:19302',
//         },
//         {
//           urls: 'stun:stun1.l.google.com:19302',
//         },
//         {
//           urls: 'stun:stun2.l.google.com:19302',
//         },
//       ],
//     }),
//   );

//   let remoteRTCMessage = useRef(null);

//   useEffect(() => {
//     socket.on('call', data => {
//       remoteRTCMessage.current = data.rtcMessage;
//       otherUserId.current = data.callerId;
//       setType('INCOMING_CALL');
//     });

//     socket.on('answerCall', data => {
//       remoteRTCMessage.current = data.rtcMessage;
//       peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(remoteRTCMessage.current),
//       );
//       setType('WEBRTC_ROOM');
//     });

//     socket.on('ICEcandidate', data => {
//       let message = data.rtcMessage;

//       if (peerConnection.current) {
//         peerConnection?.current
//           .addIceCandidate(
//             new RTCIceCandidate({
//               candidate: message.candidate,
//               sdpMid: message.id,
//               sdpMLineIndex: message.label,
//             }),
//           )
//           .then(data => {
//             console.log('SUCCESS');
//           })
//           .catch(err => {
//             console.log('Error', err);
//           });
//       }
//     });

//     let isFront = false;

//     mediaDevices.enumerateDevices().then(sourceInfos => {
//       let videoSourceId;
//       for (let i = 0; i < sourceInfos.length; i++) {
//         const sourceInfo = sourceInfos[i];
//         if (
//           sourceInfo.kind == 'videoinput' &&
//           sourceInfo.facing == (isFront ? 'user' : 'environment')
//         ) {
//           videoSourceId = sourceInfo.deviceId;
//         }
//       }

//       mediaDevices
//         .getUserMedia({
//           audio: true,
//           video: {
//             mandatory: {
//               minWidth: 500, // Provide your own width, height and frame rate here
//               minHeight: 300,
//               minFrameRate: 30,
//             },
//             facingMode: isFront ? 'user' : 'environment',
//             optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//           },
//         })
//         .then(stream => {
//           // Got stream!

//           setlocalStream(stream);

//           // setup stream listening
//           peerConnection.current.addStream(stream);
//         })
//         .catch(error => {
//           // Log error
//         });
//     });

//     peerConnection.current.onaddstream = event => {
//       setRemoteStream(event.stream);
//     };

//     // Setup ice handling
//     peerConnection.current.onicecandidate = event => {
//       if (event.candidate) {
//         sendICEcandidate({
//           calleeId: otherUserId.current,
//           rtcMessage: {
//             label: event.candidate.sdpMLineIndex,
//             id: event.candidate.sdpMid,
//             candidate: event.candidate.candidate,
//           },
//         });
//       } else {
//         console.log('End of candidates.');
//       }
//     };

//     return () => {
//       socket.off('newCall');
//       socket.off('callAnswered');
//       socket.off('ICEcandidate');
//     };
//   }, []);

//   useEffect(() => {
//     InCallManager.start();
//     InCallManager.setKeepScreenOn(true);
//     InCallManager.setForceSpeakerphoneOn(true);

//     return () => {
//       InCallManager.stop();
//     };
//   }, []);

//   function sendICEcandidate(data) {
//     socket.emit('ICEcandidate', data);
//     console.log(data, '...........ICE Data');
//   }

//   async function processCall() {
//     const sessionDescription = await peerConnection.current.createOffer();
//     await peerConnection.current.setLocalDescription(sessionDescription);
//     sendCall({
//       calleeId: otherUserId.current,
//       rtcMessage: sessionDescription,
//     });
//   }

//   async function processAccept() {
//     peerConnection.current.setRemoteDescription(
//       new RTCSessionDescription(remoteRTCMessage.current),
//     );
//     const sessionDescription = await peerConnection.current.createAnswer();
//     await peerConnection.current.setLocalDescription(sessionDescription);
//     answerCall({
//       callerId: otherUserId.current,
//       rtcMessage: sessionDescription,
//     });
//   }

//   function answerCall(data) {
//     socket.emit('answerCall', data);
//   }

//   function sendCall(data) {
//     socket.emit('call', data);
//   }

//   const JoinScreen = () => {
//     return (
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{
//           flex: 1,
//           backgroundColor: '#050A0E',
//           justifyContent: 'center',
//           paddingHorizontal: 42,
//         }}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <>
//             <View
//               style={{
//                 padding: 35,
//                 backgroundColor: '#1A1C22',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: 14,
//               }}>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: '#D0D4DD',
//                 }}>
//                 Your Caller ID
//               </Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   marginTop: 12,
//                   alignItems: 'center',
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 32,
//                     color: '#ffff',
//                     letterSpacing: 6,
//                   }}>
//                   {callerId}
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={{
//                 backgroundColor: '#1A1C22',
//                 padding: 40,
//                 marginTop: 25,
//                 justifyContent: 'center',
//                 borderRadius: 14,
//               }}>
//               <Text
//                 style={{
//                   fontSize: 18,
//                   color: '#D0D4DD',
//                 }}>
//                 Enter call id of another user
//               </Text>
//               <TextInputContainer
//                 placeholder={'Enter Caller ID'}
//                 value={otherUserId.current}
//                 setValue={text => {
//                   otherUserId.current = text;
//                   console.log('TEST', otherUserId.current);
//                 }}
//                 keyboardType={'number-pad'}
//               />
//               <TouchableOpacity
//                 onPress={() => {
//                   setType('OUTGOING_CALL');
//                   processCall();
//                 }}
//                 style={{
//                   height: 50,
//                   backgroundColor: '#5568FE',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderRadius: 12,
//                   marginTop: 16,
//                 }}>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     color: '#FFFFFF',
//                   }}>
//                   Call Now
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     );
//   };

//   const OutgoingCallScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           backgroundColor: '#050A0E',
//         }}>
//         <View
//           style={{
//             padding: 35,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 14,
//           }}>
//           <Text
//             style={{
//               fontSize: 16,
//               color: '#D0D4DD',
//             }}>
//             Calling to...
//           </Text>

//           <Text
//             style={{
//               fontSize: 36,
//               marginTop: 12,
//               color: '#ffff',
//               letterSpacing: 6,
//             }}>
//             {otherUserId.current}
//           </Text>
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               setType('JOIN');
//               otherUserId.current = null;
//             }}
//             style={{
//               backgroundColor: '#FF5D5D',
//               borderRadius: 30,
//               height: 60,
//               aspectRatio: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CallEnd width={50} height={12} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   const IncomingCallScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'space-around',
//           backgroundColor: '#050A0E',
//         }}>
//         <View
//           style={{
//             padding: 35,
//             justifyContent: 'center',
//             alignItems: 'center',
//             borderRadius: 14,
//           }}>
//           <Text
//             style={{
//               fontSize: 36,
//               marginTop: 12,
//               color: '#ffff',
//             }}>
//             {otherUserId.current} is calling..
//           </Text>
//         </View>
//         <View
//           style={{
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <TouchableOpacity
//             onPress={() => {
//               processAccept();
//               setType('WEBRTC_ROOM');
//             }}
//             style={{
//               backgroundColor: 'green',
//               borderRadius: 30,
//               height: 60,
//               aspectRatio: 1,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CallAnswer height={28} fill={'#fff'} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   function switchCamera() {
//     localStream.getVideoTracks().forEach(track => {
//       track._switchCamera();
//     });
//   }

//   function toggleCamera() {
//     localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
//     localStream.getVideoTracks().forEach(track => {
//       localWebcamOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   function toggleMic() {
//     localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
//     localStream.getAudioTracks().forEach(track => {
//       localMicOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   function leave() {
//     peerConnection.current.close();
//     setlocalStream(null);
//     setType('JOIN');
//   }

//   const WebrtcRoomScreen = () => {
//     return (
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: '#050A0E',
//           paddingHorizontal: 12,
//           paddingVertical: 12,
//         }}>
//         {localStream ? (
//           <RTCView
//             objectFit={'cover'}
//             style={{
//               flex: 1,
//               backgroundColor: '#050A0E',
//               borderColor: 'white',
//               borderWidth: 10,
//             }}
//             streamURL={localStream.toURL()}
//           />
//         ) : null}
//         {remoteStream ? (
//           <RTCView
//             objectFit={'cover'}
//             style={{
//               flex: 1,
//               backgroundColor: '#050A0E',
//               marginTop: 8,
//               borderColor: 'white',
//               borderWidth: 10,
//             }}
//             streamURL={remoteStream.toURL()}
//           />
//         ) : null}
//         <View
//           style={{
//             marginVertical: 12,
//             flexDirection: 'row',
//             justifyContent: 'space-evenly',
//           }}>
//           <IconContainer
//             backgroundColor={'red'}
//             onPress={() => {
//               leave();
//             }}
//             Icon={() => {
//               return <CallEnd height={26} width={26} fill="#FFF" />;
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={!localMicOn ? '#fff' : 'transparent'}
//             onPress={() => {
//               toggleMic();
//             }}
//             Icon={() => {
//               return localMicOn ? (
//                 <MicOn height={24} width={24} fill="#FFF" />
//               ) : (
//                 <MicOff height={28} width={28} fill="#1D2939" />
//               );
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
//             onPress={() => {
//               toggleCamera();
//             }}
//             Icon={() => {
//               return localWebcamOn ? (
//                 <VideoOn height={24} width={24} fill="#FFF" />
//               ) : (
//                 <VideoOff height={36} width={36} fill="#1D2939" />
//               );
//             }}
//           />
//           <IconContainer
//             style={{
//               borderWidth: 1.5,
//               borderColor: '#2B3034',
//             }}
//             backgroundColor={'transparent'}
//             onPress={() => {
//               switchCamera();
//             }}
//             Icon={() => {
//               return <CameraSwitch height={24} width={24} fill="#FFF" />;
//             }}
//           />
//         </View>
//       </View>
//     );
//   };

//   switch (type) {
//     case 'JOIN':
//       return JoinScreen();
//     case 'INCOMING_CALL':
//       return IncomingCallScreen();
//     case 'OUTGOING_CALL':
//       return OutgoingCallScreen();
//     case 'WEBRTC_ROOM':
//       return WebrtcRoomScreen();
//     default:
//       return null;
//   }
// }

import React, {useEffect, useState, useRef} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import TextInputContainer from './components/TextInputContainer';
import SocketIOClient from 'socket.io-client';
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import CallEnd from './asset/CallEnd';
import CallAnswer from './asset/CallAnswer';
import MicOn from './asset/MicOn';
import MicOff from './asset/MicOff';
import VideoOn from './asset/VideoOn';
import VideoOff from './asset/VideoOff';
import CameraSwitch from './asset/CameraSwitch';
import IconContainer from './components/IconContainer';
import InCallManager from 'react-native-incall-manager';

export default function App({}) {
  const [localStream, setlocalStream] = useState(null);

  const [remoteStream, setRemoteStream] = useState(null);

  const [type, setType] = useState('JOIN');

  const [callerId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString(),
  );
  const otherUserId = useRef(null);

  const socket = SocketIOClient('https://strong-lands-relax.loca.lt', {
    transports: ['websocket'],
    query: {
      callerId,
    },
  });

  const [localMicOn, setlocalMicOn] = useState(true);

  const [localWebcamOn, setlocalWebcamOn] = useState(true);
  //...................
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');

  const sendChatMessage = text => {
    const message = {
      text,
      senderId: callerId,
      receiverId: otherUserId.current,
    };

    socket.emit('chatMessage', message);
    setChatMessages([...chatMessages, message]);
    setChatInputText('');
  };

  useEffect(() => {
    socket.on('chatMessage', message => {
      setChatMessages([...chatMessages, message]);
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [chatMessages]);
  //....................................
  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

  let remoteRTCMessage = useRef(null);

  useEffect(() => {
    socket.on('newCall', data => {
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      setType('INCOMING_CALL');
    });

    // peerConnection.current.onicecandidate = event => {
    //   if (event.candidate) {
    //     sendICEcandidate({
    //       calleeId: otherUserId.current,
    //       rtcMessage: {
    //         label: event.candidate.sdpMLineIndex,
    //         id: event.candidate.sdpMid,
    //         candidate: event.candidate.candidate,
    //       },
    //     });
    //   } else {
    //     console.log('End of candidates.');
    //   }
    // };

    // socket.on('callAnswered', data => {
    //   remoteRTCMessage.current = data.rtcMessage;
    //   peerConnection.current.setRemoteDescription(
    //     new RTCSessionDescription(remoteRTCMessage.current),
    //   );
    //   setType('WEBRTC_ROOM');
    // });
    socket.on('callAnswered', async data => {
      remoteRTCMessage.current = data.rtcMessage;
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );
      processAccept();
      setType('WEBRTC_ROOM');
    });

    socket.on('ICEcandidate', data => {
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(data => {
            console.log('SUCCESS');
          })
          .catch(err => {
            console.log('Error', err);
          });
      }
    });

    let isFront = false;

    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: true, // Enable video as well
        })
        .then(stream => {
          setlocalStream(stream);
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          console.log('Error getting user media: ', error);
        });
      // .getUserMedia({
      //   audio: true,
      //   video: {
      //     mandatory: {
      //       minWidth: 500, // Provide your own width, height and frame rate here
      //       minHeight: 300,
      //       minFrameRate: 30,
      //     },
      //     facingMode: isFront ? 'user' : 'environment',
      //     optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      //   },
      // })

      // .then(stream => {
      //   // Got stream!
      //   setlocalStream(stream);
      //   // setup stream listening
      //   peerConnection.current.addStream(stream);
      // })
      // .catch(error => {
      //   // Log error
      // });
    });

    peerConnection.current.onaddstream = event => {
      console.log(event.stream, '..........itssssss remote stream.....');
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  useEffect(() => {
    InCallManager.start();
    InCallManager.setKeepScreenOn(true);
    InCallManager.setForceSpeakerphoneOn(true);

    return () => {
      InCallManager.stop();
    };
  }, []);

  function sendICEcandidate(data) {
    socket.emit('ICEcandidate', data);
  }

  async function processCall() {
    const sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  async function processAccept() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  //...............
  // const processCall = async () => {
  //   const sessionDescription = await peerConnection.current.createOffer();
  //   await peerConnection.current.setLocalDescription(sessionDescription);
  //   sendCall({
  //     calleeId: otherUserId.current,
  //     rtcMessage: sessionDescription,
  //   });
  // };

  // const processAccept = async () => {
  //   peerConnection.current.setRemoteDescription(
  //     new RTCSessionDescription(remoteRTCMessage.current),
  //   );
  //   const sessionDescription = await peerConnection.current.createAnswer();
  //   await peerConnection.current.setLocalDescription(sessionDescription);
  //   answerCall({
  //     callerId: otherUserId.current,
  //     rtcMessage: sessionDescription,
  //   });
  // };

  //.............

  function answerCall(data) {
    socket.emit('answerCall', data);
  }

  function sendCall(data) {
    socket.emit('call', data);
  }

  const JoinScreen = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          justifyContent: 'center',
          paddingHorizontal: 42,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View
              style={{
                padding: 35,
                backgroundColor: '#1A1C22',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Your Caller ID
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 32,
                    color: '#ffff',
                    letterSpacing: 6,
                  }}>
                  {callerId}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#1A1C22',
                padding: 40,
                marginTop: 25,
                justifyContent: 'center',
                borderRadius: 14,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#D0D4DD',
                }}>
                Enter call id of another user
              </Text>
              <TextInputContainer
                placeholder={'Enter Caller ID'}
                value={otherUserId.current}
                setValue={text => {
                  otherUserId.current = text;
                  console.log('TEST', otherUserId.current);
                }}
                keyboardType={'number-pad'}
              />
              <TouchableOpacity
                onPress={() => {
                  setType('OUTGOING_CALL');
                  processCall();
                }}
                style={{
                  height: 50,
                  backgroundColor: '#5568FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}>
                  Call Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setType('CHAT_ROOM');
                }}
                style={{
                  height: 50,
                  backgroundColor: '#5568FE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                  }}>
                  Start Chat
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  };
  console.log(callerId, '...........CallerID');
  console.log(otherUserId.current, '........Other');

  const OutgoingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#D0D4DD',
            }}>
            Calling to...
          </Text>
          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
              letterSpacing: 6,
            }}>
            {otherUserId.current}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setType('JOIN');
              otherUserId.current = null;
            }}
            style={{
              backgroundColor: '#FF5D5D',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallEnd width={50} height={12} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const IncomingCallScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
            }}>
            {otherUserId.current} is calling..
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              processAccept();
              setType('WEBRTC_ROOM');
            }}
            style={{
              backgroundColor: 'green',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallAnswer height={28} fill={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  function switchCamera() {
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    peerConnection.current.close();
    setlocalStream(null);
    setType('JOIN');
  }

  const WebrtcRoomScreen = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#050A0E',
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}>
        {/* {localStream ? (
          <RTCView
            objectFit={'cover'}
            style={{flex: 1, backgroundColor: '#050A0E'}}
            streamURL={localStream.toURL()}
          />
        ) : null}
        {remoteStream ? (
          <RTCView
            objectFit={'cover'}
            style={{
              flex: 1,
              backgroundColor: '#050A0E',
              marginTop: 8,
            }}
            streamURL={remoteStream.toURL()}
          />
        ) : null} */}
        {localStream && (
          <RTCView
            objectFit="cover"
            style={{
              flex: 1,
              backgroundColor: '#050A0E',
              borderColor: 'white',
              borderWidth: 2,
            }}
            streamURL={localStream.toURL()}
          />
        )}
        {remoteStream && (
          <RTCView
            objectFit="cover"
            style={{
              flex: 1,
              backgroundColor: 'yellow',
              marginTop: 8,
              borderColor: 'white',
              borderWidth: 2,
            }}
            streamURL={remoteStream.toURL()}
          />
        )}
        <View
          style={{
            marginVertical: 12,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <IconContainer
            backgroundColor={'red'}
            onPress={() => {
              leave();
            }}
            Icon={() => {
              return <CallEnd height={26} width={26} fill="#FFF" />;
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localMicOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleMic();
            }}
            Icon={() => {
              return localMicOn ? (
                <MicOn height={24} width={24} fill="#FFF" />
              ) : (
                <MicOff height={28} width={28} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
            onPress={() => {
              toggleCamera();
            }}
            Icon={() => {
              return localWebcamOn ? (
                <VideoOn height={24} width={24} fill="#FFF" />
              ) : (
                <VideoOff height={36} width={36} fill="#1D2939" />
              );
            }}
          />
          <IconContainer
            style={{
              borderWidth: 1.5,
              borderColor: '#2B3034',
            }}
            backgroundColor={'transparent'}
            onPress={() => {
              switchCamera();
            }}
            Icon={() => {
              return <CameraSwitch height={24} width={24} fill="#FFF" />;
            }}
          />
        </View>
      </View>
    );
  };
  // const ChatScreen = () => {
  //   return (
  //     <View style={{flex: 1, padding: 12}}>
  //       <FlatList
  //         data={chatMessages}
  //         keyExtractor={(item, index) => index.toString()}
  //         renderItem={({item}) => (
  //           <Text
  //             style={{color: item.senderId === callerId ? 'blue' : 'green'}}>
  //             {item.text}
  //           </Text>
  //         )}
  //       />
  //       <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //         <TextInput
  //           style={{flex: 1, height: 40, borderColor: 'gray', borderWidth: 1}}
  //           onChangeText={text => setChatInputText(text)}
  //           value={chatInputText}
  //           placeholder="Type a message..."
  //         />
  //         <TouchableOpacity onPress={() => sendChatMessage(chatInputText)}>
  //           <Text>Send</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // };
  const HomeScreen = () => {
    return (
      <View style={{flex: 1}}>
        <Modal />
      </View>
    );
  };
  console.log(otherUserId.current, '_____________Current id');
  const ChatScreen = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: '#1A1C22',
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, color: '#D0D4DD', flex: 1}}>
            Chatting with {otherUserId.current}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setType('JOIN');
            }}>
            <Text style={{fontSize: 18, color: '#FF5D5D'}}>Exit</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={chatMessages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 8,
                paddingHorizontal: 10,
              }}>
              {item.senderId === callerId ? (
                <View style={{flex: 1}} />
              ) : (
                <Image
                  source={require('./assetImage/received.png')}
                  style={{width: 30, height: 30}}
                />
              )}
              <View
                style={{
                  flex: 4,
                  backgroundColor:
                    item.senderId === callerId ? '#95b1f0' : '#DCF8C6',
                  borderRadius: 8,
                  padding: 12,
                  marginLeft: 8,
                }}>
                <Text>{item.text}</Text>
              </View>
              {item.senderId === callerId ? (
                <Image
                  source={require('./assetImage/sender.png')}
                  style={{width: 40, height: 40}}
                />
              ) : (
                <View style={{flex: 1}} />
              )}
            </View>
          )}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,

              marginLeft: 8,
            }}
            onChangeText={text => setChatInputText(text)}
            value={chatInputText}
            placeholder="Type a message..."
          />
          {console.log(chatInputText, '.......chatInputText')}
          <TouchableOpacity onPress={() => sendChatMessage(chatInputText)}>
            <Image
              source={require('./assetImage/send.png')}
              style={{width: 30, height: 30, marginRight: 8}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  ////...
  // Install socket.io-client: npm install socket.io-client
  // Replace with your server URL

  ///.....

  switch (type) {
    case 'JOIN':
      return JoinScreen();
    case 'INCOMING_CALL':
      return IncomingCallScreen();
    case 'OUTGOING_CALL':
      return OutgoingCallScreen();
    case 'WEBRTC_ROOM':
      return WebrtcRoomScreen();
    case 'CHAT_ROOM':
      return ChatScreen();
    case 'HOME':
      return HomeScreen();
    default:
      return null;
  }
}

// /....................
