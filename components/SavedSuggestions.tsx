import React, { useState } from "react";
import { SavedSuggestion } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from 'framer-motion';

interface SavedSuggestionsProps {
  suggestions: SavedSuggestion[];
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const SavedSuggestions = ({
  suggestions,
  onDelete,
  onToggleFavorite,
}: SavedSuggestionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });


  const paginatedSuggestions = sortedSuggestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedSuggestions.length / itemsPerPage);

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Saved Suggestions</CardTitle>
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="saved-suggestions-content"
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
            <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'} saved suggestions</span>
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent id="saved-suggestions-content">
              <div className="mb-4">
                <Select onValueChange={(value) => setSortBy(value as 'date' | 'rating')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Sort by Date</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {paginatedSuggestions.length === 0 ? (
                <p>No saved suggestions yet.</p>
              ) : (
                <>
                  {paginatedSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="mb-4">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{suggestion.item}</CardTitle>
                          <RatingStars rating={suggestion.rating} onRate={() => {}} />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleFavorite(suggestion.id)}
                            aria-label={suggestion.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <Heart
                              className={
                                suggestion.isFavorite
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-500"
                              }
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(suggestion.id)}
                            aria-label="Delete suggestion"
                          >
                            <Trash2 className="text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{suggestion.description}</p>
                        <p>From: {suggestion.source}</p>
                        <p>Price: {suggestion.estimatedPrice}</p>
                        <p>Calories: {suggestion.calories}</p>
                        <p>Saved on: {new Date(suggestion.date).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};


export default SavedSuggestions;