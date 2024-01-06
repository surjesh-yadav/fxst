import React from 'react'
import { useEffect, useState } from 'react';
import { useSDK, useContract, useAddress, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import moment from 'moment';
import "./page.css"

const Purchase = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const address = useAddress();
  const sdk = useSDK();

  const { contract } = useContract("0x59a0A965F6400d493d440c339601E64a19fe409A");
 
  const { data: StakingCount, isLoading: isUserStakingCountLoading } =
  useContractRead(contract, "userStakingCount", [address]);
  
  
  // const { data: userStakes, isLoading: isUserStakingLoading } =
  // useContractRead(contract, "userStaking", [address]);


  const getData = async () => {

    try {
      setLoading(true);
      const contract1 = await sdk.getContract("0x59a0A965F6400d493d440c339601E64a19fe409A");
      let len = Number(StakingCount.toString());
      let details = [];


      for (let i = 0; i < len; i++) {
        const data = await contract1.call(
          "userStaking",
          [address, i],

         
        );
        console.log ( data,"helloo")
        let amount = parseFloat(ethers.utils.formatUnits(data.stakedAmount.toString())).toFixed(2);
        let duration = (data.stakingDuration.toString());
        let startDate = moment.unix(data.startDate.toString()).format("DD-MM-YYYY HH:mm:ss");
        let endDate = moment.unix(data.stakingEndTime.toString()).format("DD-MM-YYYY HH:mm:ss");

        let Data = [amount, duration, startDate, endDate];
        details.push(Data);
       // console.log ( Data, "daataaaaa")
      }
      setData(details);
      //console.log("Stake Count Data", details);
    } catch (error) {
      //console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isUserStakingCountLoading) {
      getData();
    }

  }, [isUserStakingCountLoading, address])


  return (
    <React.Fragment>
      <div className="content">
        <div className="container mt-5">
          <div className="parchage_main">
            <div className="page_title">
              {/* <h1> Purchase details</h1> */}
              <p>Staking overview</p>
            </div>

            <div className="parchage_table">
              <table className="table">
                <thead >
                  <tr>
                    <th>Sr.no</th>
                    <th className="date_table">Staking Date</th>
                    <th>Amount</th>
                    <th>Duration</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody >
                  {data.length > 0 ? (
                    data.map((rowData, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="date_table">{rowData[2]}</td>
                        <td>{rowData[0]}</td>
                        <td>{rowData[1]} Days</td>
                        <td>{rowData[3]}</td>
                      </tr>
                    ))) : (
                    <tr>
                      <td colSpan="5">No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </React.Fragment>
  )
}

export default Purchase