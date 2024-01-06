import React from 'react'
// import righticon from '../image/righticon.png'
import whitearrow from '../image/whitearrow.svg'
import {
  ConnectWallet,
} from "@thirdweb-dev/react";

const connect = () => {

  return (
    <div>
      <div className="content connect-button-header">
        <div className="connect_btn">
          {/* <img src={arrow} alt="puricon" /> */}
          {/* <button>Connect <span className="whitearrow"><img src={whitearrow} alt="puricon" /></span></button> */}
          <ConnectWallet  switchToActiveChain={true} />
        </div>
      </div>
    </div>
  )
}

export default connect
