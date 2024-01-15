import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { renderToString } from "react-dom/server";
import axios from "axios";
import moment from "moment";
import pancake from '../image/sidebar-icon/pancake.svg'
import history from '../image/sidebar-icon/history.svg'
import YouTube from 'react-youtube';
import { useEffect, useState, useRef } from "react";
import victor from "../image/APROX.svg";
import widthdrow from "../image/widthdrow.png";
import arrow from "../image/cun.svg";
import Loading from "./Loading";
import infoicon from "../image/info.svg";
import greenarrow from "../image/greenarrow.svg";
import {
  useSDK,
  useTokenBalance,
  useContract,
  useAddress,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Deshbord = () => {
  const [USDTAmt, setUSDTAmt] = useState("");
  const [cunAmt, setCunAmt] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [approveAmt, setApproveAmt] = useState("");
  const [BuyTokenLoading, setBuyTokenLoading] = useState(false);
  const [SellTokensloading, setSellTokensLoading] = useState(false);
  const [WithdrawTokensloading, setWithdrawTokensLoading] = useState(false);
  const [ApproveTokensloading, setApproveTokensLoading] = useState(false);
  const referralLinkRef = useRef(null);
  const [referralCode, setReferralCode] = useState("");
  const [BTCprice, setBTCPrice] = useState("");
  const [BNBprice, setBNBPrice] = useState("");
  const [ReferralValue, setRefarralValue] = useState("0x92e784A642a2d1467DEAC09a573d74a1eC8d1801");
  const [tokenPriceLive, setTokenPriceLive] = useState(null);
  const [amountValue, setAmountValue] = useState("");
  const [durationValue, setDurationValue] = useState("");

  const isValidUSDTamount = Number(amountValue) >= 100 || amountValue == "";

  const videoId = 'qpE-_UvCstY';
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };
  //read functions
  const address = useAddress();
  const { contract } = useContract(
    "0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52"
  );
  const { data: cunWalletBal, isLoading: isCunWalletBalLoading } =
    useTokenBalance(contract, address);
  const { contract: USDTContract } = useContract(
    "0xA99600043E84181A9d4137aD1cefB8cfE9138674"
  );
  const { data: walletBal, isLoading: walletBalLoading } = useTokenBalance(
    USDTContract,
    address
  );

  const { data: totalReferralRewards, isLoading: isReferralRewardsLoading } =
    useContractRead(contract, "totalReferralRewards", [address]);

  const { data: userStakingCount, isLoading: isUserStakingLoading } =
    useContractRead(contract, "userStakingCount", [address]);

  const { data: totalRewards, isLoading: isTotalRewardsLoading } =
    useContractRead(contract, "totalRewardsReceived", [address]);

  const { data: totalInvested, isLoading: istotalInvestedLoading } =
    useContractRead(contract, "totalInvestedAmount", [address]);

  const { data: reward, isLoading: isrewardLoading } = useContractRead(
    contract,
    "totalRewardsReceived",
    [address]
  );

  const { data: directChild, isLoading: isDirectChildLoading } =
    useContractRead(contract, "showAllDirectChild", [address]);

  const { data: indirectChild, isLoading: isIndirectChildLoading } =
    useContractRead(contract, "showAllInDirectChild", [address]);

  const { data: parent, isLoading: isParentLoading } = useContractRead(
    contract,
    "parent",
    [address]
  );

  //write funcs
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
      setReferralCode(`${value}`);
    });
  }, []);

  //approve tokens
  const { mutateAsync: approve, isLoading: isApproveLoading } =
    useContractWrite(USDTContract, "approve");
  const approveTokens = async () => {
    try {
      setApproveTokensLoading(true);
      let spender = "0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52"; //contract address
      let approveAmount = (approveAmt*1000000);
      const data = await approve({ args: [spender, approveAmount] });
      console.info("contract call successs", data);
      setApproveTokensLoading(false);
      toast.success("Successfully approved tokens!", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-message_custom_success",
      });
    } catch (err) {
      setApproveTokensLoading(false);
      toast.error("Approve Failed !", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-message_custom_error",
      });
      console.error("contract call failure", err);
    } finally {
      setApproveAmt("");
      setApproveTokensLoading(false);
    }
  };

  useEffect(() => {
    if (!walletBalLoading && !isCunWalletBalLoading) {
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0xa99600043e84181a9d4137ad1cefb8cfe9138674"
        );
        const tokenPrices = response.data.data.attributes.token_prices;
        const tokenPriceValue =
          tokenPrices["0xa99600043e84181a9d4137ad1cefb8cfe9138674"];
        setTokenPriceLive(Number(tokenPriceValue).toFixed(4));
      } catch (error) {
        console.error("Error fetching token data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAmountChange = (event) => {
    setAmountValue(event.target.value);
  };

  const handleReferralChange = (event) => {
    setRefarralValue(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDurationValue(event.target.value);
  };

  // buyTokens
  const { mutateAsync: stakeTokens, isLoading: isBuyTokensLoading } =
    useContractWrite(contract, "stakeTokens");
  let ref;
  if (parent === "0x0000000000000000000000000000000000000000") {
    ref = ReferralValue;
  } else {
    ref = parent;
  }
  const { data: userValid, isLoading: isUserValidLoading } = useContractRead(
    contract,
    "userValidation",
    [ref]
  );


  //stake Token
  const stakeToken = async (event) => {
    console.log(ref)
    event.preventDefault()
    if (userValid == true) {
      try {
        setBuyTokenLoading(true);
        let usdtAmt = amountValue * 1000000;
        const data = await stakeTokens({
          args: [usdtAmt, durationValue, ref],
        });
         await fetch("https://backend.fxst.org/v1/plan-buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_wallet: address.toLowerCase(),
            parent_wallet_id: ReferralValue.toLowerCase(),
            buyed_plan: [{ amount: usdtAmt }],
            user_id: address.toLowerCase(),
          }),
        });
        setBuyTokenLoading(false);
        toast.success("Tokens Bought Successfully", {
          position: toast.POSITION.TOP_CENTER,
          className: "toast-message_custom_success",
        });
      } catch (err) {
        setBuyTokenLoading(false);
        toast.error("Something Went Wrong", {
          position: toast.POSITION.TOP_CENTER,
          className: "toast-message_custom_error",
        });
      }
    } else {
      toast.error("Please Enter a Valid Referral Address", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-message_custom_error",
      });
    }
  };

  const handleApproveTokensValue = (event) => {
    setApproveAmt(event.target.value);
  };

  //Stats functions
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const sdk = useSDK();
  // const [WithdrawTokensloading, setWithdrawTokensLoading] = useState(false);
  // const [withdrawAmt, setWithdrawAmt] = useState("");
  const [isDatePassed, setIsDatePassed] = useState(false);

  const { data: StakingCount, isLoading: isUserStakingCountLoading } =
    useContractRead(contract, "userStakingCount", [address]);

  const [withdrawData, setWithDrawData] = useState("");
  const [tableDataLoading, setTableDataLoading] = useState(true);

  const getData = async (WithdrawCheck) => {
    try {
      WithdrawCheck();
      setTableDataLoading(true);
      setLoading(true);
      const contract1 = await sdk.getContract(
        "0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52"
      );
      let len = Number(StakingCount.toString());
      let details = [];
      for (let i = 0; i < len; i++) {
        const data = await contract1.call("userStaking", [address, i]);
        let amount = (data.stakedAmount.toString() / 1000000).toFixed(2);
        let duration = data.stakingDuration.toString();
        let startDate = moment
          .unix(data.startDate.toString())
          .format("DD-MM-YYYY HH:mm:ss");
        let endDate = moment
          .unix(data.stakingEndTime.toString())
          .format("DD-MM-YYYY HH:mm:ss");

        let Data = [amount, duration, startDate, endDate];
        details.push(Data);
        // console.log ( Data, "daataaaaa")
      }
      setTableDataLoading(false);
      setData(details);

      //console.log("Stake Count Data", details);
    } catch (error) {
      setTableDataLoading(false);
      //console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const WithdrawCheck = async () => {
    let len = Number(StakingCount.toString());
    let promises = [];
    for (let i = 0; i < len; i++) {
      promises.push(
        sdk
          .getContract("0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52")
          .then((contract1) =>
            contract1.call("withdrawalCompleted", [address, i])
          )
      );
    }
    // Wait for all promises to resolve
    const result = await Promise.all(promises);
    // Set the accumulated data after all promises are resolved
    setWithDrawData(result);
  };

  useEffect(() => {
    if (!isUserStakingCountLoading) {
      getData(WithdrawCheck);
    }
  }, [isUserStakingCountLoading, address]);

  const { mutateAsync: withdraw, isLoading: isWithdrawTokensLoading } =
    useContractWrite(contract, "withdraw");

  const withdrawToken = async (index) => {
    setWithdrawTokensLoading(true);
    try {
      const data = await withdraw({ args: [index] });
      console.info("contract call successs", data);
      setWithdrawTokensLoading(false);
      toast.success("Tokens Has Been Successfully Withdrawn", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      setWithdrawTokensLoading(false);

      toast.error("Tokens Withdraw Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("contract call failure", err);
    }
  };

  

const [currentDateTime, setCurrentDateTime] = useState("");

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};


useEffect(() => {
    const now = new Date();
    const formattedDateTime = formatDate(now);
    setCurrentDateTime(formattedDateTime);
}, []); 


console.log(currentDateTime > "11-02-2024 00:50:17")
console.log()

  function parseCustomDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');
  
    // Note: Months are 0-indexed in JavaScript, so we subtract 1 from the month
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const link = "https://www.youtube.com/watch?v=qpE-_UvCstY"
  
  return (
    <>
      {BuyTokenLoading && <Loading />}
      {ApproveTokensloading && <Loading />}
      <div>
        <div className="content">
          <ToastContainer />
          <div className="cunholder container">
            <div className="container pl-0">
              <h2>
                Hello, <span style={{ color: "#f1c40f" }}>FXST</span> holder !!
              </h2>
              <p>Dashboard overview</p>
              {/* <h1>{!isUserLevelsLoading ? userLevels : 0}</h1> */}
            </div>
          </div>

          <div className="section3">
            <div className="container">
              <div className="section3_chaid">
                {data.map((item, index) => (
                  <div className="balance_info upper_three_card">
                    <p>
                      <p className="indexing">{index + 1}</p>
                      
                    </p>
                    <p>Amount: {item[0]} </p>
                    <p>Duration: {item[1]} Days</p>
                    <p>Returns: {item[1] == 30 ? "9%" :  item[1] == 45 ? "18%" : item[1] == 60? "27%" : item[1] == 75? "36%" : ""  }</p>
                    <p>Start Date: {item[2]}</p>
                    <p>End Date: {item[3]}</p>
                    { new Date() > parseCustomDate(item[3])? (
                      <button
                        onClick={() => withdrawToken(index)}
                        className="button_withdrow"
                      >
                        {" "}
                        Withdraw
                      </button>
                    ) : (
                      <button
                        disabled
                        onClick={() => withdrawToken(index)}
                        className="button_withdrow"
                      >
                        {" "}
                        Locked
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section1">
            <div className="container">
              <div className="row">
               <div className="col-lg-4 mb-3  pr-md-0">
                <div className="row mr-0 pl-0 ml-0">
                <div className="col-lg-12 mb-3 pl-0 pr-0 pr-md-0">
                  <div className="refarinfo3 refarinfo4 first-card second_top_card lower_two_card">
                    <h4>
                      <span>
                        <img src={infoicon} alt="puricon" />
                      </span>
                     Token Price
                    </h4>
 
                    <h3 className="approve_desc lower_card_price">
                    ${tokenPriceLive ? tokenPriceLive : "0.00" }
                    </h3>
                    <a target="_blank" href="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0xA99600043E84181A9d4137aD1cefB8cfE9138674&chainId=56">
                    <button
                        
                        // onClick={() => withdrawToken(index)}
                        className="Pancakeswap_button"
                      >
                        <img src={pancake}/>
                         Buy On Pancakeswap
                      </button>
                       </a>
                  </div>
                </div>
                <div className="col-lg-12 mb-3 pl-0 pr-0 pr-md-0">
                  <div className="refarinfo3 refarinfo4 first-card second_top_card lower_two_card">
                    <h4>
                      <span>
                        <img src={infoicon} alt="puricon" />
                      </span>
                     Stake & History
                    </h4>
 
                    <h3 className="approve_desc lower_card_price">
                   
                    {totalInvested ? (
                      <>
                        {!istotalInvestedLoading ? (
                          <div>{totalInvested / 1000000} FXST</div>
                        ) : (
                          "0.00"
                        )}
                      </>
                    ) : (
                      "0.00"
                    )}
                    </h3>
                    <a href="/purchase">
                    <button
                        
                        // onClick={() => withdrawToken(index)}
                        className="Pancakeswap_button"
                      >
                        <img src={history}/>
                         Stake History
                      </button>
                      </a>
                  </div>
                </div>
                </div>
               </div>
                <div className="col-lg-4 mb-3  pr-md-0">
                  <div className="refarinfo3 refarinfo4 first-card">
                    <h4>
                      <span>
                        <img src={infoicon} alt="puricon" />
                      </span>
                      Stake FXST
                    </h4>

                    {isValidUSDTamount ? null : (
                      <p className="price-warning-text text-danger text-xs">
                        Minimum 100
                      </p>
                    )}
                    <form onSubmit={stakeToken}>
                      <div className="purch desktop_button_share">
                        <input
                          value={amountValue}
                          onChange={handleAmountChange}
                          type="number"
                          placeholder="Enter amount in FXST"
                        />
                      </div>
                      <div className="duration_main_box">
                      <div className="purch desktop_button_share">
                        <select
                          value={durationValue}
                          onChange={handleDurationChange}
                          placeholder="Enter amount in FXST"
                        >
                          <option>Select Duration</option>
                          <option>30</option>
                          <option>45</option>
                          <option>60</option>
                          <option>75</option>
                        </select>
                      </div>
                      <div className="purch desktop_button_share per_monthly">
                       {durationValue == "30" ?  "9% Monthly" : durationValue ==  "45" ? "18% Monthly" : durationValue == "60" ? "27% Monthly" : durationValue == "75" ? "36% Monthly" : "Returns"}
                      </div>
                      </div>
                      <div className="purch desktop_button_share">
                        <input
                          // required
                          value={
                            parent !==
                            "0x0000000000000000000000000000000000000000"
                              ? parent
                              : ReferralValue
                          }
                          onChange={handleReferralChange}
                          type="text"
                          placeholder="Enter Referral"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={amountValue < 100}
                        className="purch stake-FXST-button"
                      >
                        Stake
                      </button>
                    </form>
                  </div>
                </div>
                <div className="col-lg-4 mb-3 mr-0 ml-0  pr-md-4">
                  <div className="refarinfo3 refarinfo4 first-card second_top_card approve_token_card">
                    <h4>
                      <span>
                        <img src={infoicon} alt="puricon" />
                      </span>
                      Approve Tokens
                    </h4>
                    <div className="row pr-2">
                      <div className="col-lg-8 pr-0">
                        <div className="purch desktop_button_share">
                          <input
                            value={approveAmt}
                            onChange={handleApproveTokensValue}
                            type="number"
                            placeholder="Enter amount in FXST"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 pl-0">
                        <button
                          onClick={approveTokens}
                          className="purch stake-FXST-button approve_button_right"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                    <h3 className="approve_desc approve_desc_right">
                      Approve FXST to interact with FXST <br/> Staking smart contract
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section3">
            <div className="container">
              <div className="section3_chaid">
                <div className="balance_info">
                  <p>
                    Total Staked
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                  </p>
                  <h4>
                    {" "}
                    {totalInvested ? (
                      <>
                        {!istotalInvestedLoading ? (
                          <div>{totalInvested / 1000000} FXST</div>
                        ) : (
                          "0.00"
                        )}
                      </>
                    ) : (
                      <h4>0.00</h4>
                    )}
                  </h4>
                </div>
                <div className="balance_info">
                  <p>
                    Token Live Price
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                  </p>
                  <h4>${tokenPriceLive ? tokenPriceLive : "0.00" }</h4>
                </div>
                <div className="balance_info">
                  <p>
                    Total Referral Rewards
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                    <h4>
                      {" "}
                      {!isReferralRewardsLoading && totalReferralRewards
                        ? (totalReferralRewards/1000000)
                        : "0.00"}{" "}
                      FXST
                    </h4>
                  </p>
                </div>

                <div className="balance_info mr-0">
                  <p>
                    Total Staking Rewards{" "}
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                  </p>
                  <h4>
                    {" "}
                    {reward && (
                      <>
                        {!isrewardLoading
                          ? (reward/1000000)
                          : "0.00"}{" "}
                      </>
                    )}
                    FXST
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="section3">
            <div className="container">
              <div className="section3_chaid">
                <div className="balance_info">
                  <p>
                    Total Plan Staked
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                  </p>
                  <h4>
                    {!isUserStakingLoading ? (
                      <div>{parseInt(userStakingCount, 16)} </div>
                    ) : (
                      "0.00"
                    )}
                  </h4>
                </div>
                <div className="balance_info">
                  <p>
                    Direct team / Total team{" "}
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                  </p>
                  <div className="withbalench">
                    {directChild ? (
                      <>
                        <h4>
                          {!isDirectChildLoading ? directChild.length : 0}
                        </h4>
                        <span>/</span>
                        <h4>
                          {!isIndirectChildLoading && !isDirectChildLoading
                            ? indirectChild.length + directChild.length
                            : 0}
                        </h4>
                      </>
                    ) : (
                      <h4>0.00</h4>
                    )}
                  </div>
                </div>
                <div className="balance_info">
                  <p>
                    Total Rewards Received
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                    <h4>
                      {" "}
                      {totalReferralRewards && (
                        <>
                          {!isReferralRewardsLoading
                            ? parseFloat(
                                ethers.utils.formatEther(
                                  totalReferralRewards.toString()
                                )
                              ).toFixed(2)
                            : "0.00"}{" "}
                        </>
                      )}
                      FXST
                    </h4>
                  </p>
                </div>

                <div className="balance_info mr-0">
                  <p>
                    Total Staking Rewards{" "}
                    <span className="greenarrow">
                      <img src={greenarrow} alt="puricon" />
                    </span>
                  </p>
                  <h4>
                    {totalRewards ? totalRewards / 1000000 : 0.0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="youtube_video">
          <iframe
            width="100%"
            height="500"
            src={link.replace('watch?v=', 'embed/')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deshbord;
