import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeSwitch } from '../../components/theme-switch';

const mockSetTheme = jest.fn();
let mockTheme = 'light';

jest.mock('@heroui/use-theme', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

jest.mock('@heroui/switch', () => ({
  useSwitch: ({ isSelected, onChange }) => ({
    Component: ({ children, ...props }) => <div data-testid="switch-component" {...props}>{children}</div>,
    slots: {
      wrapper: ({ class: className }) => className,
    },
    isSelected,
    getBaseProps: (props) => props,
    getInputProps: () => ({
      type: 'checkbox',
      checked: isSelected,
      onChange: () => onChange && onChange(),
    }),
    getWrapperProps: () => ({}),
  }),
}));

jest.mock('@react-aria/visually-hidden', () => ({
  VisuallyHidden: ({ children }) => <div data-testid="visually-hidden">{children}</div>,
}));

describe('ThemeSwitch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = 'light';
  });

  describe('Rendering', () => {
    test('renders switch component after mounting', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toBeInTheDocument();
      });
    });

    test('renders hidden input for accessibility', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        expect(screen.getByTestId('visually-hidden')).toBeInTheDocument();
        const input = screen.getByRole('checkbox');
        expect(input).toBeInTheDocument();
      });
    });
  });

  describe('Theme Toggling', () => {
    test('shows correct aria-label for light mode', async () => {
      mockTheme = 'light';
      render(<ThemeSwitch />);

      await waitFor(() => {
        const switchComponent = screen.getByTestId('switch-component');
        expect(switchComponent).toHaveAttribute('aria-label', 'Switch to dark mode');
      });
    });

    test('shows correct aria-label for dark mode', async () => {
      mockTheme = 'dark';
      render(<ThemeSwitch />);

      await waitFor(() => {
        const switchComponent = screen.getByTestId('switch-component');
        expect(switchComponent).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });

    test('checkbox is checked when theme is light', async () => {
      mockTheme = 'light';
      render(<ThemeSwitch />);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
      });
    });

    test('checkbox is unchecked when theme is dark', async () => {
      mockTheme = 'dark';
      render(<ThemeSwitch />);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
      });
    });

    test('renders switch with light theme', async () => {
      mockTheme = 'light';
      render(<ThemeSwitch />);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    test('renders switch with dark theme', async () => {
      mockTheme = 'dark';
      render(<ThemeSwitch />);

      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Custom Class Names', () => {
    test('applies custom className to base', async () => {
      render(<ThemeSwitch className="custom-class" />);

      await waitFor(() => {
        const switchComponent = screen.getByTestId('switch-component');
        expect(switchComponent.className).toContain('custom-class');
      });
    });

    test('applies custom classNames.base', async () => {
      render(<ThemeSwitch classNames={{ base: 'custom-base' }} />);

      await waitFor(() => {
        const switchComponent = screen.getByTestId('switch-component');
        expect(switchComponent.className).toContain('custom-base');
      });
    });

    test('applies custom classNames.wrapper', async () => {
      render(<ThemeSwitch classNames={{ wrapper: 'custom-wrapper' }} />);

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toBeInTheDocument();
      });
    });

    test('applies default hover and cursor classes', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        const switchComponent = screen.getByTestId('switch-component');
        expect(switchComponent.className).toContain('hover:opacity-80');
        expect(switchComponent.className).toContain('cursor-pointer');
      });
    });
  });

  describe('Hydration Prevention', () => {
    test('shows switch component after effect runs', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('provides proper ARIA label based on current theme', async () => {
      const { rerender } = render(<ThemeSwitch />);

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toHaveAttribute('aria-label', 'Switch to dark mode');
      });

      mockTheme = 'dark';
      rerender(<ThemeSwitch />);

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toHaveAttribute('aria-label', 'Switch to light mode');
      });
    });

    test('input is visually hidden but accessible', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        const visuallyHidden = screen.getByTestId('visually-hidden');
        expect(visuallyHidden).toBeInTheDocument();

        const input = screen.getByRole('checkbox');
        expect(input).toBeInTheDocument();
      });
    });

    test('input has proper checkbox type', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        const input = screen.getByRole('checkbox');
        expect(input).toHaveAttribute('type', 'checkbox');
      });
    });
  });

  describe('Edge Cases', () => {
    test('renders with checkbox input', async () => {
      mockTheme = 'light';
      render(<ThemeSwitch />);

      let checkbox;
      await waitFor(() => {
        checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
      });

      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    test('renders without custom props', async () => {
      render(<ThemeSwitch />);

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toBeInTheDocument();
      });
    });

    test('renders with all custom props', async () => {
      render(
        <ThemeSwitch
          className="custom-base-class"
          classNames={{
            base: 'custom-base',
            wrapper: 'custom-wrapper'
          }}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('switch-component')).toBeInTheDocument();
      });
    });
  });
});
