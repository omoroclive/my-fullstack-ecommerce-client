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
      const token = localStorage.getItem("token");

      const baseURL = "https://ecommerce-server-c6w5.onrender.com";
      try {
        const [expensesRes, inventoryRes] = await Promise.all([
          fetch(`${baseURL}/api/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${baseURL}/api/inventory`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!expensesRes.ok || !inventoryRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [expenses, inventory] = await Promise.all([
          expensesRes.json(),
          inventoryRes.json(),
        ]);

        setExpensesData(expenses);
        setInventoryData(inventory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = expensesData.reduce((sum, e) => sum + (e.revenue_generated || 0), 0);
  const totalExpenses = expensesData.reduce((sum, e) => sum + (e.expenses_amount || 0), 0);
  const totalOrders = inventoryData.reduce((sum, i) => sum + (i.sold_items || 0), 0);

  const statCards = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: <AttachMoneyIcon fontSize="large" />,
      color: "#4CAF50",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: <MoneyOffIcon fontSize="large" />,
      color: "#F44336",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#2196F3",
    },
  ];

  const revenueVsExpensesData = expensesData.map((e) => ({
    date: new Date(e.date).toLocaleDateString(),
    Revenue: e.revenue_generated,
    Expenses: e.expenses_amount,
  }));

  const brandData = inventoryData.reduce((acc, item) => {
    const { brand, sold_items, stock_balance } = item;
    if (!acc[brand]) acc[brand] = { sold: 0, stock: 0 };
    acc[brand].sold += sold_items || 0;
    acc[brand].stock += stock_balance || 0;
    return acc;
  }, {});

  const chartData = Object.entries(brandData).map(([brand, data]) => ({
    brand,
    "Sold Items": data.sold,
    "Stock Balance": data.stock,
  }));

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(45deg, rgba(66,66,74,0.02), rgba(25,118,210,0.08))",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontWeight: 700,
            background: "linear-gradient(45deg, #1976d2, #42424a)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Analytics Dashboard
        </Typography>

        <Grid container spacing={3}>
          {statCards.map(({ title, value, icon, color }) => (
            <Grid item xs={12} md={4} key={title}>
              <Card
                sx={{
                  borderRadius: 4,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                  background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        color,
                        bgcolor: `${color}15`,
                      }}
                    >
                      {icon}
                    </Box>
                    <Box>
                      <Typography variant="body1" color="text.secondary">
                        {title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {value.toLocaleString()}
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
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Revenue vs. Expenses Trend
            </Typography>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueVsExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Revenue" stroke="#4CAF50" strokeWidth={2} />
                  <Line type="monotone" dataKey="Expenses" stroke="#F44336" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Brand Performance
            </Typography>
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" />
                  <YAxis />
                  <Tooltip />
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
