import React from 'react'
import { useEffect, useState } from 'react';
import { useSDK, useContract, useAddress, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import moment from 'moment';
import "./page.css"

const Sell = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const address = useAddress();
  const sdk = useSDK();

  const { contract } = useContract("0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52");
  const { data: parent, isLoading: isParentLoading } = useContractRead(contract, "parent", [address]);
  const { data: userCounts, isLoading: isUserCountsLoading } = useContractRead(contract, "UserCounts", [address]);


  const getData = async () => {
    if (address !== undefined) {
      try {
        setLoading(true);
        const contract1 = await sdk.getContract("0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52");
        let len = Number(userCounts.SellCount.toString());
        let details = [];

        for (let i = 0; i < len; i++) {
          const data = await contract1.call(
            "userSells",
            [address, i],
          );
          let amount = parseFloat(ethers.utils.formatUnits(data.amount.toString())).toFixed(2);
          let currRate = parseFloat(ethers.utils.formatUnits(data.currentRate.toString())).toFixed(7);
          let date = moment.unix(data.dateTime.toString()).format("DD-MM-YYYY HH:mm:ss");

          let Data = [amount, currRate, date];
          details.push(Data);

        }
        setData(details);
        
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

  }

  useEffect(() => {
    if (!isUserCountsLoading) {
      getData();
    }

  }, [isUserCountsLoading, address])

  return (
    <React.Fragment>
      <div className="content">
        <div className="container mt-5">
          <div className="parchage_main">
            <div className="page_title">
              {/* <h1> Sell details</h1> */}
              <p>Sell overview</p>
            </div>

            <div className="parchage_table">
              <table className="table">
                <thead >
                  <tr>
                    <th>Sr.no</th>
                    <th>Date</th>
                    <th>Parent</th>
                    <th>Amount</th>
                    <th>Rate</th>

                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((rowData, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="date_table">{rowData[2]}</td>
                        <td>{parent}</td>
                        <td>{rowData[0]}</td>
                        <td>{rowData[1]}</td>
                      </tr>
                    ))
                  ) : (
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

export default Sell