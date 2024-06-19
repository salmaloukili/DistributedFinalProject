import React, { useEffect, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
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
import { getCallable, auth } from 'src/utils/firebase';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import AppWidgetSummary from '../app-widget-summary';

function PackagePurchaseDetails({ packages, users }) {
  const getTotalPrice = (pkg) => {
    const eventPrice = pkg?.others?.event?.price || 0;
    const transportPrice = pkg?.others?.transportation?.price || 0;
    const foodPrice = pkg?.others?.food?.price || 0;
    return parseFloat(eventPrice) + parseFloat(transportPrice) + parseFloat(foodPrice);
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.uid === userId);
    return user ? user.displayName : userId;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Package Purchase Details
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>{getUserName(pkg.user_id)}</TableCell>
                <TableCell>{pkg.others?.event?.name || 'N/A'}</TableCell>
                <TableCell>
                  {pkg.ticket?.created_at?._seconds
                    ? new Date(pkg.ticket.created_at._seconds * 1000).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>{getTotalPrice(pkg).toFixed(2)} EUR</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

PackagePurchaseDetails.propTypes = {
  packages: PropTypes.arrayOf(PropTypes.object).isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function AppView() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [packagesSold, setPackagesSold] = useState(0);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useLayoutEffect(() => {
    const getUsers = async () => {
      onAuthStateChanged(auth, async (_user) => {
        if (_user) {
          const tokenResult = await getIdTokenResult(_user);
          setUser(_user);
          setRole(tokenResult.claims.role || 'user');
        } else {
          setUser(null);
          setRole(null);
        }
      });
    };
    getUsers();
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const getAllUsers = getCallable('endpoints-getAllUsers');
        const getAllPackages = getCallable('endpoints-getAllPackages');

        const [userResponse, packageResponse] = await Promise.all([
          getAllUsers(),
          getAllPackages(),
        ]);

        if (userResponse.data) {
          setTotalUsers(userResponse.data.length);
          setUsers(userResponse.data);
        } else {
          console.error('Error fetching users:', userResponse.data.error);
        }

        if (packageResponse.data) {
          setPackages(packageResponse.data);
          setPackagesSold(packageResponse.data.length);
          const totalSales = packageResponse.data.reduce((total, pkg) => {
            const eventPrice = pkg?.others?.event?.price || 0;
            const transportPrice = pkg?.others?.transportation?.price || 0;
            const foodPrice = pkg?.others?.food?.price || 0;
            return (
              total + (parseFloat(eventPrice) + parseFloat(transportPrice) + parseFloat(foodPrice))
            );
          }, 0);
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
            total={parseFloat(monthlySales.toFixed(2))}
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
          <PackagePurchaseDetails packages={packages} users={users} />
        </Grid>
      </Grid>
    </Container>
  );
}
