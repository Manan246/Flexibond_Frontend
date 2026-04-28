import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiDollarSign, FiShoppingCart, FiUsers, FiPackage, FiTrendingUp } from 'react-icons/fi';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import FilterBar from '../components/FilterBar';
import {
  getDashboardSummary,
  getRevenueTrend,
  getTopProducts,
  getTopCustomers,
  getCategoryBreakdown,
  getGeographic,
  getColourAnalysis,
  getSizeAnalysis,
  getFilters
} from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '', endDate: '', salesperson: '', category: '', state: ''
  });
  const [metric, setMetric] = useState('revenue');
  const [trendGroupBy, setTrendGroupBy] = useState('day');
  const [filterOptions, setFilterOptions] = useState({});
  const [data, setData] = useState({
    summary: null,
    trend: null,
    products: null,
    customers: null,
    categories: null,
    geo: null,
    colours: null,
    thickness: null,
    dimensions: null
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        summaryRes, trendRes, productsRes, 
        customersRes, catRes, geoRes, colourRes, sizeRes, filtersRes
      ] = await Promise.all([
        getDashboardSummary(filters),
        getRevenueTrend({ ...filters, groupBy: trendGroupBy }),
        getTopProducts({ ...filters, limit: 10, sortBy: metric === 'revenue' ? 'totalAmount' : 'totalQty' }),
        getTopCustomers({ ...filters, limit: 5, sortBy: metric === 'revenue' ? 'totalRevenue' : 'totalQty' }),
        getCategoryBreakdown({ ...filters, sortBy: metric === 'revenue' ? 'totalAmount' : 'totalQty' }),
        getGeographic({ ...filters, groupBy: 'state', sortBy: metric === 'revenue' ? 'totalRevenue' : 'totalQty' }),
        getColourAnalysis({ ...filters, limit: 10, sortBy: metric === 'revenue' ? 'totalAmount' : 'totalQty' }),
        getSizeAnalysis({ ...filters, sortBy: metric === 'revenue' ? 'totalAmount' : 'totalQty' }),
        getFilters()
      ]);

      setData({
        summary: summaryRes.data.data,
        trend: trendRes.data.data,
        products: productsRes.data.data,
        customers: customersRes.data.data,
        categories: catRes.data.data,
        geo: geoRes.data.data,
        colours: colourRes.data.data,
        thickness: sizeRes.data.data.thickness,
        dimensions: sizeRes.data.data.dimensions
      });
      setFilterOptions(filtersRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, trendGroupBy, metric]);

  const handleFilterChange = (newFilters, clear = false) => {
    if (clear) {
      setFilters({ startDate: '', endDate: '', salesperson: '', category: '', state: '' });
    } else {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  const formatNumber = (val) => new Intl.NumberFormat('en-IN').format(val || 0);

  if (loading && !data.summary) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Chart Configs
  const trendChartData = {
    labels: data.trend?.map(d => d._id) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.trend?.map(d => metric === 'revenue' ? d.revenue : d.qty) || [],
      borderColor: 'var(--primary-500)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const productsChartData = {
    labels: data.products?.map(d => d._id) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.products?.map(d => metric === 'revenue' ? d.totalAmount : d.totalQty) || [],
      backgroundColor: 'var(--primary-400)',
      borderRadius: 4
    }]
  };

  const catChartData = {
    labels: data.categories?.map(d => d._id) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.categories?.map(d => metric === 'revenue' ? d.totalAmount : d.totalQty) || [],
      backgroundColor: [
        '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe',
        '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'
      ],
      borderWidth: 0
    }]
  };

  const coloursChartData = {
    labels: data.colours?.map(d => d._id) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.colours?.map(d => metric === 'revenue' ? d.totalAmount : d.totalQty) || [],
      backgroundColor: '#10b981',
      borderRadius: 4
    }]
  };

  const thicknessChartData = {
    labels: data.thickness?.map(d => d.label) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.thickness?.map(d => metric === 'revenue' ? d.totalAmount : d.totalQty) || [],
      backgroundColor: '#8b5cf6',
      borderRadius: 4
    }]
  };

  const dimensionsChartData = {
    labels: data.dimensions?.map(d => d.label) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.dimensions?.map(d => metric === 'revenue' ? d.totalAmount : d.totalQty) || [],
      backgroundColor: '#ec4899',
      borderRadius: 4
    }]
  };

  const geoChartData = {
    labels: data.geo?.map(d => d._id) || [],
    datasets: [{
      label: metric === 'revenue' ? 'Revenue' : 'Quantity',
      data: data.geo?.map(d => metric === 'revenue' ? d.totalRevenue : d.totalQty) || [],
      backgroundColor: '#f59e0b',
      borderRadius: 4
    }]
  };

  return (
    <div className="page-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Key performance indicators and revenue analytics for Flexibond</p>
        </div>
        <div className="metric-toggle" style={{ display: 'flex', gap: '4px', background: 'var(--bg-light)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setMetric('revenue')} 
            style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: metric === 'revenue' ? '#fff' : 'transparent', boxShadow: metric === 'revenue' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', color: metric === 'revenue' ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            Revenue
          </button>
          <button 
            onClick={() => setMetric('qty')} 
            style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: metric === 'qty' ? '#fff' : 'transparent', boxShadow: metric === 'qty' ? 'var(--shadow-sm)' : 'none', fontWeight: 600, cursor: 'pointer', color: metric === 'qty' ? 'var(--primary-600)' : 'var(--text-secondary)' }}>
            Quantity
          </button>
        </div>
      </div>

      <FilterBar filters={filters} options={filterOptions} onFilterChange={handleFilterChange} />

      {data.summary && (
        <div className="kpi-grid">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(data.summary.totalRevenue)}
            icon={<FiDollarSign />}
            color="blue"
            trend={12.5}
            subtext="vs previous period"
          />
          <KPICard
            title="Total Orders"
            value={formatNumber(data.summary.totalOrders)}
            icon={<FiShoppingCart />}
            color="green"
          />
          <KPICard
            title="Avg Order Value"
            value={formatCurrency(data.summary.avgOrderValue)}
            icon={<FiTrendingUp />}
            color="orange"
          />
          <KPICard
            title="Unique Customers"
            value={formatNumber(data.summary.uniqueCustomers)}
            icon={<FiUsers />}
            color="red"
          />
          <KPICard
            title="Quantity Sold"
            value={formatNumber(data.summary.totalQty)}
            icon={<FiPackage />}
            color="blue"
          />
        </div>
      )}

      <div className="charts-grid">
        <ChartCard 
          title={`${metric === 'revenue' ? 'Revenue' : 'Quantity'} Trend`} 
          fullWidth 
          extra={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setTrendGroupBy('day')} 
                className={`toggle-btn ${trendGroupBy === 'day' ? 'active' : ''}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: trendGroupBy === 'day' ? 'var(--primary-600)' : 'var(--bg-card)',
                  color: trendGroupBy === 'day' ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Days
              </button>
              <button 
                onClick={() => setTrendGroupBy('month')} 
                className={`toggle-btn ${trendGroupBy === 'month' ? 'active' : ''}`}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: trendGroupBy === 'month' ? 'var(--primary-600)' : 'var(--bg-card)',
                  color: trendGroupBy === 'month' ? '#fff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Months
              </button>
            </div>
          }
        >
          <Line data={trendChartData} options={{ maintainAspectRatio: false }} />
        </ChartCard>
        
        <ChartCard title={`Top Products (${metric === 'revenue' ? 'Revenue' : 'Quantity'})`}>
          <Bar 
            data={productsChartData} 
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

        <ChartCard title="Category Breakdown">
          <Doughnut 
            data={catChartData} 
            options={{ 
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: { legend: { position: 'bottom' } }
            }} 
          />
        </ChartCard>

        <ChartCard title="Colour Breakdown">
          <Bar 
            data={coloursChartData} 
            options={{ 
              maintainAspectRatio: false,
              indexAxis: 'y', // Horizontal
              plugins: { legend: { display: false } }
            }} 
          />
        </ChartCard>

        <ChartCard title="Thickness Preference">
          <Bar 
            data={thicknessChartData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </ChartCard>

        <ChartCard title="Dimensions Preference (Feet)">
          <Bar 
            data={dimensionsChartData} 
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

        <ChartCard title={`${metric === 'revenue' ? 'Revenue' : 'Quantity'} by State`}>
          <Bar 
            data={geoChartData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </ChartCard>

        <div className="data-table-wrapper" style={{ gridColumn: '1 / -1' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Top Customers</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>City</th>
                <th>State</th>
                <th>Salesperson</th>
                <th>Orders</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.customers?.map((cust, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{cust._id}</td>
                  <td>{cust.city}</td>
                  <td>{cust.state}</td>
                  <td>{cust.salesperson}</td>
                  <td>{cust.totalOrders}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(cust.totalRevenue)}</td>
                </tr>
              ))}
              {(!data.customers || data.customers.length === 0) && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>No customer data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
