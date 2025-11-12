import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportsCharts from '../../components/pages/reports/ReportsCharts';

jest.mock('@chakra-ui/charts', () => ({
  Chart: {
    Root: ({ children }) => <div data-testid="chart-root">{children}</div>,
  },
  useChart: jest.fn(() => ({
    color: (colorName) => colorName === 'primary' ? '#667eea' : '#f093fb',
  })),
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children, data }) => <div data-testid="line-chart" data-length={data.length}>{children}</div>,
  BarChart: ({ children, data }) => <div data-testid="bar-chart" data-length={data.length}>{children}</div>,
  Line: ({ dataKey, name }) => <div data-testid={`line-${dataKey}`} data-name={name} />,
  Bar: ({ dataKey, name }) => <div data-testid={`bar-${dataKey}`} data-name={name} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockGrowthRecords = [
  { date: '2024-01-01', height: '50', weight: '7.5' },
  { date: '2024-01-15', height: '51', weight: '8.0' },
  { date: '2024-02-01', height: '52', weight: '8.5' },
];

const mockSleepRecords = [
  { date: '2024-01-01', sleep_duration: '8.5' },
  { date: '2024-01-02', sleep_duration: '9.0' },
  { date: '2024-01-03', sleep_duration: '7.5' },
];

const mockFeedingRecords = [
  { date: '2024-01-01', amount: '4' },
  { date: '2024-01-01', amount: '5' },
  { date: '2024-01-02', amount: '6' },
];

describe('ReportsCharts Component', () => {
  describe('Loading State', () => {
    test('displays loading message when loading is true', () => {
      render(
        <ReportsCharts
          loading={true}
          selectedChart="growth"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText('Loading reports...')).toBeInTheDocument();
    });
  });

  describe('Growth Chart', () => {
    test('renders growth chart with data', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={mockGrowthRecords}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText('Height Over Time')).toBeInTheDocument();
      expect(screen.getByText('Weight Over Time')).toBeInTheDocument();
      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
      expect(screen.getByTestId('line-height')).toBeInTheDocument();
      expect(screen.getByTestId('line-weight')).toBeInTheDocument();
    });

    test('displays no data message when growth records are empty', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText('Height Over Time')).toBeInTheDocument();
      expect(screen.getByText('Weight Over Time')).toBeInTheDocument();
      expect(screen.getAllByText('No growth records available')).toHaveLength(2);
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    test('sorts growth records by date', () => {
      const unsortedRecords = [
        { date: '2024-02-01', height: '52', weight: '8.5' },
        { date: '2024-01-01', height: '50', weight: '7.5' },
        { date: '2024-01-15', height: '51', weight: '8.0' },
      ];

      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={unsortedRecords}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    });

    test('handles decimal values in growth records', () => {
      const decimalRecords = [
        { date: '2024-01-01', height: '50.5', weight: '7.25' },
      ];

      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={decimalRecords}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    });
  });

  describe('Sleep Chart', () => {
    test('renders sleep chart with data', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="sleep"
          growthRecords={[]}
          sleepRecords={mockSleepRecords}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText('Sleep Patterns')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-hours')).toBeInTheDocument();
    });

    test('calculates and displays average sleep hours', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="sleep"
          growthRecords={[]}
          sleepRecords={mockSleepRecords}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText(/Average: 8.3 hours/)).toBeInTheDocument();
    });

    test('displays no data message when sleep records are empty', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="sleep"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText('Sleep Patterns')).toBeInTheDocument();
      expect(screen.getByText('No sleep records available')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    test('shows average as 0 when no sleep records', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="sleep"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText(/Average: 0 hours/)).toBeInTheDocument();
    });

    test('sorts sleep records by date', () => {
      const unsortedRecords = [
        { date: '2024-01-03', sleep_duration: '7.5' },
        { date: '2024-01-01', sleep_duration: '8.5' },
        { date: '2024-01-02', sleep_duration: '9.0' },
      ];

      render(
        <ReportsCharts
          loading={false}
          selectedChart="sleep"
          growthRecords={[]}
          sleepRecords={unsortedRecords}
          feedingRecords={[]}
        />
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Feeding Chart', () => {
    test('renders feeding chart with data', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="feeding"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={mockFeedingRecords}
        />
      );

      expect(screen.getByText('Feeding Patterns')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-amount')).toBeInTheDocument();
    });

    test('displays no data message when feeding records are empty', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="feeding"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getByText('Feeding Patterns')).toBeInTheDocument();
      expect(screen.getByText('No feeding records available')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    test('displays feeding records by date', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="feeding"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={mockFeedingRecords}
        />
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toHaveAttribute('data-length', '3');
    });

    test('handles missing amount values', () => {
      const recordsWithMissingAmount = [
        { date: '2024-01-01', amount: '4' },
        { date: '2024-01-01' }, 
      ];

      render(
        <ReportsCharts
          loading={false}
          selectedChart="feeding"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={recordsWithMissingAmount}
        />
      );

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Chart Elements', () => {
    test('includes all necessary chart elements for growth chart', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={mockGrowthRecords}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getAllByTestId('chart-root')).toHaveLength(2);
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
      expect(screen.getAllByTestId('x-axis')).toHaveLength(2);
      expect(screen.getAllByTestId('y-axis')).toHaveLength(2);
      expect(screen.getAllByTestId('cartesian-grid')).toHaveLength(2);
      expect(screen.getAllByTestId('tooltip')).toHaveLength(2);
      expect(screen.getAllByTestId('legend')).toHaveLength(2);
    });

    test('includes all necessary chart elements for sleep chart', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="sleep"
          growthRecords={[]}
          sleepRecords={mockSleepRecords}
          feedingRecords={[]}
        />
      );

      expect(screen.getByTestId('chart-root')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    test('includes all necessary chart elements for feeding chart', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="feeding"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={mockFeedingRecords}
        />
      );

      expect(screen.getByTestId('chart-root')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty arrays for all record types', () => {
      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={[]}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getAllByText('No growth records available')).toHaveLength(2);
    });

    test('handles single record', () => {
      const singleRecord = [{ date: '2024-01-01', height: '50', weight: '7.5' }];

      render(
        <ReportsCharts
          loading={false}
          selectedChart="growth"
          growthRecords={singleRecord}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    });

    test('handles invalid selectedChart value', () => {
      const { container } = render(
        <ReportsCharts
          loading={false}
          selectedChart="invalid"
          growthRecords={mockGrowthRecords}
          sleepRecords={[]}
          feedingRecords={[]}
        />
      );

      expect(container.querySelector('.chartSection')).not.toBeInTheDocument();
    });
  });
});
