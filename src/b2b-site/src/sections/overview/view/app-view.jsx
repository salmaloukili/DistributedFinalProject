import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getCallable } from 'src/utils/firebase';

import AppWidgetSummary from '../app-widget-summary';

function PackagePurchaseDetails() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const getAllPackages = getCallable('endpoints-getAllPackages');
        const response = await getAllPackages();
        if (response.data) {
          setPackages(response.data);
        } else {
          console.error('Error fetching packages:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Package Purchase Details
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>{pkg.package}</TableCell>
                <TableCell>{new Date(pkg.date._seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell>{pkg.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AppView() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [packagesSold, setPackagesSold] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const getAllUsers = getCallable('endpoints-getAllUsers');
        const getAllPackages = getCallable('endpoints-getAllPackages');

        const [userResponse, packageResponse] = await Promise.all([getAllUsers(), getAllPackages()]);

        if (userResponse.data) {
          setTotalUsers(userResponse.data.length);
        } else {
          console.error('Error fetching users:', userResponse.data.error);
        }

        if (packageResponse.data) {
          setPackagesSold(packageResponse.data.length);
          // Assuming you have a `price` field in each package for calculating sales
          const totalSales = packageResponse.data.reduce((total, pkg) => total + parseFloat(pkg.amount || 0), 0);
          setMonthlySales(totalSales);
        } else {
          console.error('Error fetching packages:', packageResponse.data.error);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Users"
            total={totalUsers}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Monthly Sales"
            total={monthlySales}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Packages Sold"
            total={packagesSold}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12}>
          <PackagePurchaseDetails />
        </Grid>
      </Grid>
    </Container>
  );
}
