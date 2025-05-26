import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || 'month'; // month, week, year

    // Calculate date range
    const now = new Date();
    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else {
      // Default filters based on period
      switch (period) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = { gte: weekAgo };
          break;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          dateFilter = { gte: yearAgo };
          break;
        default: // month
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          dateFilter = { gte: monthAgo };
      }
    }

    // Fetch revenue data (from orders)
    const orders = await prisma.order.findMany({
      where: {
        orderDate: dateFilter,
        status: {
          in: ['DELIVERED', 'PROCESSING', 'SHIPPED']
        }
      },
      include: {
        product: true,
        user: true
      },
      orderBy: {
        orderDate: 'desc'
      }
    });

    // Fetch employee salary costs
    const employees = await prisma.employee.findMany({
      where: {
        status: 'Active',
        hireDate: {
          lte: now
        }
      }
    });

    // Fetch extra costs
    const extraCosts = await prisma.extraCost.findMany({
      where: {
        date: dateFilter
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalSalaryCosts = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const totalExtraCosts = extraCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const totalExpenses = totalSalaryCosts + totalExtraCosts;
    const netProfit = totalRevenue - totalExpenses;

    // Group revenue by day for chart
    const revenueByDay = orders.reduce((acc: any, order) => {
      const date = order.orderDate.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + order.totalPrice;
      return acc;
    }, {});

    // Group expenses by category
    const expensesByCategory = {
      salaries: totalSalaryCosts,
      ...extraCosts.reduce((acc: any, cost) => {
        acc[cost.category] = (acc[cost.category] || 0) + cost.amount;
        return acc;
      }, {})
    };

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalExpenses,
        netProfit,
        totalOrders: orders.length,
        activeEmployees: employees.length
      },
      revenue: {
        orders,
        byDay: revenueByDay
      },
      expenses: {
        salaries: {
          total: totalSalaryCosts,
          employees
        },
        extraCosts,
        byCategory: expensesByCategory
      },
      period: {
        startDate: (dateFilter as any).gte || null,
        endDate: (dateFilter as any).lte || null,
        period
      }
    });

  } catch (error) {
    console.error('Error fetching finances:', error);
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 });
  }
}