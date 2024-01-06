import React from 'react'
import "./page.css"

const Earning = () => {
  return (
    <React.Fragment>
      <div className="content">
        <div className="container mt-5">
          <div className="parchage_main">
            <div className="page_title">
              <h1> Earning details</h1>
              <p>Earning overview</p>
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
                <tbody >
                  <tr>
                    <td>1</td>
                    <td>25 jun 2023</td>
                    <td>0xf24adaDeF4a83322eC384Dc17377B19E390FbbFd</td>
                    <td>2000.00</td>
                    <td>000.01</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>25 jun 2023</td>
                    <td>0xf24adaDeF4a83322eC384Dc17377B19E390FbbFd</td>
                    <td>2000.00</td>
                    <td>000.01</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>25 jun 2023</td>
                    <td>0xf24adaDeF4a83322eC384Dc17377B19E390FbbFd</td>
                    <td>2000.00</td>
                    <td>000.01</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Earning