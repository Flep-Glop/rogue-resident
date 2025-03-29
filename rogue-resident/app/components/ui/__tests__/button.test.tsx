import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn-pixel')
    expect(button).toHaveClass('bg-slate-800')
  })
  
  it('applies variant styles correctly', () => {
    render(<Button variant="clinical">Clinical Button</Button>)
    
    const button = screen.getByRole('button', { name: /clinical button/i })
    expect(button).toHaveClass('bg-clinical')
    expect(button).toHaveClass('border-clinical-accent')
  })
  
  it('applies size styles correctly', () => {
    render(<Button size="lg">Large Button</Button>)
    
    const button = screen.getByRole('button', { name: /large button/i })
    expect(button).toHaveClass('h-12')
    expect(button).toHaveClass('px-6')
    expect(button).toHaveClass('text-lg')
  })
  
  it('combines custom className with variant styles', () => {
    render(<Button className="custom-class" variant="qa">Custom Button</Button>)
    
    const button = screen.getByRole('button', { name: /custom button/i })
    expect(button).toHaveClass('custom-class')
    expect(button).toHaveClass('bg-qa')
  })
  
  it('handles click events correctly', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('has proper disabled state', () => {
    render(<Button disabled>Disabled Button</Button>)
    
    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })
})