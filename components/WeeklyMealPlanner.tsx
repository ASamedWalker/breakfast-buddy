import React, { useState, useEffect } from "react";
import { MealPlan, SavedSuggestion } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format, startOfWeek, addDays } from "date-fns";
import { CalendarWidget } from "./CalendarWidget";
import  EditMealModal  from "./EditMealModal";

interface WeeklyMealPlannerProps {
  savedSuggestions: SavedSuggestion[];
}

const WeeklyMealPlanner = ({ savedSuggestions }: WeeklyMealPlannerProps) => {
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [selectedDay, setSelectedDay] = useState(format(new Date(), "EEEE"));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const storedMealPlan = localStorage.getItem("mealPlan");
    if (storedMealPlan) {
      setMealPlan(JSON.parse(storedMealPlan));
    }
  }, []);

  const handleEditMeal = (day: string) => {
    const date = format(
      addDays(currentWeekStart, days.indexOf(day)),
      "yyyy-MM-dd"
    );
    setEditingDate(date);
    setIsEditModalOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setCurrentWeekStart(startOfWeek(date));
    setSelectedDay(format(date, "EEEE"));
  };

  const handleSaveMeal = (date: string, meal: SavedSuggestion) => {
    const newMealPlan = { ...mealPlan, [date]: meal };
    setMealPlan(newMealPlan);
    localStorage.setItem("mealPlan", JSON.stringify(newMealPlan));
    setIsEditModalOpen(false);
  };

  return (
    <Card className="mt-8">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Weekly Meal Planner</h2>
          <CalendarWidget onDateSelect={handleDateSelect} />
        </div>
        <div className="flex justify-between mb-4">
          <Button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          >
            Previous Week
          </Button>
          <span>
            {format(currentWeekStart, "MMMM d, yyyy")} -{" "}
            {format(addDays(currentWeekStart, 6), "MMMM d, yyyy")}
          </span>
          <Button
            onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          >
            Next Week
          </Button>
        </div>
        <Tabs value={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="grid grid-cols-7">
            {days.map((day, index) => (
              <TabsTrigger key={day} value={day} className="text-sm">
                {format(addDays(currentWeekStart, index), "EEE d")}
              </TabsTrigger>
            ))}
          </TabsList>
          {days.map((day, index) => (
            <TabsContent key={day} value={day}>
              <Card>
                <CardContent className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">{day}</h3>
                  <p>
                    {mealPlan[
                      format(addDays(currentWeekStart, index), "yyyy-MM-dd")
                    ]?.item || "No meal planned"}
                  </p>
                  <Button onClick={() => handleEditMeal(day)} className="mt-2">
                    {mealPlan[
                      format(addDays(currentWeekStart, index), "yyyy-MM-dd")
                    ]
                      ? "Edit Meal"
                      : "Add Meal"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      {isEditModalOpen && editingDate && (
        <EditMealModal
          date={editingDate}
          currentMeal={mealPlan[editingDate]}
          savedSuggestions={savedSuggestions}
          onSave={handleSaveMeal}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </Card>
  );
};

export default WeeklyMealPlanner;
