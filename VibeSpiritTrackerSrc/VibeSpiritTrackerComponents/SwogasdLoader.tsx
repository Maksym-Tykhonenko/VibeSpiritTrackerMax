import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const SwogasdLoader = () => {
  const dimensions = Dimensions.get('window');

  const loaderHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* From Uiverse.io by dexter-st */ 
        html, body {
          height: 100%;
          margin: 0;
          background: transparent;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: transparent;
        }
        .loader-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 180px;
          font-family: "Inter", sans-serif;
          font-size: 1.2em;
          font-weight: 300;
          color: white;
          border-radius: 50%;
          background-color: transparent;
          user-select: none;
        }
        .loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: transparent;
          animation: loader-rotate 2s linear infinite;
          z-index: 0;
        }
        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 10px 20px 0 #fff inset,
              0 20px 30px 0 #ad5fff inset,
              0 60px 60px 0 #471eec inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 10px 20px 0 #fff inset,
              0 20px 10px 0 #d60a47 inset,
              0 40px 60px 0 #311e80 inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 10px 20px 0 #fff inset,
              0 20px 30px 0 #ad5fff inset,
              0 60px 60px 0 #471eec inset;
          }
        }
        .loader-letter {
          display: inline-block;
          opacity: 0.4;
          transform: translateY(0);
          animation: loader-letter-anim 2s infinite;
          z-index: 1;
          border-radius: 50ch;
          border: none;
        }
        .loader-letter:nth-child(1) { animation-delay: 0s; }
        .loader-letter:nth-child(2) { animation-delay: 0.1s; }
        .loader-letter:nth-child(3) { animation-delay: 0.2s; }
        .loader-letter:nth-child(4) { animation-delay: 0.3s; }
        .loader-letter:nth-child(5) { animation-delay: 0.4s; }
        .loader-letter:nth-child(6) { animation-delay: 0.5s; }
        .loader-letter:nth-child(7) { animation-delay: 0.6s; }
        .loader-letter:nth-child(8) { animation-delay: 0.7s; }
        .loader-letter:nth-child(9) { animation-delay: 0.8s; }
        .loader-letter:nth-child(10) { animation-delay: 0.9s; }
        @keyframes loader-letter-anim {
          0%, 100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
          }
          40% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }
      </style>
    </head>
    <body>
      <div class="loader-wrapper">
        <span class="loader-letter">L</span>
        <span class="loader-letter">o</span>
        <span class="loader-letter">a</span>
        <span class="loader-letter">d</span>
        <span class="loader-letter">i</span>
        <span class="loader-letter">n</span>
        <span class="loader-letter">g</span>
        <span class="loader-letter">.</span>
        <span class="loader-letter">.</span>
        <span class="loader-letter">.</span>
        <div class="loader"></div>
      </div>
    </body>
    </html>
  `;

  return (
    <View style={{
      height: dimensions.height * 0.55,
      alignSelf: 'center',
      flex: 0,
      width: dimensions.width * 0.9,
    }}>
      <WebView
        allowsInlineMediaPlayback={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        javaScriptEnabled={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        source={{ html: loaderHTML }}
        mixedContentMode="compatibility"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        scalesPageToFit={false}
      />
    </View>
  );
};

export default SwogasdLoader;