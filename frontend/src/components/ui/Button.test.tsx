import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label text', () => {
    render(<Button>Add to Cart</Button>);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Order Now</Button>);

    await userEvent.click(screen.getByRole('button', { name: /order now/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not fire onClick while isLoading', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Checkout
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('respects an explicit disabled prop', () => {
    render(<Button disabled>Checkout</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
