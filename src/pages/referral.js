import React from "react";
import { useEffect, useState } from "react";
import { useSDK, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import moment from "moment";
import "./page.css";
import { FaEye } from "react-icons/fa";

const Referral = () => {
  const [data, setData] = useState([]);
  const [refData, setRefData] = useState([]);
  const [loading, setLoading] = useState(true);

  const address = useAddress();
  const sdk = useSDK();

  const getData = async () => {
    try {
      setLoading(true);
      const contract1 = await sdk.getContract(
        "0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52"
      );
      const directChilds = await contract1.call("showAllDirectChild", [
        address,
      ]);
      let refData = [];

      for (let i = 0; i < directChilds.length; i++) {
        let rowData = [];
        let avCun = await contract1.call("balanceOf", [directChilds[i]]);
        avCun = parseFloat(ethers.utils.formatEther(avCun.toString())).toFixed(
          2
        );
        let invAmt = await contract1.call("totalInvested", [directChilds[i]]);
        invAmt = parseFloat(
          ethers.utils.formatEther(invAmt.toString())
        ).toFixed(2);
        let revAmt = await contract1.call("RewardAmount", [directChilds[i]]);
        revAmt = parseFloat(
          ethers.utils.formatEther(revAmt.toString())
        ).toFixed(2);

        rowData.push(directChilds[i]);
        rowData.push(invAmt);
        rowData.push(revAmt);
        rowData.push(avCun);

        refData.push(rowData);
      }

      setData(refData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getRefData = async (add) => {
    try {
      setLoading(true);
      const contract1 = await sdk.getContract(
        "0xB8A957238a0A49b763F3f9752c7B1Cba4544eC52"
      );
      const directChilds = await contract1.call("showAllDirectChild", [add]);
      let oneRefData = [];

      for (let i = 0; i < directChilds.length; i++) {
        let refRowData = [];

        let avCun = await contract1.call("balanceOf", [directChilds[i]]);
        avCun = parseFloat(ethers.utils.formatEther(avCun.toString())).toFixed(
          2
        );
        let invAmt = await contract1.call("totalInvested", [directChilds[i]]);
        invAmt = parseFloat(
          ethers.utils.formatEther(invAmt.toString())
        ).toFixed(2);

        let revAmt = await contract1.call("RewardAmount", [directChilds[i]]);
        revAmt = parseFloat(
          ethers.utils.formatEther(revAmt.toString())
        ).toFixed(2);

        refRowData.push(directChilds[i]);
        refRowData.push(invAmt);
        refRowData.push(revAmt);
        refRowData.push(avCun);
        oneRefData.push(refRowData);
      }
      setRefData(oneRefData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      getData(address);
    }
  }, [address]);


  const [tableData, setTableData] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      console.log(address)
      try {
        const response = await fetch(`https://backend.fxst.org/get/chain?address=${address.toLowerCase()}`);
        const jsonData = await response.json();
        setTableData(jsonData.data.details);
      } catch (error) {
        console.log(error);
      } 
    };

    fetchData();
  }, [address]); //

  return (
    <React.Fragment>
      <div className="content">
        <div className="container mt-5">
          <div className="parchage_main">
            <div className="page_title">
              {/* <h1> Referral details</h1> */}
              <p>Referral Details</p>
            </div>

            <div className="parchage_table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sr.no</th>
                    <th>Referral Address</th>
                    <th>Amount</th>
                   
                    <th>Level</th>
                
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 ? (
                    tableData.map((rowData, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{rowData.user_id}</td>
                        <td>{rowData.amount/1000000}.00 FXST</td>  
                        <td>{rowData.level}</td>
                        
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
  );
};

export default Referral;
