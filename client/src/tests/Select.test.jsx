import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../components/common/Select';

describe('Select Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ];

  it('should render select with label', () => {
    render(<Select label="Choose option" name="test" options={options} />);
    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select name="test" options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should show placeholder', () => {
    render(<Select name="test" options={options} placeholder="Select..." />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('should call onChange when option selected', () => {
    const handleChange = jest.fn();
    render(<Select name="test" options={options} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should show required indicator', () => {
    render(<Select label="Required" name="test" options={options} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select name="test" options={options} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('should display error message', () => {
    render(<Select name="test" options={options} error="Selection required" />);
    expect(screen.getByText('Selection required')).toBeInTheDocument();
  });

  it('should apply error styling when error exists', () => {
    render(<Select name="test" options={options} error="Error" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-red-500');
  });

  it('should render with selected value', () => {
    render(<Select name="test" options={options} value="2" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('2');
  });

  it('should render empty options array', () => {
    render(<Select name="test" options={[]} />);
    const select = screen.getByRole('combobox');
    expect(select.children).toHaveLength(1); // Only placeholder
  });
});
