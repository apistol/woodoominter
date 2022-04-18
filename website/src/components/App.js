import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import contractVoodoo from "../abis/voodooContract.json"
import contractVoodoo2 from "../abis/VoodooVaultBrokenPass.json"
import './App.css';
import coinImage from "../images/coin.png"
import brokenPassImage from "../images/BROKEN.png"
import normalPassImage from "../images/NORMAL.png"
import discordLogo from "../images/logos/discord.png"
import appleLogo from "../images/logos/apple.png"
import youtubeLogo from "../images/logos/youtube.png"
import instagramLogo from "../images/logos/instagram.png"
import tiktokLogo from "../images/logos/tiktok.png"
import spotifyLogo from "../images/logos/spotify.png"
import logoVoodoo from "../images/Logo.png"
import logoVault from "../images/logoVault.png"
import {Spinner} from "react-bootstrap";

const contractAddress="0xb24EAc3AAD94B42Dd5ddffC927054f29b7451424";
const contractAddress2="0x23611781bFE18C53824a658d0548B1E23c87721f";

const App=() => {

    const limit=10000
    // const [web3, setweb3]=useState('undefined')
    const [voodooContract, setvoodooContract]=useState(null)
    const [voodooContract2, setvoodooContract2]=useState(null)


    const [balance, setbalance]=useState(0)
    const [balance2, setbalance2]=useState(0)

    const [price]=useState(0.09)
    const [price2]=useState(0.01)

    const [amountToMint, setamountToMint]=useState(1)
    const [amountToMint2, setamountToMint2]=useState(1)


    const [loading, setLoading]=useState(false)
    const [voodooTokens, setVoodooTokens]=useState(0)

    const [account, setaccount]=useState('')

    const [serrorMessage, setErrorMessage]=useState(null)

    const [pass, setPass] = useState(1)

    const [userNetId, setUserNetId]=useState(null)

    const web3=new Web3(window.ethereum)


    const loadBlockchainData=async () => {
        if(window.ethereum){
            //load contracts
            try{
                const tokenVoodoo=new web3.eth.Contract(contractVoodoo.abi, contractAddress)
                setvoodooContract(tokenVoodoo)

                const tokenVoodoo2=new web3.eth.Contract(contractVoodoo2.abi, contractAddress2)
                setvoodooContract2(tokenVoodoo2)
            } catch (e){
                console.log('Error', e)
                window.alert('Contracts not deployed to the current network')
            }

        }else{
            window.alert('Please install MetaMask')
        }
    }


    const handleConnectWallet=async () => {
        if(window.ethereum){
            // metamask is here
            window.ethereum
                .request({method: "eth_requestAccounts"})
                .then(result => {
                    // accountChangeHandler(result[0])
                    setaccount(result[0])
                    setErrorMessage(null)
                })
            const netID=await web3.eth.net.getId();
            setUserNetId(netID)
        }else{
            setErrorMessage("Install MetaMask")
        }

    }

    // const accountChangeHandler=(newAccount) => {
    //     setDefaultAccount(newAccount)
    //     getUserBalance(newAccount)
    // }

    // const getUserBalance=(address) => {
    //     if(window.ethereum){
    //         window.ethereum
    //             .request({method: "eth_getBalance", params: [address, 'latest']})
    //             .then(balance => {
    //                 setUserBalance(ethers.utils.formatEther(balance))
    //             })
    //     }else{
    //         setErrorMessage("Install MetaMask")
    //     }
    // }

    const chainChangedHandler=() => {
        window.location.reload()
    }

    useEffect(() => {
        if(window.ethereum){
            window.ethereum.on('accountsChanged', handleConnectWallet);
            window.ethereum.on('chainChanged', chainChangedHandler)
        }
    }, [window.ethereum])


    const handleMint=() => {
        setLoading(true)
        const total=(amountToMint * price).toString()
        const totaltokens=Web3.utils.toWei(total, 'ether')
        const totalToHex=Web3.utils.toHex(totaltokens)


        voodooContract.methods
            .buy(amountToMint)
            .send({value: totalToHex, from: account})
            .then(() => {
                window.alert("Tranzactie efectuata cu succes.")
                setLoading(false)
                window.location="/"
                setErrorMessage("")
            }).catch(err => {
            console.error(err)
            setLoading(false)
            setErrorMessage("Either you dont have enough money in your wallet or something else went wrong.")
        })
    }

    const handleMint2=() => {
        setLoading(true)
        // TODO user cand buy more then 1 token?
        const total=(amountToMint * price2).toString()
        const totaltokens=Web3.utils.toWei(total, 'ether')
        const totalToHex=Web3.utils.toHex(totaltokens)


        voodooContract2.methods
            .buy(amountToMint)
            .send({value: totalToHex, from: account})
            .then(() => {
                window.alert("Tranzactie efectuata cu succes.")
                setLoading(false)
                window.location="/"
                setErrorMessage("")
            }).catch(err => {
            console.error(err)
            setLoading(false)
            setErrorMessage("Either you dont have enough money in your wallet or something else went wrong.")
        })
    }

    useEffect(() => {
        loadBlockchainData()
    }, [])

    useEffect(() => {
        if(voodooContract !== null){
            voodooContract.methods.totalSupply().call({from: account}).then(function (result){
                setbalance(result)
            })
        }
    }, [voodooContract, account])

    useEffect(() => {
        if(voodooContract2 !== null){
            voodooContract2.methods.totalSupply().call({from: account}).then(function (result){
                setbalance2(result)
            })
        }
    }, [voodooContract2, account])

    // useEffect(() => {
    //     const voodooData=localStorage.getItem("voodooStorage")
    //     if(!voodooData){
    //         localStorage.setItem("voodooStorage", JSON.stringify(0))
    //     }else{
    //         setVoodooTokens(JSON.parse(voodooData))
    //     }
    // }, [])

    // useEffect(() => {
    //     if(userNetId){
    //         if(userNetId !== 1){
    //             setUserNetId(null)
    //             setaccount(null)
    //             alert("Please connect to main network in order to buy.")
    //         }
    //     }
    // }, [userNetId])


    return (
        <div style={{height: "100%"}}>

            {/* Header */}
            <div className="row p-3">
                <div className={"col-12 col-lg-4"}><img src={logoVault} className={"voodooVaultLogo"}/></div>
                <div className={"col-12 col-lg-4"}><img src={logoVoodoo} style={{
                    width: 50,
                    height: 50,
                    display: "block",
                    margin: "0 auto"
                }}/></div>
                <div className={"col-12 col-lg-4"}></div>
            </div>
            <br/>
            <div style={{ borderTop:"5px solid rgba(255,255,255, .5)", maxWidth:400, margin:"0 auto", borderRadius:5}}></div>
            <br/>

            {/* Mint page description */}
            <p className={"text-center"} style={{color: "#FFF", padding: 20}}>A Voodoo Vault: Access Pass [Phase 0] is
                step one in getting you set up <br/> as an owner in the Voodoo ecosystem. You will use this Access Pass
                as a mint pass<br/> to our genesis drop, however, it is more than a mint pass. Your Access Pass will be
                the key <br/> to how you connect to and derive value from the Voodoo Vault ecosystem.<br/> You can think
                of it as an all-access pass to everything Voodoo.
            </p>
            <br/>
            <div style={{ borderTop:"5px solid rgba(255,255,255, .5)", maxWidth:400, margin:"0 auto", borderRadius:5}}></div>
            <br/>
            <br/>
            <br/>

            <div className={"container"}>
                <div className={"row m-2"} style={{ border:"5px solid rgba(255,255,255, .5)" , padding:20}}>
                    <div className={"col-12 col-lg-5 text-center text-wrap"}>
                        <h1 className={"text-center"} style={{fontWeight: 900, color: "#FFF"}}>MINT NFT</h1><br/>
                        <p className={"text-center spaceBottomOnMobile"} style={{color: "#FFF"}}>{ pass === 1 ? balance : balance2}/10.000
                            MINTED</p><br/>

                        {/* Connect to wallet button */}
                        <button
                            type="button"
                            className="btn btn-primary w-100 spaceBottomOnMobile"
                            onClick={() => handleConnectWallet()}
                            disabled={account}
                            style={{
                                color: "#000",
                                background: "#FFF",
                                padding: "10px",
                                fontWeight: 800,
                                border: "none"
                            }}>
                            {!account ? "CONNECT WALLET" : "WALLET CONNECTED"}
                        </button>
                        <br/><br/><br/>

                        {/* Values to mint */}
                        <div style={{display: "flex", justifyContent: "space-around"}}>
                            <p style={{display: "inline-block"}} onClick={() => {
                                setamountToMint(1)
                                setErrorMessage(null)
                            }}>
                                <img src={coinImage} style={{
                                    width: 50,
                                    height: 50,
                                    display: "inline-block",
                                    marginBottom: "-18px",
                                    marginRight: "5px"
                                }}/>
                                <p style={{
                                    color: amountToMint === 1 ? "#FFD300" : "#FFF",
                                    fontWeight: 800,
                                    fontSize: 20,
                                    display: "inline-block"
                                }}

                                >x 1</p>
                            </p>
                            <p style={{display: "inline-block"}} onClick={() => {
                                setamountToMint(2)
                                setErrorMessage(null)
                            }}>
                                <img src={coinImage} style={{
                                    width: 50,
                                    height: 50,
                                    display: "inline-block",
                                    marginBottom: "-18px",
                                    marginRight: "5px"
                                }}/>
                                <p style={{
                                    color: amountToMint === 2 ? "#FFD300" : "#FFF",
                                    fontWeight: 800,
                                    fontSize: 20,
                                    display: "inline-block"
                                }}

                                >x 2</p>
                            </p>
                            <p style={{display: "inline-block"}} onClick={() => {
                                setamountToMint(3)
                                setErrorMessage(null)
                            }}>
                                <img src={coinImage} style={{
                                    width: 50,
                                    height: 50,
                                    display: "inline-block",
                                    marginBottom: "-18px",
                                    marginRight: "5px"
                                }}/>
                                <p style={{
                                    color: amountToMint === 3 ? "#FFD300" : "#FFF",
                                    fontWeight: 800,
                                    fontSize: 20,
                                    display: "inline-block"
                                }}

                                >x 3</p>
                            </p>

                        </div>

                        <br/>
                        <br/>

                        {/* Mint amount */}
                        <hr style={{color: "#FFF", border: "1px solid #FFF"}}/>
                        <p style={{display: "flex", justifyContent: "space-between"}}>
                            <span style={{color: "#FFF", fontWeight: 900}}>TOTAL</span>
                            <span style={{color: "#FFF"}}> { pass === 1 ? amountToMint * price : amountToMint * price2} ETH</span>
                        </p>
                        <hr style={{display: "block", color: "#FFF", border: "1px solid #FFF"}}/>

                        {/* Buy button*/}
                        <button
                            type="button"
                            className="btn btn-primary w-100 spaceBottomOnMobile"
                            onClick={() => pass === 1 ? handleMint() : handleMint2()}
                            disabled={loading || voodooTokens === 3 || balance === limit || !account}
                            style={{
                                color: "#FFF",
                                background: "#FFD300",
                                padding: "10px",
                                fontWeight: 800,
                                border: "none"
                            }}>
                            {!loading ? "BUY" : "LOADING"}{loading &&
                        <Spinner animation="border" role="status" style={{width: 20, height: 20}}></Spinner>}
                        </button>
                        <br/>

                        {serrorMessage && <p style={{color: "red", fontWeight: 600}}>{serrorMessage}</p>}
                        {voodooTokens === 3 &&
                        <p style={{color: "#ff0000"}}>Ai atins limita de tokens pentru userul tau.</p>}
                        {balance === limit &&
                        <p style={{color: "#ff0000"}}>S-a atins limita de tokens pentru vanzare.</p>}
                    </div>
                    <div className={"col-12 col-lg-2"}></div>
                    <div className={"col-12 col-lg-5"} style={{ position:"relative", height:400}}>

                        {/* Pass image */}
                        <img src={ pass === 1 ? normalPassImage : brokenPassImage } style={{display: "block", maxWidth: "80%", margin: "auto",}}/>

                        {/* Select pass */}
                        <div style={{display: "flex"}}>
                            <button style={{
                                background: pass === 1 ? "#FFF" : "#FFD300",
                                color: pass === 1 ? "#000" : "#FFF",
                                border:"none",
                                width:"100%",
                                padding:15,
                                fontWeight:800
                            }}
                                onClick={() => setPass(1)}
                            >NORAMALL PASS</button>
                            <button style={{
                                background: pass === 2 ? "#FFF" : "#FFD300",
                                color: pass === 2 ? "#000" : "#FFF",
                                border:"none",
                                width:"100%",
                                padding:15,
                                fontWeight:800
                            }}
                                onClick={() => setPass(2)}
                            >BROKEN PASS</button>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <footer style={{maxWidth: 300, display: "flex", margin: "0 auto", justifyContent: "space-between",  border:"5px solid rgba(255,255,255, .5)", padding:"5px 20px", borderRadius: 100}}>
                <a href={"https://discord.com/invite/voodoovlt"}> <img src={discordLogo}/></a>
                <a href={"https://music.apple.com/ro/album/voodoo/1603420607?l=ro"}> <img src={appleLogo}/></a>
                <a href={"https://open.spotify.com/artist/0GoJXmDr5UBG8ValCZe4om"}> <img src={spotifyLogo}/></a>
                <a href={"https://www.youtube.com/c/Ianixxx"}> <img src={youtubeLogo}/></a>
                <a href={"https://www.instagram.com/nusuntian/"}> <img src={instagramLogo}/></a>
                <a href={"https://www.tiktok.com/@nusuntian"}> <img src={tiktokLogo}/></a>
            </footer>
            <br/>
            <br/>
        </div>
    );
}

export default App;

