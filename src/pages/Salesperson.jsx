import React, { useState, useEffect } from 'react';
import { getSalespersonList, getSalespersonPerformance } from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';
import { FiUsers, FiDollarSign, FiShoppingCart, FiMapPin } from 'react-icons/fi';

const Salesperson = () => {
  const [list, setList] = useState([]);
  const [selectedSP, setSelectedSP] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await getSalespersonList();
      setList(res.data.data);
      if (res.data.data.length > 0) {
        handleSelectSP(res.data.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSP = async (name) => {
    try {
      setSelectedSP(name);
      setDetailsLoading(true);
      const res = await getSalespersonPerformance(name);
      setDetails(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading Salesperson Analytics...</p></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Salesperson Analytics</h1>
        <p>Analyze performance, top customers, and product focus across the sales team.</p>
      </div>

      <div className="salesperson-layout">
        {/* Left Sidebar - List */}
        <div className="salesperson-list-container">
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-light)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Leaderboard</h3>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
            {list.map((sp, idx) => (
              <div 
                key={sp._id} 
                className={`sp-card ${selectedSP === sp._id ? 'active' : ''}`}
                onClick={() => handleSelectSP(sp._id)}
                style={{ marginBottom: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div className={`rank-badge ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : 'default'}`}>
                    {idx + 1}
                  </div>
                  <div className="sp-name" style={{ margin: 0, flex: 1 }}>{sp._id}</div>
                </div>
                <div className="sp-stats">
                  <div>
                    <div className="sp-stat-label">Revenue</div>
                    <div className="sp-stat-value" style={{ color: 'var(--primary-600)' }}>{formatCurrency(sp.totalRevenue)}</div>
                  </div>
                  <div>
                    <div className="sp-stat-label">Orders</div>
                    <div className="sp-stat-value">{sp.totalOrders}</div>
                  </div>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div className="no-data">
                <FiUsers className="no-data-icon" />
                <p>No salespersons found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Details */}
        <div className="salesperson-details-container">
          {detailsLoading ? (
             <div className="loading-container" style={{ minHeight: '400px' }}><div className="spinner"></div></div>
          ) : details ? (
            <>
              {/* Top Stats */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-label">Total Revenue</div>
                  <div className="kpi-value">{formatCurrency(details.stats.totalRevenue)}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Orders</div>
                  <div className="kpi-value">{details.stats.totalOrders}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Customers</div>
                  <div className="kpi-value">{details.stats.uniqueCustomers}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Avg Order</div>
                  <div className="kpi-value">{formatCurrency(details.stats.avgOrderValue)}</div>
                </div>
              </div>

              {/* Charts */}
              <div className="charts-grid">
                <ChartCard title="Top Products Sold">
                  <Bar 
                    data={{
                      labels: details.topProducts.map(p => p._id),
                      datasets: [{
                        label: 'Quantity',
                        data: details.topProducts.map(p => p.totalQty),
                        backgroundColor: 'var(--primary-500)',
                      }]
                    }}
                    options={{ 
                      maintainAspectRatio: false, 
                      indexAxis: 'y',
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          ticks: {
                            callback: function(value) {
                              const label = this.getLabelForValue(value);
                              return label && label.length > 18 ? label.substring(0, 16) + '...' : label;
                            },
                            font: { size: 10 }
                          }
                        }
                      }
                    }}
                  />
                </ChartCard>

                <ChartCard title="City Breakdown">
                  <Doughnut 
                    data={{
                      labels: details.cityBreakdown.map(c => c._id),
                      datasets: [{
                        data: details.cityBreakdown.map(c => c.totalRevenue),
                        backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
                        borderWidth: 0
                      }]
                    }}
                    options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                  />
                </ChartCard>
              </div>

              {/* Top Customers Table */}
              <div className="data-table-wrapper" style={{ marginBottom: '20px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Top Customers for {details.salesperson}</h3>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>City</th>
                      <th>Orders</th>
                      <th>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.topCustomers.map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{c._id}</td>
                        <td>{c.city}</td>
                        <td>{c.totalOrders}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{formatCurrency(c.totalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="no-data" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <FiUsers className="no-data-icon" />
              <h3>Select a Salesperson</h3>
              <p>Click on a salesperson from the list to view detailed analytics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Salesperson;
