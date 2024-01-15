import React from 'react';
import MobileLogo from '../image/mobilelogo.svg'
import dashboard from '../image/sidebar-icon/Dashboard.svg'
import sell_token from '../image/sidebar-icon/sell-token.svg'
import buy_token from '../image/sidebar-icon/buy-token.svg'
import withdraw from '../image/sidebar-icon/withdraw.svg'
import whitepaper from '../image/sidebar-icon/whitepaper.svg'
import refer from '../image/sidebar-icon/refer.svg'
import binance from '../image/binance-logo.svg'
import homepage from '../image/sidebar-icon/homepage.svg'
import pancake from '../image/sidebar-icon/pancake.svg'
import audit from '../image/sidebar-icon/audit.svg'
import { useState } from 'react';
// import hlpicon from '../image/material-symbols_help-outline (2).png'
// import settiicon from '../image/setting2.png'
import { Link, useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom'

const Saidbar = () => {

    let navigate = useNavigate()

    const [activeLink, setActiveLink] = useState('/');
    const location = useLocation();

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    return (
        <div>
            <div className="sidebar">
                <div className="navbarnone">
                    <nav className="navbar navbar-expand-md ">
                        <div className="logo">
                            <div className="togglebtn">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                                    <span className="navbar-toggler-icon"><i className="fa fa-bars" aria-hidden="true"></i></span>
                                </button>
                            </div>
                            <div className="logos_menu">
                                <h4 className='desktop-logo' href='#'> <img src="/logonew.svg" alt="Logo" /> </h4>
                                <h4 className='mobile-logo' href='#'> <img src="cunrate.svg" alt="Logomobile" /> </h4>
                            </div>
                        </div>
                        <div className="menubar">
                            <div className="menucontant">
                                <div className="collapse navbar-collapse" id="collapsibleNavbar">
                                    <Link
                                        to="/"
                                        className={location.pathname === '/' ? 'active' : ''}
                                        onClick={() => handleLinkClick('/')}
                                    >
                                        <img width={"20"} src={dashboard} alt="dasicon" /> Dashboard
                                    </Link>

                                    <Link
                                        to="/purchase"
                                        className={location.pathname === '/purchase' ? 'active' : ''}
                                        onClick={() => handleLinkClick('/purchase')}
                                    >
                                        <img width={"20"} src={buy_token} alt="rewicon" /> Staking
                                    </Link>

                                    <Link
                                        to="/referral"
                                        className={location.pathname === '/sell' ? 'active' : ''}
                                        onClick={() => handleLinkClick('/sell')}
                                    >
                                        <img width={"20"} src={refer} alt="rewicon" /> Referral
                                    </Link>

                                    {/* <Link
                                        to="/earning"
                                        className={location.pathname === '/earning' ? 'active' : ''}
                                        onClick={() => handleLinkClick('/earning')}
                                    >
                                        <img src={levelicon} alt="rewicon" /> Earning
                                    </Link> */}


                                    {/* <Link
                                        to="/referral"
                                        className={location.pathname === '/referral' ? 'active' : ''}
                                        onClick={() => handleLinkClick('/referral')}
                                    >
                                        <img width={"20"} src={refer} alt="rewicon" /> Referral
                                    </Link> */}


                                    {/* <Link
                                        to="/withdrawal"
                                        className={location.pathname === '/withdrawal' ? 'active' : ''}
                                        onClick={() => handleLinkClick('/withdrawal')}
                                    >
                                        <img width={"20"} src={withdraw} alt="rewicon" /> Withdrawal
                                    </Link> */}
                                       {/* <hr className='hr-tag'/>
                                       <a
                                      href="/CUNAudit.pdf"
                                      download="CUNAudit.pdf"
                                     >
                                      <img width={"20"} src={audit} alt="rewicon" /> Audit
                                    </a> */}



                                    <a
                                        href="/FXSTWhitepaper.pdf"
                                        download="FXSTWhitepaper.pdf"
                                        
                                    >
                                        <img width={"20"} src={whitepaper} alt="rewicon" /> Whitepaper
                                    </a>

                                    <a
                                       target='_blank'
                                        href="https://bscscan.com/address/0xA99600043E84181A9d4137aD1cefB8cfE9138674"
                                       
                                    >
                                        <img width={"20"} src={binance} alt="rewicon" /> Contract
                                    </a>

                                    <a
                                    target='_blank'
                                      href="https://fxst.org/">
                                      <img width={"20"} src={homepage} alt="rewicon" /> Homepage
                                    </a>
                                    <a
                                    target='_blank'
                                      href="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0xA99600043E84181A9d4137aD1cefB8cfE9138674&chainId=56">
                                      <img width={"20"} src={pancake} alt="rewicon" /> Buy FXST
                                    </a>

                                   
                                     
                                    {/* <a href="#contact"> <img src={sellicon} alt="sellicon" /> <span className="sell_history">Sell history</span></a> */}

                                    {/* <div className="navcontant">
                                        <a href="#contact"> <img src={hlpicon} alt="hlpicon" /> Help</a>
                                        <a href="#contact"> <img src={settiicon} alt="settiicon" /> Settings</a>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>



    )
}

export default Saidbar
