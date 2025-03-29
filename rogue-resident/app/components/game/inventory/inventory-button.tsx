'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectItems } from '@/lib/redux/slices/inventory-slice';
import { Button } from '@/components/ui/button';
import { InventoryPanel } from './inventory-panel';

export function InventoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useAppSelector(selectItems);
  
  const toggleInventory = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <Button
        variant="pixel"
        size="sm"
        onClick={toggleInventory}
        className="flex items-center gap-2"
      >
        <span className="text-md">📦</span>
        <span>Items ({items.length})</span>
      </Button>
      
      {isOpen && (
        <InventoryPanel onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}