import React, { useState, useEffect } from 'react';
import TripService from "../../services/TripService.js";

const TripSummaryCards = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedCards, setExpandedCards] = useState({});
    const [vehicleId, setVehicleId] = useState(1);

    const fetchTripSummaries = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = localStorage.getItem("userId")
            const response = await TripService.tripHistory(userId);
            if (response.status != 200) {
                throw new Error('Failed to fetch trip summaries');
            }
            const data = await response.data;
            setTrips(data);
        } catch (err) {
            setError(err.message);
            // Mock data for demonstration
            setTrips([
                {
                    tripNo: "T001",
                    driveScore: 85,
                    maxSpeed: 75,
                    avgSpeed: 45,
                    maxAcceleration: 2.3,
                    distanceTravelled: 25.5,
                    isRainy: false,
                    isDay: true
                },
                {
                    tripNo: "T002",
                    driveScore: 92,
                    maxSpeed: 68,
                    avgSpeed: 52,
                    maxAcceleration: 1.8,
                    distanceTravelled: 18.2,
                    isRainy: true,
                    isDay: false
                },
                {
                    tripNo: "T003",
                    driveScore: 78,
                    maxSpeed: 82,
                    avgSpeed: 38,
                    maxAcceleration: 3.1,
                    distanceTravelled: 32.7,
                    isRainy: false,
                    isDay: true
                },
                {
                    tripNo: "T004",
                    driveScore: 88,
                    maxSpeed: 60,
                    avgSpeed: 42,
                    maxAcceleration: 2.0,
                    distanceTravelled: 15.8,
                    isRainy: true,
                    isDay: true
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const toggleCardExpansion = (tripNo) => {
        setExpandedCards(prev => ({
            ...prev,
            [tripNo]: !prev[tripNo]
        }));
    };

    const getScoreColor = (score) => {
        if (score >= 85) return '#10b981';
        if (score >= 70) return '#f59e0b';
        return '#ef4444';
    };

    const getSpeedColor = (speed) => {
        if (speed > 80) return '#ef4444';
        if (speed > 60) return '#f59e0b';
        return '#10b981';
    };

    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem 1rem'
        },
        contentWrapper: {
            maxWidth: '1200px',
            margin: '0 auto'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem',
            color: 'white'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        },
        controlsWrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
        },
        input: {
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            width: '120px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        loadButton: {
            padding: '0.75rem 1.5rem',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            transform: loading ? 'none' : 'translateY(0)',
        },
        alert: {
            background: 'rgba(255,255,255,0.9)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
        },
        cardsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
        },
        card: {
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        },
        cardHeader: {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        cardTitle: {
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '700'
        },
        badges: {
            display: 'flex',
            gap: '0.5rem'
        },
        badge: {
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600'
        },
        cardBody: {
            padding: '1.5rem'
        },
        scoreSection: {
            textAlign: 'center',
            marginBottom: '1.5rem'
        },
        scoreBadge: {
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
        },
        statCard: {
            background: '#f8fafc',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
        },
        statValue: {
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.25rem'
        },
        statLabel: {
            fontSize: '0.875rem',
            color: '#64748b'
        },
        expandButton: {
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        },
        detailsSection: {
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #e2e8f0',
            animation: 'fadeIn 0.3s ease'
        },
        detailsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem'
        },
        detailItem: {
            marginBottom: '0.5rem'
        },
        detailLabel: {
            fontSize: '0.875rem',
            color: '#64748b',
            fontWeight: '600'
        },
        detailValue: {
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
        },
        conditionsCard: {
            background: '#f1f5f9',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem'
        },
        emptyState: {
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'white'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.contentWrapper}>
                <div style={styles.header}>
                    <h1 style={styles.title}>🚗 Trip Dashboard</h1>
                    <div style={styles.controlsWrapper}>
                        <input
                            type="number"
                            style={styles.input}
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            placeholder="Vehicle ID"
                        />
                        <button
                            style={styles.loadButton}
                            onClick={fetchTripSummaries}
                            disabled={loading}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                                }
                            }}
                        >
                            {loading ? '⏳ Loading...' : '🔄 Load Trips'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div style={styles.alert}>
                        <strong>🎮 Demo Mode:</strong> Using sample data. In production, this would fetch from your API endpoint.
                    </div>
                )}

                {trips.length === 0 && !loading && (
                    <div style={styles.emptyState}>
                        <h3>Click "Load Trips" to fetch trip summaries</h3>
                    </div>
                )}

                <div style={styles.cardsGrid}>
                    {trips.map((trip, index) => (
                        <div
                            key={trip.tripNo}
                            style={styles.card}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Trip {trip.tripNo}</h3>
                                <div style={styles.badges}>
                                    {trip.isRainy && (
                                        <span style={{...styles.badge, background: '#06b6d4'}}>
                      🌧️ Rainy
                    </span>
                                    )}
                                    <span style={{
                                        ...styles.badge,
                                        background: trip.isDay ? '#f59e0b' : '#374151'
                                    }}>
                    {trip.isDay ? '☀️ Day' : '🌙 Night'}
                  </span>
                                </div>
                            </div>

                            <div style={styles.cardBody}>
                                <div style={styles.scoreSection}>
                                    <div
                                        style={{
                                            ...styles.scoreBadge,
                                            background: getScoreColor(trip.driveScore)
                                        }}
                                    >
                                        Score: {trip.driveScore}
                                    </div>
                                    <div style={{fontSize: '0.875rem', color: '#64748b'}}>Drive Score</div>
                                </div>

                                <div style={styles.statsGrid}>
                                    <div style={styles.statCard}>
                                        <div
                                            style={{
                                                ...styles.statValue,
                                                color: getSpeedColor(trip.maxSpeed)
                                            }}
                                        >
                                            {trip.maxSpeed}
                                        </div>
                                        <div style={styles.statLabel}>Max Speed (km/h)</div>
                                    </div>
                                    <div style={styles.statCard}>
                                        <div style={{...styles.statValue, color: '#3b82f6'}}>
                                            {trip.distanceTravelled}
                                        </div>
                                        <div style={styles.statLabel}>Distance (km)</div>
                                    </div>
                                </div>

                                <button
                                    style={styles.expandButton}
                                    onClick={() => toggleCardExpansion(trip.tripNo)}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'scale(1.05)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    {expandedCards[trip.tripNo] ? '📈 Hide Details ▲' : '📊 Show Details ▼'}
                                </button>

                                {expandedCards[trip.tripNo] && (
                                    <div style={styles.detailsSection}>
                                        <div style={styles.detailsGrid}>
                                            <div style={styles.detailItem}>
                                                <div style={styles.detailLabel}>Avg Speed:</div>
                                                <div style={{...styles.detailValue, color: '#3b82f6'}}>
                                                    {trip.avgSpeed} km/h
                                                </div>
                                            </div>
                                            <div style={styles.detailItem}>
                                                <div style={styles.detailLabel}>Max Acceleration:</div>
                                                <div style={{...styles.detailValue, color: '#10b981'}}>
                                                    {trip.maxAcceleration} m/s²
                                                </div>
                                            </div>
                                        </div>

                                        <div style={styles.conditionsCard}>
                                            <div style={styles.detailLabel}>Trip Conditions:</div>
                                            <div style={{marginTop: '0.5rem'}}>
                        <span style={{
                            ...styles.badge,
                            background: trip.isRainy ? '#3b82f6' : '#64748b',
                            color: 'white',
                            marginRight: '0.5rem'
                        }}>
                          {trip.isRainy ? '🌧️ Rainy Weather' : '☀️ Clear Weather'}
                        </span>
                                                <span style={{
                                                    ...styles.badge,
                                                    background: trip.isDay ? '#f59e0b' : '#374151',
                                                    color: 'white'
                                                }}>
                          {trip.isDay ? '☀️ Daytime' : '🌙 Nighttime'}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default TripSummaryCards;