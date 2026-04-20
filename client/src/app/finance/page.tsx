'use client';

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Plus, TrendingUp, PieChart, Wallet, ArrowUpRight, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { financeApi } from '@/lib/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const FinancePage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await financeApi.getAll('USER_01');
        setEntries(res.data);
      } catch (err) {
        console.error('FETCH_FAILED:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const addEntry = async (entry: any) => {
    try {
      const res = await financeApi.create({ ...entry, user_id: 'USER_01' });
      setEntries([res.data, ...entries]);
    } catch (err) {
      console.error('ADD_FAILED:', err);
    }
  };

  const totalNeeds = entries.filter(t => t.category === 'Need').reduce((acc, curr) => acc + curr.cost, 0);
  const totalWants = entries.filter(t => t.category === 'Want').reduce((acc, curr) => acc + curr.cost, 0);
  const totalSavings = entries.filter(t => t.category === 'Saving').reduce((acc, curr) => acc + curr.cost, 0);

  const chartData = {
    labels: ['NEEDS', 'WANTS', 'SAVINGS'],
    datasets: [{
      data: [totalNeeds, totalWants, totalSavings],
      backgroundColor: ['#39FF14', '#00F0FF', '#FFB000'],
      borderColor: '#121212',
      borderWidth: 2,
      hoverOffset: 10,
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleFont: { family: 'JetBrains Mono' },
        bodyFont: { family: 'JetBrains Mono' },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    maintainAspectRatio: false,
    cutout: '70%',
  };

  return (
    <div className="financial-sanctuary">
      <header className="sanctuary-header">
        <div className="header-text">
          <h1 className="mono">FINANCIAL_SANCTUARY</h1>
          <p className="mono text-dim">ASSET_LIQUIDITY_MONITOR_v1.0</p>
        </div>
        <button className="neon-btn cyan mono"><Plus size={16} /> ADD_ENTRY</button>
      </header>

      <div className="sanctuary-grid">
        <div className="ledger-column">
          <section className="neon-card ledger-card">
            <div className="card-header">
              <Database size={18} className="text-glow-cyan" />
              <h2 className="mono">LEDGER_STREAM</h2>
            </div>
            
            <div className="table-wrapper">
              <table className="sanctuary-table mono">
                <thead>
                  <tr>
                    <th>IDENTIFIER</th>
                    <th>CLASS</th>
                    <th>MAGNITUDE</th>
                    <th>PROTOCOL</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="ledger-row">
                      <td>{entry.item_name}</td>
                      <td><span className={`class-tag ${entry.category.toLowerCase()}`}>{entry.category}</span></td>
                      <td className="magnitude">₮ {Number(entry.cost).toFixed(2)}</td>
                      <td className="text-dim">{entry.payment_mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="analytics-column">
          <motion.div 
            className="neon-card liquidity-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="liquidity-content">
              <span className="mono text-dim label">TOTAL_LIQUIDITY</span>
              <div className="balance-row">
                <span className="mono balance-value">₮ 4,520.00</span>
                <TrendingUp size={20} className="text-glow-green" />
              </div>
              <div className="delta-stat mono text-glow-green">+12.4%_SYNSECT</div>
            </div>
          </motion.div>

          <div className="neon-card distribution-card">
            <h3 className="mono section-title">ALLOCATION_PROTOCOL</h3>
            <div className="chart-container">
              <Pie data={chartData} options={chartOptions} />
              <div className="chart-overlay mono">
                <span className="text-glow-cyan">{(totalSavings / (totalNeeds + totalWants + totalSavings) * 100).toFixed(0)}%</span>
                <small className="text-dim">SAVINGS</small>
              </div>
            </div>
            
            <div className="custom-legend mono">
              <div className="legend-item">
                <div className="dot green"></div> 
                <span>NEEDS:</span> 
                <span className="val">₮{totalNeeds}</span>
              </div>
              <div className="legend-item">
                <div className="dot cyan"></div> 
                <span>WANTS:</span> 
                <span className="val">₮{totalWants}</span>
              </div>
              <div className="legend-item">
                <div className="dot amber"></div> 
                <span>SAVINGS:</span> 
                <span className="val">₮{totalSavings}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .financial-sanctuary {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .sanctuary-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }

        .sanctuary-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .ledger-row:hover { background: rgba(255, 255, 255, 0.02); }

        .sanctuary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin-top: 1rem;
        }

        .sanctuary-table th {
          text-align: left;
          padding: 1rem;
          color: var(--text-dim);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sanctuary-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .class-tag {
          padding: 2px 8px;
          border-radius: 2px;
          font-size: 0.7rem;
          border: 1px solid currentColor;
        }

        .class-tag.need { color: var(--neon-green); }
        .class-tag.want { color: var(--neon-cyan); }
        .class-tag.saving { color: var(--neon-amber); }

        .magnitude { font-weight: 700; color: var(--text-primary); }

        .analytics-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .liquidity-card {
          background: linear-gradient(135deg, #121212 0%, #080808 100%);
          border-left: 4px solid var(--neon-green);
        }

        .balance-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.5rem 0;
        }

        .balance-value { font-size: 1.75rem; font-weight: 700; }
        .delta-stat { font-size: 0.7rem; }

        .section-title { font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-dim); }

        .chart-container {
          position: relative;
          height: 200px;
          margin-bottom: 2rem;
        }

        .chart-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }

        .chart-overlay .big-number { font-size: 1.5rem; }

        .custom-legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.75rem;
        }

        .legend-item { display: flex; align-items: center; gap: 0.75rem; }
        .dot { width: 8px; height: 8px; border-radius: 1px; }
        .dot.green { background: var(--neon-green); box-shadow: 0 0 5px var(--neon-green); }
        .dot.cyan { background: var(--neon-cyan); box-shadow: 0 0 5px var(--neon-cyan); }
        .dot.amber { background: var(--neon-amber); box-shadow: 0 0 5px var(--neon-amber); }

        .legend-item .val { margin-left: auto; color: var(--text-primary); }

        .neon-btn.cyan { border-color: var(--neon-cyan); color: var(--neon-cyan); }
        .neon-btn:hover { background: rgba(0, 240, 255, 0.1); box-shadow: 0 0 10px var(--neon-cyan-glow); }
      `}</style>
    </div>
  );
};

export default FinancePage;
