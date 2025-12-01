import React, { useState, useEffect } from 'react';
import { FaWallet, FaRocket, FaLandmark, FaExchangeAlt, FaQuestionCircle, FaBolt, FaLock, FaTwitter, FaGithub, FaDiscord, FaUsers, FaGlobe,  FaPercent, FaEye, FaMobileAlt  } from "react-icons/fa";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import CryptoBankABI from '../utils/CryptoBank.json';
import '../App.css';
// Baaki imports ke neeche
import web3Img from '../assets/web3.png'; 

// --- ADDRESS UPDATE KARO ---
const contractAddress = "0xe5C0C87055Ac18e9FfFC004A82409677Ab08c34c";

const DashboardPage = () => {
  // State variables same rahenge
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [bankBalance, setBankBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- CONNECT LOGIC ---
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        setErrorMessage(null);
        const providerInstance = new BrowserProvider(window.ethereum);
        const network = await providerInstance.getNetwork();
        if (network.chainId !== 11155111n) {
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }],
                });
            } catch (err) {
                alert("Please switch to Sepolia Network!");
                return;
            }
        }

        const accounts = await providerInstance.send("eth_requestAccounts", []);
        const signer = await providerInstance.getSigner();
        const contractInstance = new Contract(contractAddress, CryptoBankABI.abi, signer);

        setAccount(accounts[0]);
        setContract(contractInstance);
        updateBalance(contractInstance);

      } catch (error) {
        console.error(error);
        alert("Connection Failed!");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const updateBalance = async (contractInstance) => {
    try {
      const balance = await contractInstance.getBalance();
      setBankBalance(formatEther(balance));
      const history = await contractInstance.getHistory();
      setTransactions([...history].reverse());
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) handleConnectWallet();
        else { setAccount(null); setContract(null); }
      });
    }
  }, []);

  // --- ACTIONS ---
  const handleDeposit = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.deposit({ value: parseEther(depositAmount) });
      await tx.wait();
      updateBalance(contract);
      setDepositAmount("");
      alert("Deposit Successful!");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.withdraw(parseEther(withdrawAmount));
      await tx.wait();
      updateBalance(contract);
      setWithdrawAmount("");
      alert("Withdrawal Successful!");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleTransfer = async () => {
    if (!contract) return;
    setLoading(true);
    try {
      const tx = await contract.transferUser(transferAddress, parseEther(transferAmount));
      await tx.wait();
      updateBalance(contract);
      setTransferAmount(""); setTransferAddress("");
      alert("Sent Successfully!");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const formatAddress = (addr) => `${addr.substring(0, 5)}...${addr.substring(addr.length - 4)}`;
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      {/* --- SLIM NAVBAR --- */}
      <nav className="navbar">
        <div className="logo">
          <FaRocket /> CryptoBank
        </div>
        
        {!account && (
          <ul className="nav-links">
            <li><a onClick={() => scrollTo('home')}>Home</a></li>
            <li><a onClick={() => scrollTo('features')}>Features</a></li>
            {/* Ab ye link kaam karega */}
            <li><a onClick={() => scrollTo('about')}>About</a></li> 
            <li><a onClick={() => scrollTo('faq')}>FAQ</a></li>
          </ul>
        )}

        {account ? (
          <button className="btn-primary" style={{cursor: 'default'}}>
            <FaWallet /> {formatAddress(account)}
          </button>
        ) : (
          <button className="btn-primary" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        )}
      </nav>

      {!account ? (
        /* --- LANDING PAGE --- */
        <>
          <section id="home" className="hero-section">
            <div className="hero-content">
              <span className="hero-badge">WEB3 BANKING REIMAGINED</span>
              <h1 className="hero-title">Control Your Wealth <br /> <span className="text-gradient">Decentralized.</span></h1>
              <p className="hero-desc">
                Experience the future of finance. No banks, no delays. Deposit, withdraw, and transfer crypto instantly on the Sepolia Blockchain.
              </p>
              <button className="btn-primary btn-full-mobile" style={{padding: '1rem 2rem', fontSize: '1.1rem'}} onClick={handleConnectWallet}>
                Launch App <FaRocket style={{marginLeft: '10px'}}/>
              </button>
            </div>
                        <div className="hero-image">
              {/* Local Image use kar rahe hain */}
              <img src={web3Img} alt="DeFi Illustration" />
            </div>
          </section>

                   <section id="features" className="section-container">
            <h2 className="section-title">Power Features</h2>
            <div className="cards-grid">
              {/* Row 1 */}
              <div className="feature-card">
                <FaBolt className="feature-icon" />
                <h3>Lightning Fast</h3>
                <p>Transactions confirm in seconds. Say goodbye to 3-day bank settlements.</p>
              </div>
              <div className="feature-card">
                <FaLock className="feature-icon" />
                <h3>Vault Security</h3>
                <p>Your funds are locked in a smart contract. Only you possess the keys.</p>
              </div>
              <div className="feature-card">
                <FaExchangeAlt className="feature-icon" />
                <h3>Peer-to-Peer</h3>
                <p>Send funds directly to friends without any intermediary fees.</p>
              </div>

              {/* Row 2 (New) */}
              <div className="feature-card">
                <FaGlobe className="feature-icon" />
                <h3>Global Access</h3>
                <p>No borders. Access your bank account from any country, 24/7.</p>
              </div>
              <div className="feature-card">
                <FaPercent className="feature-icon" />
                <h3>Low Fees</h3>
                <p>Pay a fraction of a cent for transactions compared to high wire fees.</p>
              </div>
              <div className="feature-card">
                <FaEye className="feature-icon" />
                <h3>Total Transparency</h3>
                <p>Every transaction is immutable and verifiable on the public blockchain.</p>
              </div>
            </div>
          </section>

          {/* --- NEW ABOUT SECTION --- */}
          <section id="about" className="section-container" style={{background: 'rgba(0,0,0,0.2)'}}>
            <h2 className="section-title">About CryptoBank</h2>
            <div className="about-grid">
                <div className="about-text">
                    <p>
                        CryptoBank is a next-generation Decentralized Finance (DeFi) protocol built on the Ethereum blockchain. 
                        We believe that financial freedom is a fundamental human right.
                    </p>
                    <br />
                    <p>
                        Unlike traditional banks that control your money, CryptoBank is non-custodial. 
                        This means our code guarantees that <strong>only you</strong> can withdraw your funds. 
                        We are fully open-source and transparent.
                    </p>
                </div>
                <div className="about-stats">
                    <div className="stat-box">
                        <h2>100%</h2>
                        <p>Uptime</p>
                    </div>
                    <div className="stat-box">
                        <h2><FaGlobe /></h2>
                        <p>Global Access</p>
                    </div>
                    <div className="stat-box">
                        <h2>$0</h2>
                        <p>Maintenance Fees</p>
                    </div>
                    <div className="stat-box">
                        <h2><FaUsers /></h2>
                        <p>Community Driven</p>
                    </div>
                </div>
            </div>
          </section>

          <section id="faq" className="section-container">
            <h2 className="section-title">FAQ</h2>
            <div className="cards-grid">
              <div className="feature-card">
                <h4><FaQuestionCircle style={{marginRight: '10px', color: '#d946ef'}}/> Is it safe?</h4>
                <p style={{marginTop: '10px', color: '#b3b3b3'}}>Yes, we use standard OpenZeppelin contracts for maximum security.</p>
              </div>
              <div className="feature-card">
                <h4><FaQuestionCircle style={{marginRight: '10px', color: '#d946ef'}}/> Which Network?</h4>
                <p style={{marginTop: '10px', color: '#b3b3b3'}}>Currently live on Sepolia Testnet for demonstration.</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* --- DASHBOARD --- */
        <div className="dashboard-wrapper">
          <div className="balance-card">
            <h3>Total Assets</h3>
            <h1>{parseFloat(bankBalance).toFixed(4)} ETH</h1>
            <p>≈ ${(parseFloat(bankBalance) * 2600).toFixed(2)} USD</p>
          </div>

          {errorMessage && <p style={{color: 'red', textAlign: 'center'}}>{errorMessage}</p>}

          <div className="actions-grid">
            <div className="action-box">
              <h4><FaLandmark style={{marginRight: '10px', color: '#d946ef'}}/> Deposit</h4>
              <input type="number" className="custom-input" placeholder="0.00 ETH" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
              <button className="btn-primary btn-full" onClick={handleDeposit} disabled={loading}>{loading ? "Processing..." : "Deposit Now"}</button>
            </div>

            <div className="action-box">
              <h4><FaWallet style={{marginRight: '10px', color: '#d946ef'}}/> Withdraw</h4>
              <input type="number" className="custom-input" placeholder="0.00 ETH" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
              <button className="btn-primary btn-full" onClick={handleWithdraw} disabled={loading}>{loading ? "Processing..." : "Withdraw Now"}</button>
            </div>

            <div className="action-box" style={{borderColor: '#d946ef'}}>
              <h4><FaExchangeAlt style={{marginRight: '10px', color: '#d946ef'}}/> Transfer</h4>
              <input type="text" className="custom-input" placeholder="Address (0x...)" value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} />
              <input type="number" className="custom-input" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
              <button className="btn-primary btn-full" onClick={handleTransfer} disabled={loading}>{loading ? "Sending..." : "Send P2P"}</button>
            </div>
          </div>

          <div className="history-container">
            <h3 style={{marginBottom: '1rem'}}>Recent Activity</h3>
            {transactions.length === 0 ? <p style={{color: '#888'}}>No history yet.</p> : (
              <table>
                <thead>
                  <tr><th>Action</th><th>Amount</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i}>
                      <td style={{color: tx.actionType === "Deposit" || tx.actionType === "Received" ? '#4ade80' : '#f87171'}}>
                        {tx.actionType}
                      </td>
                      <td>{formatEther(tx.amount)} ETH</td>
                      <td style={{fontSize: '0.9rem', color: '#aaa'}}>{new Date(Number(tx.timestamp) * 1000).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* --- NEW PROFESSIONAL FOOTER --- */}
      <footer className="footer">
        <div className="footer-content">
            <div className="footer-brand">
                <h2><FaRocket /> CryptoBank</h2>
                <p>Building the decentralized future, one block at a time. Secure, transparent, and borderless banking for everyone.</p>
                <div className="social-icons" style={{marginTop: '1rem'}}>
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaGithub /></a>
                    <a href="#"><FaDiscord /></a>
                </div>
            </div>
            <div className="footer-links">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div className="footer-links">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Documentation</a></li>
                    <li><a href="#">Status</a></li>
                </ul>
            </div>
        </div>
        <div className="copyright">
            &copy; 2025 BrightFrame Protocol. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;