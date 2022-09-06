import './App.css';
import {useEffect, useState} from "react";
import {ethers} from "ethers";
import {CONTRACT_ABI, CONTRACT_ADDRESS} from "./config";
import {displayErrorMessage, displayMessage} from "./helper";
import Header from "./components/Header";
const defaultForm = {
    type:"all",
    delegate: "",
    contract: "",
    tokenId:"",
    value: true,
}
const successMessage = "The transaction has been initiated successfully! Please check metamask for the latest status of your transaction";

function App() {
    let provider,signer,web3Provider,contract;
    const [delegateAddress, setDelegateAddress] = useState([]);
    const [account, setAccount] = useState("");
    const [formData, setFormData] = useState({
        type:"all",
        delegate: "",
        contract: "",
        tokenId:"",
        value: true,
    });
    const [formLoader, setFormLoader] = useState(false);

    const setInputVal = name => {
        return ({target: {value}}) => {
            setFormData(oldValues => ({...oldValues, [name]: value}));
        }
    };
    const handleChange = (e) => {
        console.log(e)
        setFormData(oldValues => ({...oldValues, value: e.target.checked}));
    };

    useEffect(() => {
        if(account !== "" && typeof account !== "undefined"){
           getDelegatedAddresses().then()
        }else{
            setDelegateAddress([]);
        }
    }, [account]);

    const getDelegatedAddresses = async () => {
        web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);
        signer = web3Provider.getSigner();
        contract.connect(signer)
            .getDelegatesForAll(account)
            .then((result) => {
                setDelegateAddress(result);
            }).catch(function (err) {
            handleException(err)
        });
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        // Check Validation
        if (!ethers.utils.isAddress(formData.delegate)) {
            displayErrorMessage('Please enter valid Delegate address')
            return
        }
        if (formData.type === "contract" && !ethers.utils.isAddress(formData.contract)) {
            displayErrorMessage('Please enter valid contract address')
            return
        }
        if (formData.type === "token" && formData.tokenId === "") {
            displayErrorMessage('Please enter tokenId')
            return
        }
        try {
            if (window.ethereum) {
                web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Provider);
                signer = web3Provider.getSigner();
                setFormLoader(true);
                switch (formData.type) {
                case "all":
                    contract.connect(signer)
                        .delegateForAll(formData.delegate, formData.value)
                        .then((result) => {
                            console.log(result);
                            setFormLoader(false);
                            if (result) {
                                displayMessage(successMessage)
                                setFormData(defaultForm)
                            } else {
                                displayErrorMessage(result.message)
                            }
                        }).catch(function (err) {
                        handleException(err)
                    });
                    break;
                case "contract":
                    contract.connect(signer)
                        .delegateForContract(formData.delegate, formData.contract, formData.value)
                        .then((result) => {
                            setFormLoader(false);
                            if (result) {
                                displayMessage(successMessage)
                                setFormData(defaultForm)
                            } else {
                                displayErrorMessage(result.message)
                            }
                        }).catch(function (err) {
                        handleException(err)
                    });
                    break;
                case "token":
                    contract.connect(signer)
                        .delegateForToken(formData.delegate, formData.contract, formData.tokenId, formData.value)
                        .then((result) => {
                            setFormLoader(false);
                            if (result) {
                                displayMessage(successMessage)
                                setFormData(defaultForm)
                            } else {
                                displayErrorMessage(result.message)
                            }
                        }).catch(function (err) {
                        handleException(err)
                    });
                    break;
                default:
            }
            } else {
                displayErrorMessage("Please connect wallet first!");
            }
        } catch(e) {
            handleException(e);
        }
    }

    const handleException = (e) => {
        setFormLoader(false);
        if (e.code === 4001) {
            displayErrorMessage("Transaction Cancelled!")
        } else if(e.code === -32603) {
            displayErrorMessage("Transaction Failed. Please check metamask")
        } else {
            displayErrorMessage("Please connect your wallet!");
        }
    }

    return (
        <section className="d-flex align-items-center bg-primary vh-100">
            <div className="container">
                <Header updateAccount={setAccount}/>
                <div className="row">
                    <div className="col-lg-6 offset-lg-3">

                        { (delegateAddress.length > 0) ?
                            <div className="sl-card mb-3">
                                <div className="row">
                                    <div className="col-md-12 text-left">
                                        <h5>Delegated Addresses</h5>
                                        <ul className="">
                                            {delegateAddress.map(obj => {
                                                return (
                                                    <li key={obj}>
                                                        {obj}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            : null }

                        <div className="sl-card ">
                            <form onSubmit={handleFormSubmit}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <select className="form-control form-select" onChange={setInputVal("type")}>
                                            <option value="all">Delegate For All</option>
                                            <option value="contract">Delegate For Contract</option>
                                            <option value="token">Delegate For Token</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <input type="text"
                                               required
                                               name="delegate"
                                               onChange={setInputVal("delegate")}
                                               value={formData.delegate}
                                               className="form-control text"
                                               placeholder="Delegate address" />
                                    </div>
                                </div>

                                { formData.type === "contract" || formData.type === "token" ?
                                    <div className="row">
                                        <div className="col-md-12">
                                            <input type="text"
                                                   required
                                                   name="contract"
                                                   value={formData.contract}
                                                   onChange={setInputVal("contract")}
                                                   className="form-control text"
                                                   placeholder="Contract address" />
                                        </div>
                                    </div>
                                    : null }

                                { formData.type === "token" ?
                                    <div className="row">
                                        <div className="col-md-12">
                                            <input type="number"
                                                   required
                                                   name="tokenId"
                                                   value={formData.tokenId}
                                                   onChange={setInputVal("tokenId")}
                                                   className="form-control text"
                                                   placeholder="TokenId" />
                                        </div>
                                    </div>
                                    : null }

                                <div className="row justify-content-md-center mb-30">
                                    <label className="col-sm-2 col-form-label">Undelegate</label>

                                    <div className="col-sm-2">
                                        <div className="button r" id="button-2">
                                            <input type="checkbox" className="checkbox" checked={formData.value} onChange={e => handleChange(e)}/>
                                            <div className="knobs"/>
                                            <div className="layer"/>
                                        </div>
                                    </div>
                                    <label className="col-sm-2 col-form-label">Delegate</label>
                                </div>

                                <div className="col-md-12">
                                    {!formLoader ? (
                                        <button type="submit" className="btn d-block w-100 text-uppercase mt-3">
                                            Delegate
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn d-block w-100 text-uppercase mt-3" disabled>
                                            Delegating...
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className="text-right">
                            <a className="link" target="_blank"
                               href={`https://goerli.etherscan.io/address/`+ CONTRACT_ADDRESS} rel="noreferrer">
                                goerli.etherscan.io
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default App;