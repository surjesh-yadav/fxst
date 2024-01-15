import React from 'react';
import ReactDOM from 'react-dom/client';
import Saidbar from './components/saidbar'; // Assuming your component file is named Saidbar
import Connect from './components/connect';
import Deshbord from './components/deshbord';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {
  ThirdwebProvider,

  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";

import { ChainId } from "@thirdweb-dev/sdk";

const chainId = ChainId.BinanceSmartChainMainnet;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter >
    <ThirdwebProvider
      supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}
      activeChain={56}

      clientId="03d8e5205013d21dcdad6597d66e4015"
    >
        <App />
      </ThirdwebProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// const sidebarRoot = ReactDOM.createRoot(document.getElementById('saidbar'));
// sidebarRoot.render(
//   <React.StrictMode>
//     <Saidbar />
//   </React.StrictMode>
// );

// const deshbordRoot = ReactDOM.createRoot(document.getElementById('deshbord'));
// deshbordRoot.render(
//   <React.StrictMode>
//     <Deshbord />
//   </React.StrictMode>
// );

// const connectRoot = ReactDOM.createRoot(document.getElementById('connect'));
// connectRoot.render(
//   <React.StrictMode>
//     <Connect />
//   </React.StrictMode>
// );
