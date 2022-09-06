import logo from "../logo.svg";
import {useState,useEffect} from "react";
export const themes = {
    dark: "",
    light: "white-layout",
};

function Header(props) {
    const currentTheme = localStorage.getItem("delegate-theme");
    const [darkMode, setDarkMode] = useState(currentTheme === 'null' || typeof currentTheme == "object");
    const [theme, setTheme] = useState(currentTheme);
    const [account, setAccount] = useState("");

    const changeTheme = (theme) => {
        setTheme(theme);
        switch (theme) {
            case themes.light:
                document.body.classList.add('white-layout');
                localStorage.setItem("delegate-theme","white-layout");
                break;
            case themes.dark:
            default:
                document.body.classList.remove('white-layout');
                localStorage.setItem("delegate-theme",null);
                break;
        }
    }
    useEffect(() => {
        changeTheme(theme)
    }, [theme]);

    useEffect(() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            if (window.localStorage.getItem("delegate-connected")) {
                connect().then()
            }
        }
    }, []);

    window.ethereum.on('accountsChanged', function (accounts) {
        if(account == null){
            window.localStorage.removeItem("delegate-connected")
        }else {
            setAccount(accounts[0]);
            props.updateAccount(accounts[0]);
        }
    });

    async function connect() {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x5'}]});
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        setAccount(accounts[0]);
        props.updateAccount(accounts[0]);
        window.localStorage.setItem("delegate-connected","injected");
    }

    return (
        <div id="header">
            {account ?
                <button onClick={connect} className="btn d-block text-uppercase mt-3 top-right">
                    <span className="align-middle">{account.slice(0, 6)} ... {account.slice(account.length - 4)} &nbsp;</span>
                    <img className="align-middle" src={logo} alt="metamask" height="25px"/>
                </button>
                :
                <button onClick={connect} className="btn d-block text-uppercase mt-3 top-right">
                    <span className="align-middle"> Connect Metamask </span>
                    <img className="align-middle" src={logo} alt="metamask" height="25px"/>
                </button>
            }
            <div className="row">
                <div className="col-md-12">
                    <h3 className="section-title">delegate.cash</h3>
                </div>
            </div>
            <label className="theme-setting">
                    <input className='toggle-checkbox' type='checkbox' checked={darkMode} onChange={() => {
                    setDarkMode(!darkMode);
                    setTheme(darkMode ? themes.light : themes.dark);
                }} />
                <div className='toggle-slot'>
                    <div className='sun-icon-wrapper'>
                        <div className="iconify sun-icon" data-icon="feather-sun" data-inline="false"/>
                    </div>
                    <div className='toggle-button'/>
                    <div className='moon-icon-wrapper'>
                        <div className="iconify moon-icon" data-icon="feather-moon" data-inline="false"/>
                    </div>
                </div>
            </label>
        </div>
    )
}

export default Header