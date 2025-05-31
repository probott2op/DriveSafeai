import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';

export default function InsurancePremiumDisplay() {
    const [insuranceData, setInsuranceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);
    const [animateNumbers, setAnimateNumbers] = useState(false);

    useEffect(() => {
        const fetchInsuranceData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const data = await UserService.getInsurance(userId);
                setInsuranceData(data);
                setLoading(false);
                setTimeout(() => setAnimateNumbers(true), 500);
            } catch (error) {
                console.error('Error fetching insurance data:', error);
                // Mock data for demonstration
                setInsuranceData({
                    policyId: 12345678,
                    riskScore: 7.8,
                    riskCategory: "MEDIUM",
                    basePremium: 1200.50,
                    riskMultiplier: 1.25,
                    finalPremium: 1500.63
                });
                setLoading(false);
                setTimeout(() => setAnimateNumbers(true), 500);
            }
        };

        fetchInsuranceData();
    }, []);

    const getRiskColor = (category) => {
        switch(category?.toLowerCase()) {
            case 'low': return '#4ade80';
            case 'medium': return '#fbbf24';
            case 'high': return '#f87171';
            default: return '#6b7280';
        }
    };

    const getRiskGradient = (category) => {
        switch(category?.toLowerCase()) {
            case 'low': return 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
            case 'medium': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
            case 'high': return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
            default: return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid rgba(255,255,255,0.3)',
                    borderTop: '4px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}>
                    <style>
                        {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
                    </style>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <style>
                {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes countUp {
            from {
              opacity: 0;
              transform: scale(0.5);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 4px 20px rgba(255,255,255,0.3);
            }
            50% {
              box-shadow: 0 8px 40px rgba(255,255,255,0.5);
            }
          }
          
          .card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          }
          
          .number-animate {
            animation: ${animateNumbers ? 'countUp 0.8s ease-out' : 'none'};
          }
        `}
            </style>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                animation: 'slideInUp 0.6s ease-out'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        margin: '0 0 10px 0',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        Insurance Premium Calculator
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        opacity: '0.9',
                        margin: '0'
                    }}>
                        Policy #{insuranceData?.policyId}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    {/* Risk Score Card */}
                    <div
                        className="card"
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            animation: selectedCard === 'risk' ? 'glow 2s infinite' : 'none'
                        }}
                        onClick={() => setSelectedCard(selectedCard === 'risk' ? null : 'risk')}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <span style={{ color: 'white', fontSize: '24px' }}>⚡</span>
                            </div>
                            <h3 style={{
                                margin: '0',
                                fontSize: '1.4rem',
                                color: '#333'
                            }}>Risk Assessment</h3>
                        </div>

                        <div style={{
                            background: getRiskGradient(insuranceData?.riskCategory),
                            borderRadius: '15px',
                            padding: '20px',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '10px'
                            }}>
                                <span style={{ fontWeight: 'bold', color: '#333' }}>Risk Score</span>
                                <span
                                    className="number-animate"
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                        color: getRiskColor(insuranceData?.riskCategory)
                                    }}
                                >
                  {insuranceData?.riskScore}/10
                </span>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '10px',
                                height: '10px',
                                marginBottom: '15px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    background: getRiskColor(insuranceData?.riskCategory),
                                    height: '100%',
                                    width: `${(insuranceData?.riskScore / 10) * 100}%`,
                                    borderRadius: '10px',
                                    transition: 'width 1s ease-out',
                                    animation: animateNumbers ? 'slideInUp 1s ease-out 0.3s both' : 'none'
                                }}></div>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                <span style={{
                    background: getRiskColor(insuranceData?.riskCategory),
                    color: 'white',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                  {insuranceData?.riskCategory} RISK
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Premium Calculation Card */}
                    <div
                        className="card"
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            cursor: 'pointer',
                            animation: selectedCard === 'premium' ? 'glow 2s infinite' : 'none'
                        }}
                        onClick={() => setSelectedCard(selectedCard === 'premium' ? null : 'premium')}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px'
                            }}>
                                <span style={{ color: 'white', fontSize: '24px' }}>💰</span>
                            </div>
                            <h3 style={{
                                margin: '0',
                                fontSize: '1.4rem',
                                color: '#333'
                            }}>Premium Breakdown</h3>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px',
                                padding: '15px',
                                background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                                borderRadius: '10px'
                            }}>
                                <span style={{ fontWeight: '600', color: '#333' }}>Base Premium</span>
                                <span
                                    className="number-animate"
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#4ecdc4'
                                    }}
                                >
                  ${insuranceData?.basePremium}
                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px',
                                padding: '15px',
                                background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                                borderRadius: '10px'
                            }}>
                                <span style={{ fontWeight: '600', color: '#333' }}>Risk Multiplier</span>
                                <span
                                    className="number-animate"
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#fdcb6e'
                                    }}
                                >
                  ×{insuranceData?.riskMultiplier}
                </span>
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            borderRadius: '15px',
                            padding: '20px',
                            textAlign: 'center',
                            animation: selectedCard === 'premium' ? 'pulse 1s infinite' : 'none'
                        }}>
                            <div style={{ color: 'white', marginBottom: '10px' }}>
                                <span style={{ fontSize: '1rem', opacity: '0.9' }}>Final Premium</span>
                            </div>
                            <div
                                className="number-animate"
                                style={{
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                ${insuranceData?.finalPremium}
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.8)',
                                marginTop: '5px'
                            }}>
                                per month
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Summary */}
                <div
                    className="card"
                    style={{
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '20px',
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <h2 style={{
                        color: '#333',
                        marginBottom: '20px',
                        fontSize: '2rem'
                    }}>
                        Policy Summary
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginTop: '20px'
                    }}>
                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                            borderRadius: '15px',
                            animation: 'slideInUp 0.6s ease-out 0.2s both'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📋</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Policy ID</div>
                            <div style={{ fontSize: '1.2rem', color: '#666' }}>{insuranceData?.policyId}</div>
                        </div>

                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                            borderRadius: '15px',
                            animation: 'slideInUp 0.6s ease-out 0.4s both'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Risk Level</div>
                            <div style={{ fontSize: '1.2rem', color: '#666' }}>{insuranceData?.riskCategory}</div>
                        </div>

                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #d299c2, #fef9d7)',
                            borderRadius: '15px',
                            animation: 'slideInUp 0.6s ease-out 0.6s both'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💳</div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>Monthly Payment</div>
                            <div style={{ fontSize: '1.2rem', color: '#666' }}>${insuranceData?.finalPremium}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}