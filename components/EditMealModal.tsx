import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavedSuggestion } from '../types';

interface EditMealModalProps {
  date: string;
  currentMeal: SavedSuggestion | null;
  savedSuggestions: SavedSuggestion[];
  onSave: (date: string, meal: SavedSuggestion) => void;
  onClose: () => void;
}

const EditMealModal: React.FC<EditMealModalProps> = ({
  date,
  currentMeal,
  savedSuggestions,
  onSave,
  onClose
}) => {
  const [selectedMeal, setSelectedMeal] = useState<SavedSuggestion | null>(currentMeal);

  const handleSave = () => {
    if (selectedMeal) {
      onSave(date, selectedMeal);
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black'>
        <DialogHeader>
          <DialogTitle>Edit Meal for {date}</DialogTitle>
        </DialogHeader>
        <Select
          value={selectedMeal?.id}
          onValueChange={(value) => setSelectedMeal(savedSuggestions.find(s => s.id === value) || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a meal" />
          </SelectTrigger>
          <SelectContent>
            {savedSuggestions.map((suggestion) => (
              <SelectItem key={suggestion.id} value={suggestion.id}>
                {suggestion.item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedMeal}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMealModal;