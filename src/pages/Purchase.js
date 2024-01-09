import React from "react";
import { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Skeleton } from "@mui/material";
import {
  useSDK,
  useContract,
  useContractWrite,
  useAddress,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import moment from "moment";
import "./page.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Purchase = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const address = useAddress();
  const sdk = useSDK();
  const [WithdrawTokensloading, setWithdrawTokensLoading] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [isDatePassed, setIsDatePassed] = useState(false);

  const { contract } = useContract(
    "0xA86906b68B84C09Fa313D53a410Bd9bA88308DA3"
  );

  const { data: StakingCount, isLoading: isUserStakingCountLoading } =
    useContractRead(contract, "userStakingCount", [address]);

  // const { data: userStakes, isLoading: isUserStakingLoading } =
  // useContractRead(contract, "userStaking", [address]);

  const [withdrawData, setWithDrawData] = useState("");
  const [tableDataLoading, setTableDataLoading] = useState(true);
  const getData = async () => {
    try {
      setLoading(true);
      const contract1 = await sdk.getContract(
        "0xA86906b68B84C09Fa313D53a410Bd9bA88308DA3"
      );
      let len = Number(StakingCount.toString());
      let details = [];

      for (let i = 0; i < len; i++) {
        const data = await contract1.call("userStaking", [address, i]);
        let amount = parseFloat(
          ethers.utils.formatUnits(data.stakedAmount.toString())
        ).toFixed(2);
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
    for (let i = 0; i < len; i++) {
      const contract1 = await sdk.getContract(
        "0xA86906b68B84C09Fa313D53a410Bd9bA88308DA3"
      );
      const data = await contract1.call("withdrawalCompleted", [address, i]);
      setWithDrawData(data);
    }
  };

  useEffect(() => {
    WithdrawCheck();
  }, []);

  useEffect(() => {
    if (!isUserStakingCountLoading) {
      getData();
    }
  }, [isUserStakingCountLoading, address]);

  const { mutateAsync: withdraw, isLoading: isWithdrawTokensLoading } =
    useContractWrite(contract, "withdraw");

  const checkWithdraw = async (index) => {
    try {
      console.info("contract call successs", data);
      toast.success("Tokens Has Been Successfully Withdrawn", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error("Tokens Withdraw Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("contract call failure", err);
    }
  };

  const withdrawToken = async (index) => {
    try {
      const data = await withdraw({ args: [index] });
      console.info("contract call successs", data);
      toast.success("Tokens Has Been Successfully Withdrawn", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (err) {
      toast.error("Tokens Withdraw Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("contract call failure", err);
    }
  };

  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDateTime = formatDate(now);
      setCurrentDateTime(formattedDateTime);
    }, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, []);
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

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
                <thead>
                  <tr>
                    <th>Sr.no</th>
                    <th className="date_table">Staking Date</th>
                    <th>Amount</th>
                    <th>Duration</th>
                    <th>End Date</th>
                    <th>Withdrow</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataLoading ? (
                    <TableRowsLoader rowsNum={10} />
                  ) : (
                    <>
                      {data.length > 0 ? (
                        data.map((rowData, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="date_table">{rowData[2]}</td>
                            <td>{rowData[0]}</td>
                            <td>{rowData[1]} Days</td>
                            <td className="date_table">{rowData[3]}</td>
                            <td>
                              {currentDateTime > rowData[3] ? (
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
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No Data Found</td>
                        </tr>
                      )}
                    </>
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

const TableRowsLoader = ({ rowsNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      <TableCell component="th" scope="row">
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" variant="text" />
      </TableCell>
    </TableRow>
  ));
};

export default Purchase;
