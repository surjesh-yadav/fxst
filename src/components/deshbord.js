import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { renderToString } from "react-dom/server";
import axios from "axios";
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
  const [ReferralValue, setRefarralValue] = useState("");
  const [tokenPriceLive, setTokenPriceLive] = useState(null);
  const [amountValue, setAmountValue] = useState("");
  const [durationValue, setDurationValue] = useState("");

  const isValidUSDTamount = Number(amountValue) >= 100 || amountValue == "";

  //read functions
  const address = useAddress();
  const { contract } = useContract(
    "0x59a0A965F6400d493d440c339601E64a19fe409A"
  );
  const { data: cunWalletBal, isLoading: isCunWalletBalLoading } =
    useTokenBalance(contract, address);
  const { contract: USDTContract } = useContract(
    "0xb810550336560A6E0f3E3EA3A7515AbB341E3e46"
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
      let spender = "0x59a0A965F6400d493d440c339601E64a19fe409A"; //contract address
      let approveAmount = ethers.utils.parseEther(approveAmt);
      const data = await approve({ args: [spender, approveAmount] });
      console.info("contract call successs", data);
      setApproveTokensLoading(false);
      toast.success("Successfully approved tokens!", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-message_custom",
      });
    } catch (err) {
      setApproveTokensLoading(false);
      toast.error("Approve Failed !", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-message_custom",
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
          "https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price/0xA99600043E84181A9d4137aD1cefB8cfE9138674"
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
  const stakeToken = async () => {
    if (userValid == true) {
      setBuyTokenLoading(true);
      try {
        let usdtAmt = ethers.utils.parseEther(amountValue);
        const data = await stakeTokens({
          args: [usdtAmt, durationValue, ref],
        });
        console.info("contract call successs", data);
        toast.success("Tokens Bought Successfully", {
          position: toast.POSITION.TOP_CENTER,
          className: "toast-message_custom",
        });
      } catch (err) {
        toast.error("Something Went Wrong", {
          position: toast.POSITION.TOP_CENTER,
          className: "toast-message_custom",
        });
        console.error("contract call failure", err.Reason);
      } finally {
        setUSDTAmt("");
        setBuyTokenLoading(false);
      }
    } else {
      toast.error("Please Enter a Valid Referral Address", {
        position: toast.POSITION.TOP_CENTER,
        className: "toast-message_custom",
      });
    }
  };
  const handleApproveTokensValue = (event) => {
    setApproveAmt(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    stakeToken();
  };

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
          <div className="section1">
            <div className="container">
              <div className="row">
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
                    <form onSubmit={handleFormSubmit}>
                      <div className="purch desktop_button_share">
                        <input
                          value={amountValue}
                          onChange={handleAmountChange}
                          type="number"
                          placeholder="Enter amount in USDT"
                        />
                      </div>
                      <div className="purch desktop_button_share">
                        <select
                          value={durationValue}
                          onChange={handleDurationChange}
                          placeholder="Enter amount in USDT"
                        >
                          <option>Select Duration</option>
                          <option>1</option>
                          <option>45</option>
                          <option>60</option>
                          <option>75</option>
                        </select>
                      </div>
                      <div className="purch desktop_button_share">
                        <input
                          required
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
                <div className="col-lg-5 mb-3  pr-md-0">
                  <div className="refarinfo3 refarinfo4 first-card second_top_card">
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
                            placeholder="Enter amount in USDT"
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 pl-0">
                        <button
                          onClick={approveTokens}
                          className="purch stake-FXST-button"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                    <h3 className="approve_desc">
                      Approve USDT to interact with FXST smart contract
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
                    {!istotalInvestedLoading ? (
                      <div>{totalInvested / 1000000000000000000} FXST</div>
                    ) : (
                      "0.00"
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
                  <h4>{tokenPriceLive}</h4>
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
                        ? parseFloat(
                            ethers.utils.formatEther(
                              totalReferralRewards.toString()
                            )
                          ).toFixed(2)
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
                    {reward  && 
                    <>
                      {!isrewardLoading
                      ? parseFloat(
                          ethers.utils.formatEther(reward.toString())
                        ).toFixed(2)
                      : "0.00"}{" "}
                      </>
                     }
                    
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
                  {directChild ?
                  
                   <>
                    <h4>{!isDirectChildLoading ? directChild.length : 0}</h4>
                    <span>/</span>
                    <h4>
                      {!isIndirectChildLoading && !isDirectChildLoading
                        ? indirectChild.length + directChild.length
                        : 0}
                    </h4>
                    </> : <h4>0.00</h4>
                   }
                    
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

                      {totalReferralRewards && <>
                        {!isReferralRewardsLoading
                        ? parseFloat(
                            ethers.utils.formatEther(
                              totalReferralRewards.toString()
                            )
                          ).toFixed(2)
                        : "0.00"}{" "}
                      </>}
                      
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
                    {totalRewards ? totalRewards / 1000000000000000000 : 0.0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deshbord;
