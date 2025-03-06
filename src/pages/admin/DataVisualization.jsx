import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Container,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const DataVisualization = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("token");
      try {
        const [expensesRes, inventoryRes] = await Promise.all([
          fetch("http://localhost:3000/api/expenses", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch("http://localhost:3000/api/inventory", {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        if (!expensesRes.ok || !inventoryRes.ok) 
          throw new Error("Failed to fetch data");

        const [expensesData, inventoryData] = await Promise.all([
          expensesRes.json(),
          inventoryRes.json(),
        ]);

        setExpensesData(expensesData);
        setInventoryData(inventoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = expensesData.reduce((sum, item) => sum + item.revenue_generated, 0);
  const totalExpenses = expensesData.reduce((sum, item) => sum + item.expenses_amount, 0);
  const totalOrderedItems = inventoryData.reduce((sum, item) => sum + item.sold_items, 0);

  const statCards = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: "#4CAF50",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: <MoneyOffIcon sx={{ fontSize: 40 }} />,
      color: "#F44336",
    },
    {
      title: "Total Orders",
      value: totalOrderedItems,
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: "#2196F3",
    },
  ];

  const revenueVsExpensesData = expensesData.map((expense) => ({
    date: new Date(expense.date).toLocaleDateString(),
    Revenue: expense.revenue_generated,
    Expenses: expense.expenses_amount,
  }));

  const brandData = inventoryData.reduce((acc, item) => {
    if (!acc[item.brand]) {
      acc[item.brand] = { sold: 0, stock: 0 };
    }
    acc[item.brand].sold += item.sold_items;
    acc[item.brand].stock += item.stock_balance;
    return acc;
  }, {});

  const chartData = Object.entries(brandData).map(([brand, data]) => ({
    brand,
    "Sold Items": data.sold,
    "Stock Balance": data.stock,
  }));

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Typography color="error" variant="h6">Error: {error}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          background: 'linear-gradient(45deg, rgba(66,66,74,0.02) 0%, rgba(25,118,210,0.08) 100%)',
          borderRadius: 4,
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #42424a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Analytics Dashboard
        </Typography>

        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid item xs={12} md={4} key={card.title}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                  background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        color: card.color,
                        bgcolor: `${card.color}15`,
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box>
                      <Typography variant="body1" color="text.secondary">
                        {card.title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {card.value.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Revenue vs. Expenses Trend
            </Typography>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueVsExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={{ stroke: '#4CAF50', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Expenses" 
                    stroke="#F44336" 
                    strokeWidth={2}
                    dot={{ stroke: '#F44336', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Brand Performance
            </Typography>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Sold Items" fill="#2196F3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Stock Balance" fill="#FF9800" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DataVisualization;


