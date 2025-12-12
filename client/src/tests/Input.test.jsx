import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../components/common/Input';

describe('Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render input with label', () => {
    render(<Input label="Username" name="username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<Input name="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should display error message', () => {
    render(<Input name="test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error styling when error exists', () => {
    render(<Input name="test" error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-500');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input name="test" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should render with placeholder', () => {
    render(<Input name="test" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should render with email type', () => {
    render(<Input name="test" type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('should render with password type', () => {
    render(<Input name="test" type="password" />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
  });

  it('should render with default value', () => {
    render(<Input name="test" value="default" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('default');
  });
});
